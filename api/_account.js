// Accounts, sync and AI cost logging, on Supabase. (Files starting with _ in api/ aren't endpoints; claude.js uses this.)
//
// Sign-in happens in the page, directly with Supabase (email + 6-digit code). The page then sends its access token
// with every request; here it's checked with Supabase, which says whose it is.
// Data lives in Supabase Storage as JSON files in a private bucket, read and written only from here with the secret
// key, so no database tables or access rules have to be set up:
//   users/<id>/data.json            the words, learned list and daily tallies (merged on every sync)
//   users/<id>/backups/<day>.json   the previous version, one per day
//   usage/<id>/<day>.json           every AI call that day: action, model, tokens, estimated cost
//   users/<id>/profile.json         your friend code and the name friends see
//   users/<id>/friends.json         the ids of your friends (both sides always list each other)
//   users/<id>/public.json          what friends see: name, words by stage, this week, the chart (written at sync)
//   codes/<code>.json               a friend code -> its owner's id

const env = (...names) => { for (const n of names) if (process.env[n]) return process.env[n]; return ""; };
const SB_URL = () => env("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL").replace(/\/+$/, "");
const SB_ANON = () => env("SUPABASE_ANON_KEY", "SUPABASE_PUBLISHABLE_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
const SB_SECRET = () => env("SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY");
const BUCKET = "radical";

// New-style keys (sb_...) go in the apikey header only; old-style keys (JWTs) also go in Authorization.
const keyHeaders = key => key.startsWith("sb_") ? { apikey: key } : { apikey: key, Authorization: `Bearer ${key}` };

function status() {
  const missing = [];
  if (!SB_URL()) missing.push("SUPABASE_URL");
  if (!SB_ANON()) missing.push("SUPABASE_ANON_KEY");
  if (!SB_SECRET()) missing.push("SUPABASE_SECRET_KEY");
  return { ok: !missing.length, missing };
}
const config = () => ({ url: SB_URL(), anon: SB_ANON() });

// Who sent this request: a signed-in user (from their access token), or null.
async function userOf(req) {
  const h = String(req.headers.authorization || "");
  const token = h.startsWith("Bearer ") ? h.slice(7).trim() : "";
  if (!token || !SB_URL() || !SB_ANON()) return null;
  try {
    const r = await fetch(`${SB_URL()}/auth/v1/user`, { headers: { apikey: SB_ANON(), Authorization: `Bearer ${token}` } });
    if (!r.ok) return null;
    const u = await r.json();
    return u && u.id ? { id: u.id, email: u.email || "" } : null;
  } catch (e) { return null; }
}

// ---- storage
let bucketReady = null;
function ensureBucket() {
  if (!bucketReady) bucketReady = fetch(`${SB_URL()}/storage/v1/bucket`, {
    method: "POST", headers: { ...keyHeaders(SB_SECRET()), "content-type": "application/json" },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: false })
  }).then(async r => {
    if (r.ok) return true;
    const t = await r.text();
    if (/already exists|Duplicate|409/i.test(t) || r.status === 409) return true;
    throw new Error(`Storage: ${r.status} ${t.slice(0, 160)}`);
  }).catch(e => { bucketReady = null; throw e; });
  return bucketReady;
}
async function getJSON(path) {
  await ensureBucket();
  const r = await fetch(`${SB_URL()}/storage/v1/object/${BUCKET}/${path}`, { headers: keyHeaders(SB_SECRET()) });
  if (r.status === 404 || r.status === 400) return null;  // not there yet
  if (!r.ok) throw new Error(`Storage read ${r.status}`);
  try { return JSON.parse(await r.text()); } catch (e) { return null; }
}
async function putJSON(path, obj) {
  await ensureBucket();
  const r = await fetch(`${SB_URL()}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST", headers: { ...keyHeaders(SB_SECRET()), "content-type": "application/json", "x-upsert": "true", "cache-control": "no-cache" },
    body: JSON.stringify(obj)
  });
  if (!r.ok) throw new Error(`Storage write ${r.status} ${(await r.text()).slice(0, 160)}`);
}
// Names directly under a folder (files and subfolders), e.g. list("usage") -> user ids.
async function list(prefix) {
  await ensureBucket();
  const out = [];
  for (let offset = 0; ; offset += 1000) {
    const r = await fetch(`${SB_URL()}/storage/v1/object/list/${BUCKET}`, {
      method: "POST", headers: { ...keyHeaders(SB_SECRET()), "content-type": "application/json" },
      body: JSON.stringify({ prefix, limit: 1000, offset, sortBy: { column: "name", order: "asc" } })
    });
    if (!r.ok) throw new Error(`Storage list ${r.status}`);
    const page = await r.json();
    out.push(...page.map(x => x.name).filter(n => n && n !== ".emptyFolderPlaceholder"));
    if (page.length < 1000) return out;
  }
}
const day = (t = Date.now()) => new Date(t).toISOString().slice(0, 10);

// ---- sync: the account keeps one merged copy. Each word carries t (when it last changed on some device); the newer
// copy wins. Deleted words leave a tombstone (word -> when) so a delete on one phone isn't undone by another.
function merge(a, b) {
  a = a || {}; b = b || {};
  const deleted = { ...(a.deleted || {}) };
  for (const [w, t] of Object.entries(b.deleted || {})) deleted[w] = Math.max(deleted[w] || 0, +t || 0);
  const byWord = new Map();
  for (const w of [...(a.words || []), ...(b.words || [])]) {
    if (!w || typeof w.word !== "string") continue;
    const have = byWord.get(w.word);
    if (!have || (+w.t || 0) > (+have.t || 0)) byWord.set(w.word, w);
  }
  const words = [...byWord.values()].filter(w => !(deleted[w.word] > (+w.t || 0)))
    .sort((x, y) => String(y.added || "").localeCompare(String(x.added || "")));
  const cutoff = Date.now() - 180 * 864e5;  // tombstones older than six months are dropped
  for (const w of Object.keys(deleted)) if (deleted[w] < cutoff) delete deleted[w];
  const learned = { ...(a.learned || {}) };
  for (const [w, d] of Object.entries(b.learned || {})) if (!learned[w] || String(d) < String(learned[w])) learned[w] = d;
  for (const w of Object.keys(learned)) if (deleted[w] && !byWord.has(w)) delete learned[w];
  const familiar = { ...(a.familiar || {}) };  // familiar words (right on two different days), merged the same way
  for (const [w, d] of Object.entries(b.familiar || {})) if (!familiar[w] || String(d) < String(familiar[w])) familiar[w] = d;
  for (const w of Object.keys(familiar)) if (deleted[w] && !byWord.has(w)) delete familiar[w];
  const days = {};
  for (const src of [a.days || {}, b.days || {}]) for (const [d, v] of Object.entries(src)) {
    days[d] = days[d] || {};
    for (const [f, n] of Object.entries(v || {})) days[d][f] = Math.max(days[d][f] || 0, +n || 0);
  }
  // v43: your deck names (and Mine's name): the newer copy wins
  // v44: plus when each was last used ({ key: day })
  const used = u => Object.fromEntries(Object.entries(u && typeof u === "object" ? u : {}).filter(([k, v]) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)).slice(0, 200).map(([k, v]) => [String(k).slice(0, 40), v]));
  // v46: which shared deck ids are which of your decks ({ id: key })
  const ids = u => Object.fromEntries(Object.entries(u && typeof u === "object" ? u : {}).filter(([k, v]) => /^[a-z0-9]{8,16}$/.test(k) && typeof v === "string").slice(0, 100).map(([k, v]) => [k, v.slice(0, 60)]));
  const clean = d => d && typeof d === "object" ? { mine: String(d.mine || "Mine").slice(0, 30), names: (Array.isArray(d.names) ? d.names : []).map(n => String(n).slice(0, 30)).filter(Boolean).slice(0, 100), used: used(d.used), ids: ids(d.ids), t: +d.t || 0 } : null;
  const decks = clean((+((b.decks || {}).t) || 0) > (+((a.decks || {}).t) || 0) ? b.decks : a.decks);
  return { words, deleted, learned, familiar, days, ...(decks ? { decks } : {}) };
}
async function sync(user, incoming) {
  const path = `users/${user.id}/data.json`;
  if (incoming && incoming.summary) await writePublic(user, incoming.summary).catch(() => {});
  const remote = await getJSON(path);
  const merged = { ...merge(remote, incoming), email: user.email, updated: Date.now() };
  if (remote && remote.updated && day(remote.updated) !== day()) await putJSON(`users/${user.id}/backups/${day(remote.updated)}.json`, remote).catch(() => {});
  await putJSON(path, merged);
  return merged;
}

// ---- AI cost: tokens from each response, priced per million tokens (estimates; set the env vars to correct them).
const PRICES = () => ({
  sonnet: [+env("PRICE_SONNET_IN") || 3, +env("PRICE_SONNET_OUT") || 15],
  haiku: [+env("PRICE_HAIKU_IN") || 1, +env("PRICE_HAIKU_OUT") || 5]
});
const DAILY_CAP = () => +env("RADICAL_DAILY_CAP") || .25;  // dollars per person per day: a safety stop, not a budget (v43; was $3)
function costOf(model, usage) {
  const p = PRICES()[/haiku/i.test(model) ? "haiku" : "sonnet"], u = usage || {};
  const inTok = (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0);
  return (inTok * p[0] + (u.output_tokens || 0) * p[1]) / 1e6;
}
// "Today" is the app's day: the page sends its own date (its day starts at 4am local time) in x-radical-day. It's
// trusted only when it's within a day of the server's UTC date; otherwise the UTC date is used.
function dayOf(req) {
  const d = String((req && req.headers && req.headers["x-radical-day"]) || "");
  if (/^\d{4}-\d\d-\d\d$/.test(d) && Math.abs(Date.parse(d + "T12:00:00Z") - Date.now()) < 2 * 864e5) return d;
  return day();
}
const usagePath = (who, today = day()) => `usage/${who}/${today}.json`;
async function spentToday(who, today) { if (!status().ok) return 0; try { const u = await getJSON(usagePath(who, today)); return (u && u.total) || 0; } catch (e) { return 0; } }
async function logUse(who, action, model, usage, email, today) {
  if (!status().ok) return;
  try {
    const path = usagePath(who, today), u = (await getJSON(path)) || { total: 0, calls: [] }, cost = costOf(model, usage);
    if (email) u.email = email;
    u.total = +(u.total + cost).toFixed(6);
    u.calls.push([Date.now(), action, model, (usage && usage.input_tokens) || 0, (usage && usage.output_tokens) || 0, +cost.toFixed(6)]);
    await putJSON(path, u);
  } catch (e) { /* logging never blocks the answer */ }
}

// ---- signed out (v41): a newcomer's first few AI tries (the page allows 10 per device) are capped here too, per network:
// RADICAL_ANON_CAP calls a day (30 unless set) from one address. The address is kept only as a salted hash, in
// anon/<day>/<hash>.json; the calls are logged under usage/anon/ like anyone's.
const ANON_CAP = () => +env("RADICAL_ANON_CAP") || 30;
async function anonTake(req, today = day()) {
  if (!status().ok) return false;  // nowhere to count: no free tries
  const h = req && req.headers || {}, ip = String(h["x-real-ip"] || h["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  const key = require("crypto").createHash("sha256").update(ip + "|" + env("SUPABASE_SECRET_KEY").slice(-12)).digest("hex").slice(0, 20);
  const path = `anon/${today}/${key}.json`, u = (await getJSON(path).catch(() => null)) || { n: 0 };
  if (u.n >= ANON_CAP()) return false;
  u.n++; await putJSON(path, u).catch(() => {});
  return true;
}

// ---- who may do what. Emails come from Vercel env vars, separated by commas or spaces.
//   OWNER_EMAILS   see everyone's AI use (the tally in the menu)
//   TESTER_EMAILS  if set, only these people (and owners) get the AI features; anyone can still sign in and read.
//   GENEROUS_EMAILS  a higher daily AI stop for these people (see capFor)
const emails = name => env(name).toLowerCase().split(/[\s,;]+/).filter(Boolean);
const isOwner = user => !!(user && user.email) && emails("OWNER_EMAILS").includes(user.email.toLowerCase());
// v43: the daily stop depends on who's asking. Owners have none (the Anthropic Console's monthly limit still holds);
// GENEROUS_EMAILS get RADICAL_GENEROUS_CAP ($3 unless set); all signed-out use together gets RADICAL_ANON_POOL ($1).
const capFor = (user, who) => isOwner(user) ? Infinity
  : user && user.email && emails("GENEROUS_EMAILS").includes(user.email.toLowerCase()) ? (+env("RADICAL_GENEROUS_CAP") || 3)
  : who === "anon" ? (+env("RADICAL_ANON_POOL") || 1) : DAILY_CAP();
const mayUseAI = user => { const t = emails("TESTER_EMAILS"); return !t.length || (!!(user && user.email) && (t.includes(user.email.toLowerCase()) || isOwner(user))); };

// v43: a failed AI call (a meaning check that timed out, an unreadable answer...) is noted in the same day file as
// fails: [time, action, reason], so the owners' breakdown can show what's going wrong.
async function logFail(who, action, reason, today) {
  if (!status().ok) return;
  try {
    const path = usagePath(who, today), u = (await getJSON(path)) || { total: 0, calls: [] };
    (u.fails || (u.fails = [])).push([Date.now(), String(action).slice(0, 20), String(reason).slice(0, 60)]);
    if (u.fails.length > 200) u.fails = u.fails.slice(-200);
    await putJSON(path, u);
  } catch (e) {}
}

// ---- AI use: your own this month, and for owners, everyone's today and this month (by feature and by person).
async function usage(user, today = day()) {
  const month = today.slice(0, 7);
  const monthOf = async id => {
    const files = (await list(`usage/${id}`)).filter(n => n.startsWith(month) && n.endsWith(".json"));
    return Promise.all(files.map(async n => ({ day: n.slice(0, 10), u: (await getJSON(`usage/${id}/${n}`)) || { total: 0, calls: [] } })));
  };
  const mine = await monthOf(user.id);
  const out = { month, me: { month: +mine.reduce((a, f) => a + (f.u.total || 0), 0).toFixed(4), calls: mine.reduce((a, f) => a + (f.u.calls || []).length, 0) } };
  if (!isOwner(user)) return out;
  const all = { today: { calls: 0, cost: 0 }, month: { calls: 0, cost: 0 }, byAction: {}, byPerson: [], fails: {} };
  for (const id of await list("usage")) {
    const fs = id === user.id ? mine : await monthOf(id);
    if (!fs.length) continue;
    let email = (fs.find(f => f.u.email) || {}).u?.email || "";
    if (!email && id !== "password" && id !== "anon") { const d = await getJSON(`users/${id}/data.json`).catch(() => null); email = (d && d.email) || ""; }
    const p = { who: id === "password" ? "app password" : id === "anon" ? "signed out" : email || id.slice(0, 8), today: 0, month: 0, calls: 0 };
    for (const f of fs) for (const c of f.u.calls || []) {
      const [, action, , , , cost] = c, isToday = f.day === today;
      p.month += cost; p.calls++; all.month.cost += cost; all.month.calls++;
      if (isToday) { p.today += cost; all.today.cost += cost; all.today.calls++; }
      const a = all.byAction[action] || (all.byAction[action] = { calls: 0, cost: 0, today: 0 });
      a.calls++; a.cost += cost; if (isToday) a.today++;
    }
    for (const f of fs) for (const [, action, reason] of f.u.fails || []) { const k = `${action}: ${reason}`; all.fails[k] = (all.fails[k] || 0) + 1; }
    all.byPerson.push(p);
  }
  const r4 = x => +x.toFixed(4);
  all.today.cost = r4(all.today.cost); all.month.cost = r4(all.month.cost);
  for (const a of Object.values(all.byAction)) a.cost = r4(a.cost);
  all.byPerson.forEach(p => { p.today = r4(p.today); p.month = r4(p.month); });
  all.byPerson.sort((a, b) => b.month - a.month);
  out.all = all;
  return out;
}

const ownerEmails = () => emails("OWNER_EMAILS");
// Feedback is kept as well as emailed, so nothing is lost if an email bounces.
async function saveFeedback(user, today, entry) { if (!status().ok) return; try { await putJSON(`feedback/${today}/${Date.now()}-${String(user.id).slice(0, 8)}.json`, entry); } catch (e) {} }

// ---- friends, by code only: no search and no public list. Each person gets a short code; entering someone's code
// (or opening their link) sends a request (v42), and once they accept you're connected both ways; either side can
// remove it. Friends see only the summary the page sends at sync (numbers and a chart), never words or mistakes.
// Requests live in users/<id>/requests.json ({ ids: [requester ids] }); tries to add a code are capped a day.
const CODE_ABC = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const cleanCode = c => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
const cleanName = n => String(n || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 30);
// v44: a username (anything) plus a real first and last name; friends see the username and "First L."
const realOf = p => p && p.first && p.last ? `${p.first} ${p.last[0].toUpperCase()}.` : "";
const callOf = p => { const r = realOf(p); return p && p.name && r && p.name !== r ? `${p.name} (${r})` : (p && p.name) || r; };
async function profileOf(user) {
  const path = `users/${user.id}/profile.json`;
  let p = await getJSON(path);
  if (p && p.code) return p;
  for (let i = 0; i < 8; i++) {
    let code = ""; for (let k = 0; k < 6; k++) code += CODE_ABC[Math.floor(Math.random() * CODE_ABC.length)];
    if (await getJSON(`codes/${code}.json`)) continue;
    await putJSON(`codes/${code}.json`, { id: user.id });
    p = { ...(p || {}), code, name: (p && p.name) || "" }; await putJSON(path, p); return p;
  }
  throw new Error("Couldn't make a friend code. Try again.");
}
async function writePublic(user, summary) {
  const p = await getJSON(`users/${user.id}/profile.json`); if (!p || !p.code) return;  // only once friends are in use
  const n = x => Math.max(0, Math.round(+x || 0));
  // v41 counts words (summary.words); an older page still sends characters (summary.chars), which friends no longer see
  const words = summary.words, week = summary.week || {};
  const series = words && Array.isArray(summary.series) ? summary.series.slice(-60).map(x => ({ day: String(x.day || "").slice(0, 10), f: n(x.f), l: n(x.l) })) : [];
  await putJSON(`users/${user.id}/public.json`, { name: p.name || realOf(p), real: realOf(p), code: p.code, words: words ? { seen: n(words.seen), familiar: n(words.familiar), learned: n(words.learned) } : null,
    week: { days: Math.min(7, n(week.days)), cards: n(week.cards), read: n(week.read) }, streak: n(summary.streak), series, decks: cleanProgress(summary.decks), updated: Date.now() });
}
// v46: progress on shared decks, by deck id: { id: { n words, f recognized, l mastered } }, at most 30
const DECK_ID = /^[a-z0-9]{8,16}$/;
function cleanProgress(d) {
  if (!d || typeof d !== "object") return {};
  const out = {}, n = x => Math.max(0, Math.round(+x || 0));
  Object.keys(d).filter(k => DECK_ID.test(k)).slice(0, 30).forEach(k => { const x = d[k] || {}; out[k] = { n: n(x.n), f: n(x.f), l: n(x.l) }; });
  return out;
}
async function friendIds(id) { const f = await getJSON(`users/${id}/friends.json`); return Array.isArray(f && f.ids) ? f.ids : []; }
async function setFriendIds(id, ids) { await putJSON(`users/${id}/friends.json`, { ids: [...new Set(ids)].slice(0, 200) }); }
async function requestIds(id) { const f = await getJSON(`users/${id}/requests.json`); return Array.isArray(f && f.ids) ? f.ids : []; }
async function setRequestIds(id, ids) { await putJSON(`users/${id}/requests.json`, { ids: [...new Set(ids)].slice(-50) }); }
const ADD_TRIES = 20;  // codes one account can try a day
async function friendsView(user) {
  const p = await profileOf(user), ids = await friendIds(user.id), rids = await requestIds(user.id);
  const list = (await Promise.all(ids.map(id => getJSON(`users/${id}/public.json`).catch(() => null)))).filter(Boolean)
    .map(x => ({ ...x, name: x.name || x.real || "A friend" }));
  const requests = (await Promise.all(rids.map(id => getJSON(`users/${id}/profile.json`).catch(() => null)))).filter(x => x && x.code)
    .map(x => ({ code: x.code, name: x.name || realOf(x) || "Someone", real: realOf(x) }));
  const inbox = ((await getJSON(`users/${user.id}/inbox.json`).catch(() => null)) || {}).decks || [];
  return { code: p.code, name: p.name || "", first: p.first || "", last: p.last || "", friends: list, requests, inbox, builder: await builderView(user) };
}
// ---- v46: shared decks. A deck you share is a snapshot in decks/<id>.json { id, name, from, by, words, t }: anyone
// with the id can read it (GET action=deck, cached), so a link, a friend's inbox and an Open Message all point at it.
const randId = () => { let s = ""; for (let k = 0; k < 12; k++) s += "abcdefghijkmnpqrstuvwxyz23456789"[Math.floor(Math.random() * 32)]; return s; };
const cleanWords = ws => (Array.isArray(ws) ? ws : []).filter(w => w && typeof w.word === "string" && /\p{Script=Han}/u.test(w.word)).slice(0, 300)
  .map(w => ({ word: w.word.trim().slice(0, 12), pinyin: String(w.pinyin || "").slice(0, 60), meaning: String(w.meaning || "").replace(/[<>]/g, "").slice(0, 80) }));
async function getDeck(id) { return DECK_ID.test(String(id || "")) ? getJSON(`decks/${id}.json`).catch(() => null) : null; }
async function makeDeck(user, deck) {
  const words = cleanWords(deck && deck.words), name = cleanName(deck && deck.name).slice(0, 20) || "Shared deck";
  if (!words.length) return null;
  const p = await profileOf(user), d = { id: randId(), name, from: p.code, by: p.name || realOf(p) || "A friend", words, t: Date.now() };
  await putJSON(`decks/${d.id}.json`, d); return d;
}
const inboxOf = async id => ((await getJSON(`users/${id}/inbox.json`).catch(() => null)) || {}).decks || [];
async function toInbox(id, d) { const ds = (await inboxOf(id)).filter(x => x.id !== d.id); await putJSON(`users/${id}/inbox.json`, { decks: [...ds, { id: d.id, name: d.name, n: d.words.length, by: d.by, t: d.t }].slice(-30) }); }
const SEND_TRIES = 40;  // decks one account can share a day
// ---- v46: the builder. One owner is the builder (builder.json { id }); anyone signed in can follow them one way:
// followers see the builder's row like a friend's and the decks the builder sends to followers; the builder sees only
// how many follow. followers.json { ids } is the builder's list; each follower keeps users/<id>/follow.json { on }.
async function builderId() { const b = await getJSON("builder.json").catch(() => null); return b && b.id || ""; }
async function builderView(user) {
  const id = await builderId(); if (!id) return null;
  if (id === user.id) { const f = await getJSON("followers.json").catch(() => null); return { me: true, followers: Array.isArray(f && f.ids) ? f.ids.length : 0 }; }
  const pub = await getJSON(`users/${id}/public.json`).catch(() => null), fo = await getJSON(`users/${user.id}/follow.json`).catch(() => null);
  const ds = ((await getJSON("builder-decks.json").catch(() => null)) || {}).decks || [];
  return { following: !!(fo && fo.on), name: (pub && (pub.real || pub.name)) || "The builder", row: fo && fo.on && pub ? { ...pub, code: undefined } : null, decks: fo && fo.on ? ds.slice(-12) : [] };
}
async function setFollow(user, on) {
  const id = await builderId(); if (!id || id === user.id) return;
  const f = (await getJSON("followers.json").catch(() => null)) || {}, ids = new Set(Array.isArray(f.ids) ? f.ids : []);
  on ? ids.add(user.id) : ids.delete(user.id);
  await putJSON("followers.json", { ids: [...ids] }); await putJSON(`users/${user.id}/follow.json`, { on: !!on });
}
async function connect(a, b) {
  await setFriendIds(a, [...await friendIds(a), b]);
  await setFriendIds(b, [...await friendIds(b), a]);
  await setRequestIds(a, (await requestIds(a)).filter(x => x !== b));
  await setRequestIds(b, (await requestIds(b)).filter(x => x !== a));
}
async function friends(user, body) {
  const op = body.op || "me";
  if (op === "name") {
    const p = await profileOf(user); p.name = cleanName(body.name);
    if ("first" in body) p.first = cleanName(body.first); if ("last" in body) p.last = cleanName(body.last);
    await putJSON(`users/${user.id}/profile.json`, p);
    const pub = await getJSON(`users/${user.id}/public.json`); if (pub) { pub.name = p.name || realOf(p); pub.real = realOf(p); await putJSON(`users/${user.id}/public.json`, pub); }
  }
  if (body.summary) { await profileOf(user); await writePublic(user, body.summary); }
  // v43, v44: friends see your real name, so adding or accepting needs your first and last name
  if ((op === "add" || op === "accept") && !realOf(await profileOf(user))) return { error: "Add your first and last name first." };
  if (op === "add") {
    const day = new Date().toISOString().slice(0, 10), tp = `users/${user.id}/tries.json`, t = (await getJSON(tp)) || {};
    const n = t.day === day ? t.n || 0 : 0;
    if (n >= ADD_TRIES) return { error: "Too many tries today. Try again tomorrow." };
    await putJSON(tp, { day, n: n + 1 });
    const c = await getJSON(`codes/${cleanCode(body.code)}.json`);
    if (!c || !c.id) return { error: "No one has that code. Check the letters and try again." };
    if (c.id === user.id) return { error: "That's your own code." };
    await profileOf(user);
    const them = await getJSON(`users/${c.id}/profile.json`), name = callOf(them) || "your friend";
    if ((await friendIds(user.id)).includes(c.id)) return { ...(await friendsView(user)), added: name };
    // They already asked you: this is a yes, so connect now
    if ((await requestIds(user.id)).includes(c.id)) { await connect(user.id, c.id); return { ...(await friendsView(user)), added: name }; }
    await setRequestIds(c.id, [...await requestIds(c.id), user.id]);
    return { ...(await friendsView(user)), sent: name };
  }
  if (op === "accept" || op === "decline") {
    const c = await getJSON(`codes/${cleanCode(body.code)}.json`);
    if (c && c.id && (await requestIds(user.id)).includes(c.id)) {
      if (op === "accept") await connect(user.id, c.id);
      else await setRequestIds(user.id, (await requestIds(user.id)).filter(x => x !== c.id));
    }
  }
  // v46: share a deck: to friends (their inbox), to followers (builder only), or just for a link (to: [])
  if (op === "senddeck") {
    const day = new Date().toISOString().slice(0, 10), tp = `users/${user.id}/sends.json`, t = (await getJSON(tp)) || {}, n = t.day === day ? t.n || 0 : 0;
    if (n >= SEND_TRIES) return { error: "That's a lot of sharing for one day. Try again tomorrow." };
    await putJSON(tp, { day, n: n + 1 });
    const d = await makeDeck(user, body.deck); if (!d) return { error: "That deck has no words to share." };
    const mine = await friendIds(user.id), to = (Array.isArray(body.to) ? body.to : []).slice(0, 50);
    for (const code of to) { const c = await getJSON(`codes/${cleanCode(code)}.json`); if (c && c.id && mine.includes(c.id)) await toInbox(c.id, d); }
    if (body.followers) {
      if (!isOwner(user) || (await builderId()) !== user.id) return { error: "Only the builder sends to followers." };
      const b = ((await getJSON("builder-decks.json").catch(() => null)) || {}).decks || [];
      await putJSON("builder-decks.json", { decks: [...b, { id: d.id, name: d.name, n: d.words.length, t: d.t }].slice(-30) });
    }
    return { ...(await friendsView(user)), deck: { id: d.id, name: d.name, n: d.words.length } };
  }
  if (op === "inboxdone") { const id = String(body.id || ""); await putJSON(`users/${user.id}/inbox.json`, { decks: (await inboxOf(user.id)).filter(x => x.id !== id) }); }
  if (op === "follow" || op === "unfollow") await setFollow(user, op === "follow");
  if (op === "bebuilder") { if (!isOwner(user)) return { error: "Owners only." }; await profileOf(user); await putJSON("builder.json", { id: user.id }); }
  if (op === "remove") {
    const c = await getJSON(`codes/${cleanCode(body.code)}.json`);
    if (c && c.id) {
      await setFriendIds(user.id, (await friendIds(user.id)).filter(x => x !== c.id));
      await setFriendIds(c.id, (await friendIds(c.id)).filter(x => x !== user.id));
    }
  }
  return friendsView(user);
}

// ---- the owners' notice (v44): one short message everyone sees once after the splash. notice.json = { id, text, until }.
async function notice() { if (!status().ok) return null; const n = await getJSON("notice.json").catch(() => null); return n && n.text && !(n.until && n.until < day()) ? n : null; }
// v46: every message also goes into notes.json (newest last, at most 50): the menu's Notes from David. Editing a live
// message replaces it there; Take down removes it from both. A message can carry a shared deck { id, name, n }.
async function notes() { if (!status().ok) return []; const n = await getJSON("notes.json").catch(() => null); return Array.isArray(n && n.list) ? n.list : []; }
async function setNotice(user, body) {
  if (!isOwner(user)) return { error: "Owners only." };
  const cur = await getJSON("notice.json").catch(() => null), list = await notes();
  if (body.op === "clear") { await putJSON("notice.json", {}); if (cur && cur.id) await putJSON("notes.json", { list: list.filter(x => x.id !== cur.id) }); return { notice: null }; }
  const text = String(body.text || "").replace(/[\u0000-\u0008<>]/g, "").trim().slice(0, 1200);
  if (!text) return { error: "Write the notice first." };
  const until = /^\d{4}-\d{2}-\d{2}$/.test(body.until || "") ? body.until : "";
  const d = body.deck && await getDeck(body.deck.id), deck = d ? { id: d.id, name: d.name, n: d.words.length } : null;
  const n = { id: Date.now().toString(36), text, until, ...(deck ? { deck } : {}) };
  const keep = list.filter(x => !(body.replace && x.id === body.replace));
  await putJSON("notice.json", n); await putJSON("notes.json", { list: [...keep, n].slice(-50) }); return { notice: n };
}

module.exports = { notice, notes, getDeck, setNotice, anonTake, friends, status, config, userOf, ensureBucket, sync, merge, spentToday, logUse, logFail, DAILY_CAP, capFor, costOf, isOwner, mayUseAI, usage, dayOf, ownerEmails, saveFeedback };
