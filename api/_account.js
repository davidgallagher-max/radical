// Accounts, sync and AI cost logging, on Supabase. (Files starting with _ in api/ aren't endpoints; claude.js uses this.)
//
// Sign-in happens in the page, directly with Supabase (email + 6-digit code). The page then sends its access token
// with every request; here it's checked with Supabase, which says whose it is.
// Data lives in Supabase Storage as JSON files in a private bucket, read and written only from here with the secret
// key, so no database tables or access rules have to be set up:
//   users/<id>/data.json            the words, learned list and daily tallies (merged on every sync)
//   users/<id>/backups/<day>.json   the previous version, one per day
//   usage/<id>/<day>.json           every AI call that day: action, model, tokens, estimated cost

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
  const days = {};
  for (const src of [a.days || {}, b.days || {}]) for (const [d, v] of Object.entries(src)) {
    days[d] = days[d] || {};
    for (const [f, n] of Object.entries(v || {})) days[d][f] = Math.max(days[d][f] || 0, +n || 0);
  }
  return { words, deleted, learned, days };
}
async function sync(user, incoming) {
  const path = `users/${user.id}/data.json`;
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
const DAILY_CAP = () => +env("RADICAL_DAILY_CAP") || 3;  // dollars per user per day: a high safety stop, not a budget
function costOf(model, usage) {
  const p = PRICES()[/haiku/i.test(model) ? "haiku" : "sonnet"], u = usage || {};
  const inTok = (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0);
  return (inTok * p[0] + (u.output_tokens || 0) * p[1]) / 1e6;
}
const usagePath = who => `usage/${who}/${day()}.json`;
async function spentToday(who) { if (!status().ok) return 0; try { const u = await getJSON(usagePath(who)); return (u && u.total) || 0; } catch (e) { return 0; } }
async function logUse(who, action, model, usage) {
  if (!status().ok) return;
  try {
    const path = usagePath(who), u = (await getJSON(path)) || { total: 0, calls: [] }, cost = costOf(model, usage);
    u.total = +(u.total + cost).toFixed(6);
    u.calls.push([Date.now(), action, model, (usage && usage.input_tokens) || 0, (usage && usage.output_tokens) || 0, +cost.toFixed(6)]);
    await putJSON(path, u);
  } catch (e) { /* logging never blocks the answer */ }
}

module.exports = { status, config, userOf, ensureBucket, sync, merge, spentToday, logUse, DAILY_CAP, costOf };
