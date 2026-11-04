// Radical's only server code. It holds the Anthropic API key (from Vercel's
// environment variables, never from the page) and passes requests to Claude:
// study cards, translations, word lists, photo text, and Wikipedia search help.
// Requests must come from a signed-in account (the page sends its Supabase access
// token), so strangers can't spend your credits. The old shared APP_PASSWORD still
// works while it's set in Vercel; delete it there to retire it completely.
// Accounts, sync and the AI cost log live in _account.js.
const account = require("./_account.js");
const topics = require("./_topics.js")(account.storage);
const pay = require("./_pay.js")({ ...account.storage, isOwner: account.isOwner, idForEmail: account.idForEmail });
const answers = require("./_answers.js")(account.storage);  // v63: every AI answer, kept and shared
const POOL_MAX = 3;  // v63: extra example sentences per word, shared, on top of the card's 3

const API = "https://api.anthropic.com/v1/messages";
const CARD_MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5-5";
const FAST_MODEL = process.env.CLAUDE_FAST_MODEL || "claude-haiku-5-5";
const OCR_MODEL = process.env.CLAUDE_OCR_MODEL || FAST_MODEL;  // reading text from photos and scanned pages

// Mainland or Taiwan (v42, the page's 普通话 / 國語 setting, sent as region "cn" or "tw"): readings, word choices and
// the voice of example sentences follow it. Taiwan is the default, so older pages get what they always got.
const MAND = cn => cn ? "Mandarin as spoken in mainland China (Putonghua)" : "Taiwan Mandarin";
const READING = cn => cn ? "standard mainland pronunciation (e.g. 垃圾 lājī)" : "Taiwan pronunciation (e.g. 訊息 xùnxí)";
const CHOICES = cn => cn ? "Use mainland word choices (数据 not 資料, 网络 not 網路)." : "Use Taiwan word choices (資料 not 数据, 網路 not 网络).";

// The card prompt leaves out the learner's own sentence on purpose: the same word
// then always gets the same request, so Vercel's CDN can reuse the card (see below).
const CARD_PROMPT = (word, cn) => `You are making a study card for an adult learner of ${MAND(cn)} (low intermediate, ${cn ? "Simplified" : "Traditional"} characters).
Word: ${word}

Return ONLY a JSON object, no other text, with exactly these keys:
{
  "word": "the word in Traditional characters",
  "simplified": "Simplified form, or empty string if identical",
  "pinyin": "pinyin with tone marks, ${READING(cn)}",
  "meaning": "short English meaning, under 12 words",
  "usage": "one short note on how it is used or a common collocation, or empty string",
  "chars": [ { "char": "one character", "pinyin": "its reading here", "parts": "its parts, e.g. 敬 jìng (sound) + 馬 horse (meaning)", "mnemonic": "one vivid memory hook, under 20 words" } ],
  "examples": [ { "example": "a natural ${MAND(cn)} sentence using the word, ${cn ? "Simplified" : "Traditional"} characters, at low intermediate level", "example_pinyin": "pinyin of the sentence", "example_en": "English translation" } ],
  "related": [ { "word": "related word", "pinyin": "pinyin", "meaning": "short meaning" } ]
}
Give exactly 3 examples, each in a clearly different everyday context. Give 0 to 3 related words that share a character with the word. ${CHOICES(cn)}`;

// v76: the mainland card made from the Taiwan one with the fast model (about a quarter of a full card's cost).
// Meaning and sentences are kept (Taiwan places and Taiwan-style speech are fine); what changes is the script, the
// readings, character parts for characters whose Simplified form is different, and any word that means something
// else (or something crude) on the mainland.
const FLIPS = "小姐 (can mean prostitute), 同志 (comrade vs gay), 窩心 (heartwarming vs upset), 土豆 (peanut vs potato), 機車 (scooter / annoying vs locomotive), 搞 (can be sexual), 幹/干 (a swear word in Taiwan), 雞 (can mean prostitute)";
const CN_FROM_TW = card => `Here is a study card made for a learner of Taiwan Mandarin (Traditional characters, Taiwan readings). Make the same card for a learner of Mandarin as spoken in mainland China (Putonghua, Simplified characters).

Rules:
- Keep "word" exactly as given (Traditional). Keep "meaning" and "usage" unless the mainland meaning or usage differs.
- "simplified": the Simplified form, or empty string if identical.
- "pinyin": the standard mainland reading (e.g. 垃圾 lājī, 和 hé, 星期 xīngqī), tone marks.
- "chars": one entry per character of the word, with "char" in Simplified. If the Simplified form is the same character, keep its parts and mnemonic. If it is different, write new parts and a new mnemonic for the Simplified form.
- "examples": keep each sentence and its English, written in Simplified characters with mainland pinyin. Taiwan places and things are fine. Rewrite a sentence only if it uses a word that means something different, or something rude or sexual, on the mainland (watch for: ${FLIPS}).
- "related": the same words in Simplified with mainland pinyin.

Return ONLY the JSON object with the same keys, no other text.

${JSON.stringify(card)}`;

// v80: and the other way: the Taiwan card made from a mainland one
const TW_FROM_CN = card => `Here is a study card made for a learner of Mandarin as spoken in mainland China (Putonghua, Simplified characters). Make the same card for a learner of Taiwan Mandarin (Traditional characters, Taiwan readings).

Rules:
- "word": the Traditional form. "simplified": the Simplified form, or empty string if identical. Keep "meaning" and "usage" unless the Taiwan meaning or usage differs.
- "pinyin": the standard Taiwan reading (e.g. 垃圾 lèsè, 星期 xīngqí, 頭髮 tóufǎ), tone marks.
- "chars": one entry per character of the word, with "char" in Traditional. If the Traditional form is the same character, keep its parts and mnemonic. If it is different, write new parts and a new mnemonic for the Traditional form.
- "examples": keep each sentence and its English, written in Traditional characters with Taiwan pinyin. Mainland places and things are fine. Change a word only where Taiwan speakers say it differently (出租车 → 計程車, 自行车 → 腳踏車, 土豆 meaning potato → 馬鈴薯), or where it means something different, or something rude or sexual, in Taiwan (watch for: ${FLIPS}).
- "related": the same words in Traditional with Taiwan pinyin.

Return ONLY the JSON object with the same keys, no other text.

${JSON.stringify(card)}`;

const WORDS_PROMPT = (text, cn) => `A learner of ${MAND(cn)} pasted the text below to add words to a vocabulary list. It may be a tidy list, a messy list with pinyin and English mixed in, or sentences.
Pick out the Chinese vocabulary items they most likely want to study: words and set phrases, not whole sentences, and skip particles and very basic words (的, 了, 我, 是) unless the text is clearly just a list.
Keep the learner's own pinyin and English when given; otherwise give ${cn ? "standard mainland" : "Taiwan"} pinyin with tone marks and a short English meaning.
The English in the text often comes from a teacher's notes and can be misspelled or wrong. Fix spelling silently. If the English is actually wrong for the word (not just misspelled), give the right meaning and put the text's original English in "note".
Set "from_text": true when the meaning comes from English in the text (even if you fixed its spelling), false when you supplied it.
Return ONLY JSON: {"words":[{"word":"Traditional characters","pinyin":"...","meaning":"...","from_text":true,"note":""}]}, at most 80 items, in the order they appear.

${text}`;

