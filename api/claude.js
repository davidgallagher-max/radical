// Radical's only server code. It holds the Anthropic API key (from Vercel's
// environment variables, never from the page) and passes requests to Claude:
// study cards, translations, word lists, photo text, and Wikipedia search help.
// Requests must come from a signed-in account (the page sends its Supabase access
// token), so strangers can't spend your credits. The old shared APP_PASSWORD still
// works while it's set in Vercel; delete it there to retire it completely.
// Accounts, sync and the AI cost log live in _account.js.
const account = require("./_account.js");

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
module.exports = async (req, res) => {
  if (req.method !== "POST" && req.method !== "GET") return res.status(405).json({ error: "Use GET or POST." });
  const body = req.method === "GET" ? (req.query || {})
    : typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  // Public: the account service's address and publishable key (both are meant to be in the page), and whether the
  // keys are set up (names only, never values).
  if (body.action === "config") { res.setHeader("Cache-Control", "no-store"); return res.status(200).json(account.config()); }
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
  if (body.action === "status") {
    const st = account.status();
    if (st.ok) { try { await account.ensureBucket(); } catch (e) { st.ok = false; st.error = e.message; } }
    return res.status(200).json(st);
  }
  const user = await account.userOf(req);
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
      return res.status(out.error ? 400 : 200).json(out);
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
      return res.status(200).json({ ...(await account.usage(user, today)), owner: account.isOwner(user), ai: account.mayUseAI(user) });
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
  // A daily safety stop per person (owners none, signed-out use shares one pool); every AI call is logged with its estimated cost.
  if ((await account.spentToday(who, today)) >= account.capFor(user, who)) return res.status(429).json({ error: "Today's AI limit is reached. It resets tomorrow; reading, saving and flash cards still work." });
  const askClaude = async (model, prompt, maxTokens) => { const r = await askAI(model, prompt, maxTokens); await account.logUse(who, body.action, model, r.usage, user && user.email, today); return r.text; };
  const cn = body.region === "cn" || body.r === "cn";  // mainland (cards and Word Sets carry it in the URL as r=cn)
  try {
    if (body.action === "card") {
      const word = String(body.word || "").trim().slice(0, 40);
      if (!word) return res.status(400).json({ error: "No word given." });
      const text = await askClaude(CARD_MODEL, CARD_PROMPT(word, cn), 1600);
      const card = parseJSON(text);
      if (!card) return res.status(502).json({ error: "The answer wasn't readable. Try again." });
      cardExamples(card);
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
    if (body.action === "wordset") {
      const theme = String(body.theme || "").trim().replace(/\s+/g, " ").slice(0, 60);
      if (!theme) return res.status(400).json({ error: "No theme given." });
      // v46: 12, 24 (the default), 50, or 100 for + More words
      const n = [12, 24, 50, 100].includes(+body.n) ? +body.n : 24;
      const list = parseItems(await askClaude(FAST_MODEL, WORDSET_PROMPT(theme, cn, n), n > 50 ? 9000 : n > 24 ? 5000 : 3000), "words");
      if (!list) return res.status(502).json({ error: "The answer wasn't readable. Try again." });
      const words = list.filter(w => w && typeof w.word === "string" && /\p{Script=Han}/u.test(w.word))
        .map(w => ({ word: w.word.trim().slice(0, 12), pinyin: String(w.pinyin || "").slice(0, 60), meaning: String(w.meaning || "").slice(0, 80) })).slice(0, n + 6);
      if (req.method === "GET" && words.length) {  // the same for everyone: Vercel's CDN keeps a set for a year
        res.setHeader("Vercel-CDN-Cache-Control", "max-age=31536000");
        res.setHeader("Cache-Control", "public, max-age=0");
      }
      return res.status(200).json({ words });
    }
    if (body.action === "words") {
      const text = String(body.text || "").trim().slice(0, 4000);
      if (!text) return res.status(400).json({ error: "No text given." });
      const out = parseJSON(await askClaude(FAST_MODEL, WORDS_PROMPT(text, cn), 3000));
      if (!out || !Array.isArray(out.words)) return res.status(502).json({ error: "The answer wasn't readable. Try again." });
      return res.status(200).json({ words: out.words.filter(w => w && typeof w.word === "string").slice(0, 80) });
    }
    if (body.action === "notes") {
      const data = String(body.image || ""), type = String(body.media_type || "image/jpeg");
      if (!data || !/^image\/(jpeg|png|webp|gif)$/.test(type)) return res.status(400).json({ error: "No usable image sent." });
      if (data.length > 4_000_000) return res.status(413).json({ error: "That page is too large. Try a closer photo." });
      const out = parseJSON(await askClaude(CARD_MODEL, [
        { type: "image", source: { type: "base64", media_type: type, data } }, { type: "text", text: NOTES_PROMPT }
      ], 4000));
      if (!out || !Array.isArray(out.items)) return res.status(502).json({ error: "The answer wasn't readable. Try again." });
      return res.status(200).json({ items: out.items.filter(x => x && typeof x.word === "string" && /\p{Script=Han}/u.test(x.word)).slice(0, 60) });
    }
    if (body.action === "example") {
      const word = String(body.word || "").trim().slice(0, 40);
      if (!word) return res.status(400).json({ error: "No word given." });
      const n = body.n === 2 ? 2 : 1;
      const out = parseJSON(await askClaude(CARD_MODEL, EXAMPLE_PROMPT(word, String(body.meaning || "").slice(0, 120), String(body.avoid || "").slice(0, 600), n, cn), 400 * n + 100));
      const ex = out && cardExamples({ examples: out.examples, example: out.example, example_pinyin: out.example_pinyin, example_en: out.example_en }).examples.slice(0, n);
      if (!ex || !ex.length) return res.status(502).json({ error: "The answer wasn't readable. Try again." });
      return res.status(200).json({ examples: ex, ...ex[0] });
    }
    if (body.action === "ocr") {
      const data = String(body.image || ""), type = String(body.media_type || "image/jpeg");
      if (!data || !/^image\/(jpeg|png|webp|gif)$/.test(type)) return res.status(400).json({ error: "No usable image sent." });
      if (data.length > 4_000_000) return res.status(413).json({ error: "That image is too large. Try a closer photo." });
      const text = await askClaude(OCR_MODEL, [
        { type: "image", source: { type: "base64", media_type: type, data } },
        { type: "text", text: "Transcribe the Chinese text in this image exactly as written (Traditional or Simplified, whichever it uses), in reading order, one line per line of the original; for vertical text, read columns right to left. Leave out page numbers and headers, and leave out pinyin printed above or beside the characters (ruby). Keep English words that are part of the text, such as glosses or notes, where they appear on the line. Output only the text. If there is no Chinese text, output nothing." }
      ], 2000);
      return res.status(200).json({ text });
    }
    if (body.action === "zhquery") {
      const q = String(body.q || "").trim().slice(0, 120);
      if (!q) return res.status(400).json({ error: "Nothing to search for." });
      const zh = (await askClaude(FAST_MODEL, ZHQUERY_PROMPT(q), 60)).split("\n")[0].replace(/["“”「」]/g, "").trim();
      return res.status(200).json({ zh });
    }
    if (body.action === "rate") {
      const items = (Array.isArray(body.items) ? body.items : []).slice(0, 15)
        .map(it => ({ t: String(it.t || "").slice(0, 60), s: String(it.s || "").slice(0, 400) })).filter(it => it.t);
      if (!items.length) return res.status(400).json({ error: "Nothing to rate." });
      const out = parseJSON(await askClaude(FAST_MODEL, RATE_PROMPT(items), 700));  // room for one entry per article
      // Matched by number, so a skipped or extra entry can't shift every rating by one.
      const ratings = items.map(() => null);
      const clamp = v => { const n = Math.round(+v); return n >= 1 ? Math.min(10, n) : null; };
      if (out && Array.isArray(out.ratings)) out.ratings.forEach((x, k) => {
        if (x && typeof x === "object") { const i = Math.round(+x.n) - 1; if (i >= 0 && i < items.length) ratings[i] = clamp(x.r); }
        else if (out.ratings.length === items.length) ratings[k] = clamp(x);  // plain list of numbers, same length
      });
      return res.status(200).json({ ratings });
    }
    if (body.action === "simplify") {
      const text = String(body.text || "").trim().slice(0, 2500), level = body.level === "easy" ? "easy" : "mid";
      if (!text) return res.status(400).json({ error: "Nothing to simplify." });
      const out = await askClaude(FAST_MODEL, SIMPLIFY_PROMPT(text, level, body.trad !== false), 2000);
      return res.status(200).json({ text: out });
    }
    if (body.action === "judge") {
      const word = String(body.word || "").trim().slice(0, 40), meaning = String(body.meaning || "").trim().slice(0, 300), guess = String(body.guess || "").trim().slice(0, 120);
      if (!word || !guess) return res.status(400).json({ error: "Nothing to check." });
      let raw;
      try { raw = await askClaude(FAST_MODEL, JUDGE_PROMPT(word, meaning, guess, !!body.pattern), 200); }
      catch (e) { await account.logFail(who, "judge", "server: " + e.message, today); throw e; }
      const out = parseJSON(raw), verdict = out && ["right", "close", "wrong"].includes(out.verdict) ? out.verdict : null;
      if (!verdict) { await account.logFail(who, "judge", "unreadable answer", today); return res.status(502).json({ error: "The answer wasn't readable. Try again." }); }
      return res.status(200).json({ verdict, note: String(out.note || "").slice(0, 120) });
    }
    if (body.action === "explain") {
      const sentence = String(body.sentence || "").trim().slice(0, 300);
      if (!sentence) return res.status(400).json({ error: "Nothing to explain." });
      const trad = body.trad !== false && body.trad !== "0";
      const out = parseJSON(await askClaude(CARD_MODEL, EXPLAIN_PROMPT(sentence, trad, cn), 900));
      if (!out) return res.status(502).json({ error: "The answer wasn't readable. Try again." });
      const list = (x, n) => (Array.isArray(x) ? x : []).filter(v => v && typeof v === "object").slice(0, n);
      // v44: an explanation is the same for everyone, so asked with GET the CDN keeps it (the next person gets it at once)
      if (req.method === "GET") { res.setHeader("Vercel-CDN-Cache-Control", "max-age=31536000"); res.setHeader("Cache-Control", "public, max-age=0"); }
      return res.status(200).json({ structure: String(out.structure || "").slice(0, 400),
        points: list(out.points, 4).map(p => ({ pattern: String(p.pattern || "").slice(0, 30), note: String(p.note || "").slice(0, 300) })).filter(p => p.pattern),
        words: list(out.words, 3).map(w => ({ word: String(w.word || "").slice(0, 12), note: String(w.note || "").slice(0, 200) })).filter(w => w.word) });
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
        const list = parseItems(await askClaude(FAST_MODEL, TOZH_WORD_PROMPT(text.slice(0, 200), simp, cnU), 400), "words");
        const words = (list || []).filter(w => w && typeof w.word === "string" && /\p{Script=Han}/u.test(w.word))
          .map(w => ({ word: w.word.trim().slice(0, 12), pinyin: String(w.pinyin || "").slice(0, 60), meaning: String(w.meaning || "").slice(0, 80) })).slice(0, 3);
        if (!words.length) return res.status(502).json({ error: "No Chinese word came back. Try other words." });
        return res.status(200).json({ words });
      }
      const zh = await askClaude(FAST_MODEL, TOZH_TEXT_PROMPT(text, simp, cnU), 2500);
      if (!/\p{Script=Han}/u.test(zh)) return res.status(502).json({ error: "The answer wasn't readable. Try again." });
      return res.status(200).json({ zh });
    }
    if (body.action === "translate") {
      const sentence = String(body.sentence || "").trim().slice(0, 600);
      if (!sentence) return res.status(400).json({ error: "No sentence given." });
      const translation = await askClaude(FAST_MODEL, TRANSLATE_PROMPT(sentence), 400);
      return res.status(200).json({ translation });
    }
    return res.status(400).json({ error: "Unknown action." });
  } catch (e) {
    return res.status(e.status === 401 ? 502 : 500).json({ error: e.status === 401 ? "The server's API key was rejected. Check ANTHROPIC_API_KEY in Vercel." : e.message });
  }
};