// Class notes from a photo or PDF page: every item the teacher wrote down, with her English (spelling fixed).
const NOTES_PROMPT = `This is a page of a Taiwan Mandarin learner's class notes, typed or written by their teacher. Chinese is often printed with small pinyin above each character; there is English mixed in.
List every Chinese item on the page the learner might study, in reading order: words, set phrases, grammar patterns (keep a gap as ～, e.g. 在～以內) and example sentences. Skip pure headings and page numbers.
For each item:
- "word": the Chinese exactly as written, Traditional characters, no pinyin, no spaces.
- "kind": "word", "phrase", "pattern" or "sentence".
- "pinyin": the pinyin printed above it if there is any (keep the teacher's Taiwan readings, e.g. 垃圾 lèsè), with tone marks, syllables of one word joined; otherwise "".
- "meaning": the teacher's English for it, with spelling fixed. If she gave none, a short English meaning (for a sentence, its translation). If her English is wrong for the item (not just misspelled), give the right meaning.
- "from_text": true if the page gives English for this item (even if you fixed its spelling), false only when the page has no English for it and you supplied the meaning.
- "english": the English printed on the page for this item, exactly as written; "" if there is none.
- "note": her original English, only when you changed what it means; otherwise "".
Return ONLY JSON: {"items":[{"word":"","kind":"","pinyin":"","meaning":"","from_text":true,"english":"","note":""}]}, at most 60 items.`;

// Fresh example sentences for a word (one or two), different from the ones the learner has.
const EXAMPLE_PROMPT = (word, meaning, avoid, n = 1, cn = false) => `Write ${n === 1 ? `one new natural ${MAND(cn)} example sentence` : `${n} new natural ${MAND(cn)} example sentences, each in a different everyday context,`} (${cn ? "Simplified" : "Traditional"} characters, low intermediate level, ${cn ? "mainland" : "Taiwan"} word choices) using ${word}${meaning ? ` (${meaning})` : ""}.${avoid ? ` Make ${n === 1 ? "it" : "them"} clearly different from these: ${avoid}` : ""}
Return ONLY JSON: {"examples":[{"example":"...","example_pinyin":"pinyin with tone marks","example_en":"English translation"}]}`;
// A card's three examples, kept as example/example_pinyin/example_en too (the first one) for older pages.
function cardExamples(card) {
  const ok = x => x && typeof x.example === "string" && x.example.trim();
  const list = (Array.isArray(card.examples) ? card.examples : []).filter(ok).map(x => ({ example: String(x.example), example_pinyin: String(x.example_pinyin || ""), example_en: String(x.example_en || "") })).slice(0, 3);
  if (!list.length && ok(card)) list.push({ example: card.example, example_pinyin: card.example_pinyin || "", example_en: card.example_en || "" });
  card.examples = list;
  if (list.length) Object.assign(card, list[0]);
  return card;
}

// v90: a short English name for a text the reader added without one
const TITLE_PROMPT = (text) => `Give this Chinese text a short English title (2 to 6 words) that says what it is about, so a learner knows at a glance. Title case. Return only the title, no quotes.

${text}`;
const TRANSLATE_PROMPT = (sentence) => `Translate this Chinese into natural English. Return only the translation, nothing else.

${sentence}`;

// English in (v41): a passage typed or pasted in English becomes Chinese to read; a word or phrase in context gets the
// Chinese words that fit it, best first.
const USAGE = (simp, cn) => `${simp ? "Simplified" : "Traditional"} characters, ${cn ? "mainland" : "Taiwan"} usage`;
const TOZH_TEXT_PROMPT = (text, simp, cn) => `Translate this English into natural Chinese that an adult learner can read: plain, everyday wording. Use ${USAGE(simp, cn)}. Return only the Chinese, nothing else.

${text}`;
const TOZH_WORD_PROMPT = (text, simp, cn) => `A learner of Mandarin wants the Chinese word for this English, in the sense it has here: "${text}"
Give the 1 to 3 Chinese words that fit that sense, best fit first: real dictionary words, the everyday ones. Use ${USAGE(simp, cn)}.
Return ONLY JSON: {"words":[{"word":"the Chinese","pinyin":"pinyin with tone marks","meaning":"short English meaning, under 8 words"}]}`;

// Wikipedia helpers: turn an English search into Chinese search words, and rate articles for a learner.
const ZHQUERY_PROMPT = (q) => `A learner wants to find Chinese Wikipedia articles about this topic, typed in English: "${q}"
Give the Chinese search words a Chinese Wikipedia editor would use for it (Traditional characters, Taiwan usage, usually 1 to 4 words). Return only the Chinese, nothing else.`;

const RATE_PROMPT = (items) => `Rate how hard each Chinese Wikipedia article below would be to read for an adult learner of Mandarin, from 1 (very easy: short sentences, everyday words) to 10 (very hard: dense technical, legal, scientific or classical vocabulary). Judge from the title and the opening text given.
Return ONLY JSON: {"ratings":[{"n":1,"r":5},{"n":2,"r":7}, ...]}: one entry per article, "n" its number in the list and "r" its rating.

${items.map((it, k) => `${k + 1}. ${it.t}\n${it.s}`).join("\n\n")}`;

// Simplify: rewrite one part of an article at a learner's level, keeping the facts.
const LEVELS = { easy: "HSK 2 to 3 (about 600 to 1,200 common words): very short sentences, only everyday words", mid: "HSK 4 (about 2,000 words): short, clear sentences, common words; keep a few key topic words" };
const SIMPLIFY_PROMPT = (text, level, trad) => `Rewrite this passage from Chinese Wikipedia for an adult learner of Mandarin at ${LEVELS[level] || LEVELS.mid}.
Keep the facts, names, numbers and the order of ideas. Do not add anything that isn't in the passage. Shorter is fine; leave out minor details if needed.
Keep one paragraph per paragraph of the original. Write in ${trad ? "Traditional" : "Simplified"} characters. Output only the rewritten Chinese, nothing else.

${text}`;

// Explain one sentence for a learner: how it's built, the grammar points in it, and words used in a less obvious sense.
const EXPLAIN_PROMPT = (sentence, trad, cn) => `Explain this Mandarin sentence to an adult learner at about intermediate level (${cn ? "mainland" : "Taiwan"} Mandarin, ${trad ? "Traditional" : "Simplified"} characters).
Sentence: ${sentence}

Return ONLY JSON with these keys:
{"structure":"one or two short sentences on how the sentence is built (topic, main verb, what the clauses do)",
 "points":[{"pattern":"the grammar pattern as it appears, e.g. 把…V完 or 是…的","note":"what it does in THIS sentence, one sentence"}],
 "words":[{"word":"a word","note":"its meaning here, only when it differs from the first dictionary sense or is easy to misread"}]}
0 to 4 points, 0 to 3 words; leave out anything obvious. Plain English, no jargon a learner wouldn't know; if you use a grammar term, say what it means. Use ${trad ? "Traditional" : "Simplified"} characters in patterns and words.`;

// Explore's daily topic chips: seven varied picks across subjects and two tied to what the learner searches and reads.
const TOPICS_PROMPT = (searches, reading, avoid) => `Suggest 9 topics for an adult learner of Mandarin to read about on Chinese Wikipedia today.
Things they searched for recently (most used first): ${searches.length ? searches.join("; ") : "none yet"}
Openings of texts they read recently: ${reading.length ? reading.join(" / ") : "none yet"}
Make 2 topics close to these interests (related, not the same searches repeated) and 7 varied picks, each from a different subject (for example nature, science, history, food, sports, places, people, arts, technology, everyday life), chosen to surprise and delight. With no history, pick 9 varied, appealing topics.
Each topic must be a real Chinese Wikipedia article title or a good search word, 2 to 4 characters, Traditional characters, Taiwan usage.${avoid.length ? ` Don't repeat: ${avoid.join("、")}.` : ""}
Return ONLY JSON: {"topics":[{"zh":"台灣夜市","en":"Night markets","py":"Táiwān yèshì"}, ...]} with exactly 9 items; "en" is 1 to 2 English words, "py" is pinyin with tone marks.`;

// Word Sets: a short list of useful words on a theme ("Food", or anything a learner types). The same theme always
// makes the same request, so Vercel's CDN can share a set between learners (see the GET below).
const WORDSET_PROMPT = (theme, cn, n = 24) => `An adult learner of Mandarin (beginner to low intermediate) wants a set of words to study on this theme: "${theme}"
List the ${n} most useful words and short set phrases for it: common, everyday, the ones they'd meet or need first, most useful first. Real dictionary words only, no sentences.
Use ${cn ? "mainland" : "Taiwan"} usage. If the theme isn't something words can be listed for, return an empty list.
Return ONLY JSON: {"words":[{"word":"Traditional characters","pinyin":"pinyin with tone marks, ${cn ? "mainland" : "Taiwan"} reading","meaning":"short English meaning, under 8 words"}]}`;

// Judge a flash card answer that the app's simple word match rejected: abbreviations, synonyms, paraphrases
// and small typos still count.
const JUDGE_PROMPT = (word, meaning, guess, pattern) => `A learner of Mandarin was shown the Chinese ${pattern ? `grammar pattern ${word} (the ~ or … stands for whatever fills the slot)` : `word ${word}`}. Its dictionary meaning is: ${meaning}
Asked what it means in English, they wrote: "${guess}"
Does their answer show they know ${pattern ? "how the pattern is used" : "the word"}? Count as right: abbreviations (AI for artificial intelligence), synonyms, paraphrases, any one correct sense of the word, and small spelling mistakes. "close" means related or partly right but not really the meaning. Otherwise "wrong".
Return ONLY JSON: {"verdict":"right"|"close"|"wrong","note":"under 12 words, spoken to the learner"}`;

async function askAI(model, prompt, maxTokens) {
  const r = await fetch(API, {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: "user", content: prompt }] }),  // prompt: text, or a list of content blocks
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = (data.error && data.error.message) || `AI service error ${r.status}`;
    throw Object.assign(new Error(msg), { status: r.status });
  }
  return { text: (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim(), usage: data.usage || {} };
}

function parseJSON(text) {
  try { return JSON.parse(text); } catch (e) {}
  const m = text.match(/\{[\s\S]*\}/);  // tolerate stray words around the JSON
  if (m) { try { return JSON.parse(m[0]); } catch (e) {} }
  return null;
}
// A list of {word, ...} items, even from an answer that was cut off or wrapped in code fences: every complete item
// that can be read is kept.
function parseItems(text, key) {
  const out = parseJSON(text);
  if (out && Array.isArray(out[key])) return out[key];
  const items = [];
  for (const m of String(text || "").matchAll(/\{[^{}]*\}/g)) { try { const x = JSON.parse(m[0]); if (x && typeof x.word === "string") items.push(x); } catch (e) {} }
  return items.length ? items : null;
}

const ANON_ACTIONS = new Set(["explain", "translate", "words", "zhquery", "simplify", "ocr", "notes", "tozh"]);
// v54: the iPhone app's page runs at capacitor://localhost, so it may call here across origins (only that origin).
// v96: the Android app's page runs at https://localhost.
const APP_ORIGINS = new Set(["capacitor://localhost", "ionic://localhost", "https://localhost"]);
module.exports = async (req, res) => {
  const T0 = Date.now(), lap = {}, clock = k => { lap[k] = Date.now() - T0; };  // v70: where a request's time goes (judge reports it)
  const origin = String(req.headers.origin || "");
  if (APP_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin); res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "authorization, content-type, x-radical-day, x-radical-anon");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); res.setHeader("Access-Control-Expose-Headers", "x-vercel-cache, x-radical-stored");
    if (req.method === "OPTIONS") return res.status(204).end();
  }
  if (req.method !== "POST" && req.method !== "GET") return res.status(405).json({ error: "Use GET or POST." });
  const body = req.method === "GET" ? (req.query || {})
    : typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  // Public: the account service's address and publishable key (both are meant to be in the page), and whether the
  // keys are set up (names only, never values).
  if (body.action === "config") { res.setHeader("Cache-Control", "no-store"); return res.status(200).json({ ...account.config(), pay: pay.config() }); }
  // v61: RevenueCat's webhook (its own Authorization value; see api/_pay.js)
  if ((req.query || {}).action === "rcwebhook" && req.method === "POST") {
    res.setHeader("Cache-Control", "no-store");
    if (!account.status().ok) return res.status(500).json({ error: "Storage isn't set up." });
    try { const r = await pay.webhook(req, body); return res.status(r.status).json(r.out); } catch (e) { return res.status(500).json({ error: e.message }); }
  }
  // v44: the owners' notice, the same for everyone; the CDN keeps it a minute
  if (body.action === "notice" && req.method === "GET") {
    res.setHeader("Vercel-CDN-Cache-Control", "max-age=60"); res.setHeader("Cache-Control", "public, max-age=0");
    try { return res.status(200).json({ notice: await account.notice() }); } catch (e) { return res.status(200).json({ notice: null }); }
  }
  // v46: past messages (the menu's Notes from David), cached a minute; a shared deck by id, cached for good (a deck
  // never changes once shared)
  if (body.action === "notelist" && req.method === "GET") {
    res.setHeader("Vercel-CDN-Cache-Control", "max-age=60"); res.setHeader("Cache-Control", "public, max-age=0");
    try { return res.status(200).json({ notes: await account.notes() }); } catch (e) { return res.status(200).json({ notes: [] }); }
  }
  if (body.action === "deck" && req.method === "GET") {
    const d = await account.getDeck(body.id).catch(() => null);
    if (!d) { res.setHeader("Cache-Control", "no-store"); return res.status(404).json({ error: "That deck isn't there any more." }); }
    res.setHeader("Vercel-CDN-Cache-Control", "max-age=31536000"); res.setHeader("Cache-Control", "public, max-age=86400");
    return res.status(200).json({ deck: { id: d.id, name: d.name, by: d.by, words: d.words } });
  }
  // v59: the live topic decks and their words, the same for everyone; the CDN keeps them a minute
  if ((body.action === "topics" || body.action === "topic") && req.method === "GET") {
    res.setHeader("Vercel-CDN-Cache-Control", "max-age=60"); res.setHeader("Cache-Control", "public, max-age=0");
    if (!account.status().ok) return res.status(200).json(body.action === "topics" ? { topics: null } : { words: null });
    try {
      if (body.action === "topics") return res.status(200).json({ topics: await topics.live() });
      const words = await topics.topic(body.theme, body.r);
      return words ? res.status(200).json({ words }) : res.status(404).json({ error: "That deck isn't ready." });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }
  if (body.action === "status") {
    const st = account.status();
    if (st.ok) { try { await account.ensureBucket(); } catch (e) { st.ok = false; st.error = e.message; } }
    return res.status(200).json(st);
  }
  // v54: App Review's demo sign-in (one address, one fixed code, both only in Vercel's settings)
  if (body.action === "demo" && req.method === "POST") {
    res.setHeader("Cache-Control", "no-store");
    try { const s = await account.demoSignIn(body.email, body.code); return s ? res.status(200).json(s) : res.status(403).json({ error: "That code didn't work." }); }
    catch (e) { return res.status(500).json({ error: e.message }); }
  }
  const user = await account.userOf(req); clock("auth");
  // Signed out (v41): only the things a newcomer taps for, and only a few (see account.anonTake).
  const anon = !user && !!req.headers["x-radical-anon"] && ANON_ACTIONS.has(body.action);
  if (!user && !anon) return res.status(401).json({ error: "Sign in first (Settings, Account).", signin: true });
  const who = user ? user.id : "anon", today = account.dayOf(req);
  try {
    if (body.action === "sync") {
      if (!user) return res.status(401).json({ error: "Sign in first (Settings, Account).", signin: true });
      if (!account.status().ok) return res.status(500).json({ error: "The account service isn't set up yet." });
      return res.status(200).json(await account.sync(user, body.data || {}));
    }
    // Friends by code: your code and name, add or remove a friend, and what your friends share (see _account.js).
    if (body.action === "friends") {
      if (!user) return res.status(401).json({ error: "Sign in first (Settings, Account).", signin: true });
      if (!account.status().ok) return res.status(500).json({ error: "The account service isn't set up yet." });
      res.setHeader("Cache-Control", "no-store");
      const out = await account.friends(user, body);
      // v54: a report goes to the owners by email too
      if (body.op === "report" && !out.error && process.env.RESEND_API_KEY && account.ownerEmails().length) await fetch("https://api.resend.com/emails", {
        method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
        body: JSON.stringify({ from: "Radical feedback <feedback@upslopelabs.com>", to: account.ownerEmails(), reply_to: user.email, subject: "Radical: someone was reported",
          text: `${user.email} reported friend code ${String(body.code || "").slice(0, 8)}.\n\n${String(body.why || "(no reason given)").slice(0, 2000)}\n\nThey're blocked for the reporter. The report is in storage under reports/${today}/.` })
      }).catch(() => {});
      return res.status(out.error ? 400 : 200).json(out);
    }
    // v61: the unlock and the trial (get, trial {from}, check with RevenueCat, owners' gift/ungift {code})
    if (body.action === "entitle") {
      if (!user) return res.status(401).json({ error: "Sign in first (Settings, Account).", signin: true });
      if (!account.status().ok) return res.status(500).json({ error: "The account service isn't set up yet." });
      res.setHeader("Cache-Control", "no-store");
      const out = await pay.act(user, body, today);
      // v77: a gift can send the friend a short note (the owner ticks it each time); never to a typed address unless
      // the gift went to that address
      if (body.op === "gift" && body.notify && out.ok && !out.already && process.env.RESEND_API_KEY) {
        const to = out.email || await account.emailOf(out.to).catch(() => "");
        const prof = await account.storage.getJSON(`users/${user.id}/profile.json`).catch(() => null), from = (prof && prof.first) || "A friend";
        if (to) {
          const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
            body: JSON.stringify({ from: "Radical <gifts@upslopelabs.com>", to: [to], reply_to: user.email, subject: "You've got Radical, free for good",
              text: `${from} gave you Radical Lifetime. Sign in with this email in the app and it's yours.` }) }).catch(() => null);
          out.mailed = !!(r && r.ok);
        }
      }
      delete out.to; delete out.email;
      return res.status(out.error ? 400 : 200).json(out);
    }
    // v54: Delete account, from Settings. Gone for good: words, friends, usage, the sign-in.
    if (body.action === "deleteaccount") {
      if (!user) return res.status(401).json({ error: "Sign in first (Settings, Account).", signin: true });
      if (!account.status().ok) return res.status(500).json({ error: "The account service isn't set up yet." });
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json(await account.deleteAccount(user));
    }
    // v44: owners post or take down the notice (not AI)
    if (body.action === "notice") {
      if (!user) return res.status(401).json({ error: "Sign in first (Settings, Account).", signin: true });
      res.setHeader("Cache-Control", "no-store");
      const out = await account.setNotice(user, body);
      return res.status(out.error ? 403 : 200).json(out);
    }
    // v43: the page reports an AI call that failed on its side (a meaning check that took too long). Not AI, no cost.
    if (body.action === "fail") {
      await account.logFail(who, body.what || "?", body.reason || "?", today);
      return res.status(200).json({ ok: true });
    }
    // Your AI use this month (and everyone's, for owners). The page shows it as an estimate.
    if (body.action === "usage") {
      if (!user) return res.status(401).json({ error: "Sign in first (Settings, Account).", signin: true });
      if (!account.status().ok) return res.status(500).json({ error: "The account service isn't set up yet." });
      res.setHeader("Cache-Control", "no-store");
      const u = await account.usage(user, today), pc = await pay.aiCap(user, today).catch(() => null), m = await pay.meter(user, today).catch(() => null);
      // v63: the allowance (once payments are on) and what has counted against it
      const allow = pc && !pc.locked ? pc : null;
      if (allow) u.me.cap = allow.day;
      return res.status(200).json({ ...u, allow, meter: m && { chg: m.chg, dchg: m.dchg, trial: m.trial.chg }, owner: account.isOwner(user), ai: account.mayUseAI(user) });
    }
    // v63: "I was right" on a meaning check (counted on the stored check), and the owners' review of disputed checks
    if (body.action === "dispute") {
      if (!user) return res.status(401).json({ error: "Sign in first (Settings, Account).", signin: true });
      const word = String(body.word || "").trim().slice(0, 40), guess = String(body.guess || "").trim().slice(0, 120);
      if (!word || !guess) return res.status(400).json({ error: "Nothing to check." });
      return res.status(200).json(await answers.dispute(word, guess, !!body.pattern, body.region === "cn"));
    }
    // v64: owners see how many of the 5,000 list cards are stored (however they were made); recount fills in older ones
    if (body.action === "cardtally") {
      if (!account.isOwner(user)) return res.status(403).json({ error: "Owners only." });
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json(await answers.tally(body.op === "recount" ? "recount" : "count", Math.max(0, +body.from || 0)));
    }
    if (body.action === "judgereview") {
      if (!account.isOwner(user)) return res.status(403).json({ error: "Owners only." });
      res.setHeader("Cache-Control", "no-store");
      const out = await answers.review(body.op === "flip" || body.op === "confirm" ? body.op : "list", String(body.key || ""));
      return res.status(out.error ? 400 : 200).json(out);
    }
    // Feedback from the app's menu: emailed to the owners through Resend (from feedback@upslopelabs.com, replies go to
    // the sender) and kept in storage. An optional screenshot comes as a JPEG.
    if (body.action === "feedback") {
      if (!user) return res.status(401).json({ error: "Sign in first (Settings, Account).", signin: true });
      const key = process.env.RESEND_API_KEY, to = account.ownerEmails();
      if (!key || !to.length) return res.status(500).json({ error: "Feedback isn't set up on the server yet." });
      const text = String(body.text || "").trim().slice(0, 8000), meta = String(body.meta || "").slice(0, 400);
      if (!text) return res.status(400).json({ error: "Write something first." });
      const image = typeof body.image === "string" && body.image.length < 4_000_000 ? body.image : "";
      const lab = body.kind === "lab";
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST", headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
        body: JSON.stringify({
          from: "Radical feedback <feedback@upslopelabs.com>", to, reply_to: user.email,
          subject: lab ? "Radical color lab values" : `Radical feedback from ${user.email}`,
          text: `${text}\n\n---\nFrom: ${user.email}\n${meta}`,
          ...(image ? { attachments: [{ filename: "screenshot.jpg", content: image }] } : {})
        })
      });
      await account.saveFeedback(user, today, { at: Date.now(), email: user.email, text, meta, kind: lab ? "lab" : "feedback", image: !!image, sent: r.ok });
      if (!r.ok) return res.status(502).json({ error: "The message couldn't be sent. It was saved; try again later." });
      // A copy for the sender, only ever to the address they signed in with (so the form can't mail anyone else).
      // Its own email, so the owners' addresses stay private. Best effort: a failed copy doesn't fail the send.
      if (!lab && user.email) await fetch("https://api.resend.com/emails", {
        method: "POST", headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
        body: JSON.stringify({ from: "Radical feedback <feedback@upslopelabs.com>", to: [user.email], subject: "Your note to Radical",
          text: `Thanks for writing. Here's a copy of what you sent.\n\n${text}` })
      }).catch(() => {});
      return res.status(200).json({ ok: true });
    }
  } catch (e) { return res.status(500).json({ error: e.message }); }
  // While testing: if TESTER_EMAILS is set, only those people get the AI features (reading and cards still work).
  if (user && !account.mayUseAI(user)) return res.status(403).json({ error: "The AI features aren't turned on for this account yet. Reading, saving words and flash cards all work.", notester: true });
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "No API key on the server. Add ANTHROPIC_API_KEY in Vercel, Settings, Environment Variables, then redeploy." });
  }
  if (anon && !(await account.anonTake(req, today))) return res.status(429).json({ error: "Sign in to keep going.", signin: true });
  // v61: after the trial, AI needs Radical. v63: paid and trial accounts have an allowance (api/_pay.js); before
  // launch a daily safety stop per person (owners none, signed-out use shares one pool). Both are checked only when
  // the AI is really asked: a stored answer costs nothing, so it's given even past the limit. Every AI call is logged
  // with its estimated cost, and counts against the allowance at `rate` of it: half for a first ask (it's stored and
  // shared from then on), nothing for the topic chips and for Explain on a pre-built card's own sentences.
  const pc = await pay.aiCap(user, today).catch(() => null); clock("cap");
  if (pc && pc.locked) return res.status(402).json({ error: "Get Radical to use the AI features.", pay: true });
  const OUT = { day: "Today's AI is used up. It comes back tomorrow; reading, saving and flash cards still work.",
    month: "This month's AI is used up. It comes back on the 1st; reading, saving and flash cards still work.",
    trial: "The trial's AI is used up. Reading, saving and flash cards still work." };
  let rate = body.action === "topics" ? 0 : .5;
  const askClaude = async (model, prompt, maxTokens) => {
    if (body.action !== "topics") {
      if (pc) { const why = pay.room(pc, await pay.meter(user, today)); if (why) { await pay.hit(user, why, today).catch(() => {}); throw Object.assign(new Error(OUT[why]), { aiout: why }); } }
      else if (await account.spentToday(who, today) >= account.capFor(user, who)) throw Object.assign(new Error(OUT.day), { aiout: "day" });
    }
    clock("pre"); const a0 = Date.now();
    const r = await askAI(model, prompt, maxTokens); lap.ai = Date.now() - a0;
    // v70: the usage log and the meter are written side by side (they were one after the other)
    const cost = account.costOf(model, r.usage);
    await Promise.all([account.logUse(who, body.action, model, r.usage, user && user.email, today).catch(() => {}),
      user ? pay.charge(user, pc, cost, cost * rate, today).catch(() => {}) : null]);
    clock("logged");
    return r.text;
  };
  // A stored answer, or a new one made, stored and returned (null = unreadable, not stored)
  const kept = async (kind, key, make) => {
    // v68: a blank answer (empty text, {} or []) is never kept or served; it would stick for everyone.
    const blank = d => d == null || (typeof d === "string" ? !d.trim() : typeof d === "object" && !Object.keys(d).length);
    const x = await answers.get(kind, key);
    if (x && !blank(x.data)) { res.setHeader("x-radical-stored", "1"); return x.data; }
    const d = await make(); if (!blank(d)) await answers.put(kind, key, d);
    return d;
  };
  const cn = body.region === "cn" || body.r === "cn", rk = cn ? "cn" : "tw";  // mainland (cards and Word Sets carry it in the URL as r=cn)
  // v76: a mainland card is made from the stored Taiwan card when there is one (fast model), else from scratch
  const makeCard = async (word, trad) => {
    if (cn) {
      // v76: the Taiwan card is stored under the Traditional form (the page sends it as t when it differs)
      trad = String(trad || "").trim().slice(0, 40); if (!/^\p{Script=Han}+$/u.test(trad)) trad = word;
      const tw = await answers.get("card", `tw|${trad}`);
      if (tw && tw.data && typeof tw.data === "object") {
        try {
          const c = parseJSON(await askClaude(FAST_MODEL, CN_FROM_TW(tw.data), 2000));
          if (c && Array.isArray(c.examples) && c.examples.length && c.pinyin) { c.word = tw.data.word || word; c.from = "tw"; return c; }
        } catch (e) { if (e.aiout) throw e; }
      }
    }
    return parseJSON(await askClaude(CARD_MODEL, CARD_PROMPT(word, cn), 1600));
  };
  // v80: every card gets its twin in the other region (Taiwan <-> mainland) from the fast model, so studying in one
  // fills the other. Paid by us (logged as "twin"), not from the learner's allowance; made once, then stored.
  const HAN = /^\p{Script=Han}+$/u;
  const twinKey = (key, data, t) => {
    const [from, word] = String(key).split("|"); if (!word || !data || typeof data !== "object") return null;
    const to = from === "tw" ? "cn" : "tw";
    let w = to === "cn" ? String(data.simplified || "").trim() || word : (HAN.test(String(t || "")) ? String(t) : String(data.word || "").trim() || word);
    if (!HAN.test(w)) return null;
    return { to, word: w, key: `${to}|${w.slice(0, 40)}` };
  };
  const makeTwin = async (key, data, t) => {
    const k = twinKey(key, data, t); if (!k) return "skip";
    if (await answers.get("card", k.key)) return "had";
    const r = await askAI(FAST_MODEL, k.to === "cn" ? CN_FROM_TW(data) : TW_FROM_CN(data), 2000);
    await account.logUse(who, "twin", FAST_MODEL, r.usage, user && user.email, today).catch(() => {});
    const c = parseJSON(r.text);
    if (!c || !Array.isArray(c.examples) || !c.examples.length || !c.pinyin) return "failed";
    c.word = k.to === "tw" ? k.word : String(data.word || "").trim() || k.word; c.from = key.split("|")[0];
    cardExamples(c);
    const listed = answers.onList(k.to, k.word);
    await answers.put("card", k.key, c, listed ? { pre: true } : {}); if (listed) await answers.mark(k.key);
    return "made";
  };
  try {
    // v80: the page asks for the twin right after a new card reaches it (so the learner doesn't wait for it)
    if (body.action === "twin") {
      if (!user) return res.status(401).json({ error: "Sign in first (Settings, Account).", signin: true });
      res.setHeader("Cache-Control", "no-store");
      const word = String(body.word || "").trim().slice(0, 40), src = HAN.test(word) && await answers.get("card", `${rk}|${word}`);
      if (!src) return res.status(200).json({ out: "none" });
      return res.status(200).json({ out: await makeTwin(`${rk}|${word}`, src.data, body.t).catch(() => "failed") });
    }
    // v80: owners copy every stored card across (Admin tools), a page of files at a time, at most 4 new twins a call
    if (body.action === "twinall") {
      if (!account.isOwner(user)) return res.status(403).json({ error: "Owners only." });
      res.setHeader("Cache-Control", "no-store");
      const files = (await account.storage.list("answers/card").catch(() => [])).filter(x => x.endsWith(".json")).sort();
      let at = Math.max(0, +body.from || 0); const jobs = [], stop = at + 60;
      while (at < files.length && at < stop && jobs.length < 4) {
        const x = await account.storage.getJSON(`answers/card/${files[at++]}`).catch(() => null);
        if (!x || !x.key) continue;
        const k = twinKey(x.key, x.data); if (!k || await answers.get("card", k.key)) continue;
        jobs.push(makeTwin(x.key, x.data).catch(() => "failed"));
      }
      const outs = await Promise.all(jobs);
      return res.status(200).json({ next: at < files.length ? at : null, total: files.length, made: outs.filter(o => o === "made").length, failed: outs.filter(o => o === "failed").length });
    }
    if (body.action === "card") {
      const word = String(body.word || "").trim().slice(0, 40);
      if (!word) return res.status(400).json({ error: "No word given." });
      const had = await answers.get("card", `${rk}|${word}`);
      let card = had && had.data;
      if (card) res.setHeader("x-radical-stored", "1");
      else {
        // v64: a word on the 5,000 list costs the first learner nothing, and its card counts as pre-built
        const listed = answers.onList(rk, word); if (listed) rate = 0;
        card = await makeCard(word, body.t);
        if (!card) return res.status(502).json({ error: "The answer wasn't readable. Try again." });
        cardExamples(card); await answers.put("card", `${rk}|${word}`, card, listed ? { pre: true } : {});
        if (listed) { await answers.mark(`${rk}|${word}`); card = { ...card, pre: true }; }
      }
      if (had && had.pre) card = { ...card, pre: true };  // pre-built: Explain on its sentences is free
      // Cards are the same for everyone, so let Vercel's CDN keep them for a year.
      // The next request for this word (from any device) is answered from the cache
      // without calling Claude. Best effort: the cache is per region and rarely used
      // words can be dropped. Browsers are told not to cache (the page keeps its own copy).
      if (req.method === "GET") {
        res.setHeader("Vercel-CDN-Cache-Control", "max-age=31536000");
        res.setHeader("Cache-Control", "public, max-age=0");
      }
      return res.status(200).json({ card });
    }
    // v59: owners build and edit the topic decks (Admin tools); building asks the AI, so it's logged like any call
    if (body.action === "topics") {
      if (!account.isOwner(user)) return res.status(403).json({ error: "Owners only." });
      res.setHeader("Cache-Control", "no-store");
      const ask = async (theme, isCn, n, avoid) => {
        const extra = avoid && avoid.length ? `\nDon't use any of these: ${avoid.slice(0, 80).join(", ")}.` : "";
        return parseItems(await askClaude(FAST_MODEL, WORDSET_PROMPT(theme, isCn, n) + extra, n > 24 ? 6000 : 1500), "words") || [];
      };
      const out = await topics.admin(body, ask);
      return res.status(out.error ? 400 : 200).json(out);
    }
    // v63: owners pre-build cards for the most common words (Admin tools), a few per call; a card already stored is
    // just marked pre-built
    if (body.action === "prebuild") {
      if (!account.isOwner(user)) return res.status(403).json({ error: "Owners only." });
      res.setHeader("Cache-Control", "no-store");
      const tr = Array.isArray(body.trad) ? body.trad : [];
      const pairs = (Array.isArray(body.words) ? body.words : []).map((w, i) => [String(w || "").trim().slice(0, 40), tr[i]]).filter(([w]) => /\p{Script=Han}/u.test(w)).slice(0, 4);
      const words = pairs.map(x => x[0]), trads = pairs.map(x => x[1]);
      let made = 0, had = 0; const failed = [];
      await Promise.all(words.map(async (word, i) => {
        const key = `${rk}|${word}`, x = await answers.get("card", key);
        if (x) { had++; if (!x.pre) await answers.put("card", key, x.data, { pre: true }); await answers.mark(key); return; }
        try {
          const card = await makeCard(word, trads[i]);
          if (!card) { failed.push(word); return; }
          cardExamples(card); await answers.put("card", key, card, { pre: true }); await answers.mark(key); made++;
        } catch (e) { failed.push(word); }
      }));
      return res.status(200).json({ made, had, failed });
    }
    if (body.action === "wordset") {
      const theme = String(body.theme || "").trim().replace(/\s+/g, " ").slice(0, 60);
      if (!theme) return res.status(400).json({ error: "No theme given." });
      // v46: 12, 24 (the default), 50, or 100 for + More words
      const n = [12, 24, 50, 100].includes(+body.n) ? +body.n : 24;
      const words = await kept("wordset", `${rk}|${n}|${theme.toLowerCase()}`, async () => {
        const list = parseItems(await askClaude(FAST_MODEL, WORDSET_PROMPT(theme, cn, n), n > 50 ? 9000 : n > 24 ? 5000 : 3000), "words");
        const ws = (list || []).filter(w => w && typeof w.word === "string" && /\p{Script=Han}/u.test(w.word))
          .map(w => ({ word: w.word.trim().slice(0, 12), pinyin: String(w.pinyin || "").slice(0, 60), meaning: String(w.meaning || "").slice(0, 80) })).slice(0, n + 6);
        return ws.length ? ws : null;
      });
      if (!words) return res.status(502).json({ error: "The answer wasn't readable. Try again." });
      if (req.method === "GET" && words.length) {  // the same for everyone: Vercel's CDN keeps a set for a year
        res.setHeader("Vercel-CDN-Cache-Control", "max-age=31536000");
        res.setHeader("Cache-Control", "public, max-age=0");
      }
      return res.status(200).json({ words });
    }
    if (body.action === "words") {
      const text = String(body.text || "").trim().slice(0, 4000);
      if (!text) return res.status(400).json({ error: "No text given." });
      const words = await kept("words", `${rk}|${text}`, async () => {
        const out = parseJSON(await askClaude(FAST_MODEL, WORDS_PROMPT(text, cn), 3000));
        return out && Array.isArray(out.words) ? out.words.filter(w => w && typeof w.word === "string").slice(0, 80) : null;
      });
      if (!words) return res.status(502).json({ error: "The answer wasn't readable. Try again." });
      return res.status(200).json({ words });
    }
    if (body.action === "notes") {
      const data = String(body.image || ""), type = String(body.media_type || "image/jpeg");
      if (!data || !/^image\/(jpeg|png|webp|gif)$/.test(type)) return res.status(400).json({ error: "No usable image sent." });
      if (data.length > 4_000_000) return res.status(413).json({ error: "That page is too large. Try a closer photo." });
      const items = await kept("notes", answers.hash(data), async () => {
        const out = parseJSON(await askClaude(CARD_MODEL, [
          { type: "image", source: { type: "base64", media_type: type, data } }, { type: "text", text: NOTES_PROMPT }
        ], 4000));
        return out && Array.isArray(out.items) ? out.items.filter(x => x && typeof x.word === "string" && /\p{Script=Han}/u.test(x.word)).slice(0, 60) : null;
      });
      if (!items) return res.status(502).json({ error: "The answer wasn't readable. Try again." });
      return res.status(200).json({ items });
    }
    if (body.action === "example") {
      const word = String(body.word || "").trim().slice(0, 40);
      if (!word) return res.status(400).json({ error: "No word given." });
      // v63: one shared pool per word (POOL_MAX sentences past the card's 3). A sentence this learner hasn't seen
      // comes from the pool for free; a new one is made only while the pool has room; a full pool just says so (the
      // page then goes round the ones it has).
      let n = body.n === 2 ? 2 : 1;
      const key = `${rk}|${word}`, seen = String(body.avoid || "").split(" / ").map(x => x.trim()).filter(Boolean);
      const pool = ((await answers.get("pool", key)) || {}).data || [];
      const fresh = pool.filter(x => !seen.includes(x.example));
      if (fresh.length) { res.setHeader("x-radical-stored", "1"); const ex = fresh.slice(0, n); return res.status(200).json({ examples: ex, ...ex[0] }); }
      if (pool.length >= POOL_MAX) { res.setHeader("x-radical-stored", "1"); return res.status(200).json({ examples: [], full: true }); }
      n = Math.min(n, POOL_MAX - pool.length);
      const avoid = [...seen, ...pool.map(x => x.example)].join(" / ").slice(0, 600);
      const out = parseJSON(await askClaude(CARD_MODEL, EXAMPLE_PROMPT(word, String(body.meaning || "").slice(0, 120), avoid, n, cn), 400 * n + 100));
      const ex = out && cardExamples({ examples: out.examples, example: out.example, example_pinyin: out.example_pinyin, example_en: out.example_en }).examples.slice(0, n);
      if (!ex || !ex.length) return res.status(502).json({ error: "The answer wasn't readable. Try again." });
      await answers.put("pool", key, [...pool, ...ex].slice(0, POOL_MAX));
      return res.status(200).json({ examples: ex, ...ex[0] });
    }
    if (body.action === "ocr") {
      const data = String(body.image || ""), type = String(body.media_type || "image/jpeg");
      if (!data || !/^image\/(jpeg|png|webp|gif)$/.test(type)) return res.status(400).json({ error: "No usable image sent." });
      if (data.length > 4_000_000) return res.status(413).json({ error: "That image is too large. Try a closer photo." });
      const text = await kept("ocr", answers.hash(data), () => askClaude(OCR_MODEL, [
        { type: "image", source: { type: "base64", media_type: type, data } },
        { type: "text", text: "Transcribe the Chinese text in this image exactly as written (Traditional or Simplified, whichever it uses), in reading order, one line per line of the original; for vertical text, read columns right to left. Leave out page numbers and headers, and leave out pinyin printed above or beside the characters (ruby). Keep English words that are part of the text, such as glosses or notes, where they appear on the line. Output only the text. If there is no Chinese text, output nothing." }
      ], 2000));
      return res.status(200).json({ text });
    }
    if (body.action === "zhquery") {
      const q = String(body.q || "").trim().slice(0, 120);
      if (!q) return res.status(400).json({ error: "Nothing to search for." });
      const zh = await kept("zhquery", q.toLowerCase(), async () => (await askClaude(FAST_MODEL, ZHQUERY_PROMPT(q), 60)).split("\n")[0].replace(/["“”「」]/g, "").trim());
      return res.status(200).json({ zh });
    }
    if (body.action === "rate") {
      const items = (Array.isArray(body.items) ? body.items : []).slice(0, 15)
        .map(it => ({ t: String(it.t || "").slice(0, 60), s: String(it.s || "").slice(0, 400) })).filter(it => it.t);
      if (!items.length) return res.status(400).json({ error: "Nothing to rate." });
      // v63: each article's rating is stored by its title and opening, so only the new ones are asked
      const keyOf = it => `${it.t}|${it.s}`, had = await Promise.all(items.map(it => answers.get("rate", keyOf(it))));
      const ratings = had.map(x => x ? x.data : null), ask = items.filter((it, i) => !had[i]);
      if (!ask.length) { res.setHeader("x-radical-stored", "1"); return res.status(200).json({ ratings }); }
      const out = parseJSON(await askClaude(FAST_MODEL, RATE_PROMPT(ask), 700));  // room for one entry per article
      // Matched by number, so a skipped or extra entry can't shift every rating by one.
      const got = ask.map(() => null);
      const clamp = v => { const n = Math.round(+v); return n >= 1 ? Math.min(10, n) : null; };
      if (out && Array.isArray(out.ratings)) out.ratings.forEach((x, k) => {
        if (x && typeof x === "object") { const i = Math.round(+x.n) - 1; if (i >= 0 && i < ask.length) got[i] = clamp(x.r); }
        else if (out.ratings.length === ask.length) got[k] = clamp(x);  // plain list of numbers, same length
      });
      let j = 0;
      await Promise.all(items.map((it, i) => { if (had[i]) return null; const v = got[j++]; ratings[i] = v; return v != null ? answers.put("rate", keyOf(it), v) : null; }));
      return res.status(200).json({ ratings });
    }
    if (body.action === "simplify") {
      const text = String(body.text || "").trim().slice(0, 2500), level = body.level === "easy" ? "easy" : "mid";
      if (!text) return res.status(400).json({ error: "Nothing to simplify." });
      const out = await kept("simplify", `${level}|${body.trad !== false ? 1 : 0}|${text}`, () => askClaude(FAST_MODEL, SIMPLIFY_PROMPT(text, level, body.trad !== false), 2000));
      return res.status(200).json({ text: out });
    }
    if (body.action === "judge") {
      const word = String(body.word || "").trim().slice(0, 40), meaning = String(body.meaning || "").trim().slice(0, 300), guess = String(body.guess || "").trim().slice(0, 120);
      if (!word || !guess) return res.status(400).json({ error: "Nothing to check." });
      // v63: a check is stored by word and tidied guess and shared ("sea" for 海 is asked once, ever); owners can flip
      // one that learners dispute (Admin tools)
      const v = await kept("judge", answers.judgeKey(word, guess, !!body.pattern, cn), async () => {
        let raw;
        try { raw = await askClaude(FAST_MODEL, JUDGE_PROMPT(word, meaning, guess, !!body.pattern), 200); }
        catch (e) { if (!e.aiout) await account.logFail(who, "judge", "server: " + e.message, today); throw e; }
        const out = parseJSON(raw), verdict = out && ["right", "close", "wrong"].includes(out.verdict) ? out.verdict : null;
        if (!verdict) { await account.logFail(who, "judge", "unreadable answer", today); return null; }
        return { verdict, note: String(out.note || "").slice(0, 120) };
      });
      if (!v) return res.status(502).json({ error: "The answer wasn't readable. Try again." });
      clock("total"); res.setHeader("Server-Timing", Object.entries(lap).map(([k, ms]) => `${k};dur=${ms}`).join(", "));
      return res.status(200).json({ ...v, t: lap });
    }
    if (body.action === "explain") {
      const sentence = String(body.sentence || "").trim().slice(0, 300);
      if (!sentence) return res.status(400).json({ error: "Nothing to explain." });
      const trad = body.trad !== false && body.trad !== "0";
      // v63: a sentence from a pre-built card (cw names the card's word) explains for free: we chose not to pre-build these
      if (body.cw) { const c = await answers.get("card", `${rk}|${String(body.cw).slice(0, 40)}`); if (c && c.pre && (c.data.examples || []).some(x => String(x.example || "").trim() === sentence)) rate = 0; }
      const list = (x, n) => (Array.isArray(x) ? x : []).filter(v => v && typeof v === "object").slice(0, n);
      const ans = await kept("explain", `${rk}|${trad ? 1 : 0}|${sentence}`, async () => {
        const out = parseJSON(await askClaude(CARD_MODEL, EXPLAIN_PROMPT(sentence, trad, cn), 900));
        return out ? { structure: String(out.structure || "").slice(0, 400),
          points: list(out.points, 4).map(p => ({ pattern: String(p.pattern || "").slice(0, 30), note: String(p.note || "").slice(0, 300) })).filter(p => p.pattern),
          words: list(out.words, 3).map(w => ({ word: String(w.word || "").slice(0, 12), note: String(w.note || "").slice(0, 200) })).filter(w => w.word) } : null;
      });
      if (!ans) return res.status(502).json({ error: "The answer wasn't readable. Try again." });
      // v44: an explanation is the same for everyone, so asked with GET the CDN keeps it (the next person gets it at once)
      if (req.method === "GET") { res.setHeader("Vercel-CDN-Cache-Control", "max-age=31536000"); res.setHeader("Cache-Control", "public, max-age=0"); }
      return res.status(200).json(ans);
    }
    if (body.action === "topics") {
      const list = (x, n, len) => (Array.isArray(x) ? x : []).slice(0, n).map(v => String(v || "").slice(0, len)).filter(Boolean);
      const out = parseJSON(await askClaude(FAST_MODEL, TOPICS_PROMPT(list(body.searches, 12, 40), list(body.reading, 6, 40), list(body.avoid, 70, 8)), 700));
      const topics = (out && Array.isArray(out.topics) ? out.topics : [])
        .filter(t => t && typeof t.zh === "string" && /\p{Script=Han}/u.test(t.zh))
        .map(t => ({ zh: t.zh.trim().slice(0, 8), en: String(t.en || "").slice(0, 24), py: String(t.py || "").slice(0, 40) })).slice(0, 9);
      if (!topics.length) return res.status(502).json({ error: "The answer wasn't readable. Try again." });
      return res.status(200).json({ topics });
    }
    if (body.action === "tozh") {
      const text = String(body.text || "").trim().slice(0, 2000), simp = !!body.simp, cnU = body.region ? cn : simp;  // older pages: the script said both
      if (!text) return res.status(400).json({ error: "Nothing to translate." });
      if (body.kind === "word") {
        const words = await kept("tozh", `w|${simp ? 1 : 0}|${cnU ? "cn" : "tw"}|${text.slice(0, 200).toLowerCase()}`, async () => {
          const list = parseItems(await askClaude(FAST_MODEL, TOZH_WORD_PROMPT(text.slice(0, 200), simp, cnU), 400), "words");
          const ws = (list || []).filter(w => w && typeof w.word === "string" && /\p{Script=Han}/u.test(w.word))
            .map(w => ({ word: w.word.trim().slice(0, 12), pinyin: String(w.pinyin || "").slice(0, 60), meaning: String(w.meaning || "").slice(0, 80) })).slice(0, 3);
          return ws.length ? ws : null;
        });
        if (!words) return res.status(502).json({ error: "No Chinese word came back. Try other words." });
        return res.status(200).json({ words });
      }
      const zh = await kept("tozh", `t|${simp ? 1 : 0}|${cnU ? "cn" : "tw"}|${text}`, async () => { const z = await askClaude(FAST_MODEL, TOZH_TEXT_PROMPT(text, simp, cnU), 2500); return /\p{Script=Han}/u.test(z) ? z : null; });
      if (!zh) return res.status(502).json({ error: "The answer wasn't readable. Try again." });
      return res.status(200).json({ zh });
    }
    if (body.action === "title") {
      const text = String(body.text || "").trim().slice(0, 500);
      if (!text) return res.status(400).json({ error: "No text given." });
      const title = await kept("title", text, async () => { const t = (await askClaude(FAST_MODEL, TITLE_PROMPT(text), 40)).trim().replace(/^["'“]|["'”.]$/g, "").slice(0, 60); return t || null; });
      if (!title) return res.status(502).json({ error: "No title came back." });
      return res.status(200).json({ title });
    }
    if (body.action === "translate") {
      const sentence = String(body.sentence || "").trim().slice(0, 600);
      if (!sentence) return res.status(400).json({ error: "No sentence given." });
      const translation = await kept("translate", sentence, () => askClaude(FAST_MODEL, TRANSLATE_PROMPT(sentence), 400));
      return res.status(200).json({ translation });
    }
    return res.status(400).json({ error: "Unknown action." });
  } catch (e) {
    if (e.aiout) return res.status(429).json({ error: e.message, aiout: e.aiout });  // v63: past the allowance (or the daily stop)
    return res.status(e.status === 401 ? 502 : 500).json({ error: e.status === 401 ? "The server's API key was rejected. Check ANTHROPIC_API_KEY in Vercel." : e.message });
  }
};
