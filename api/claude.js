// Radical's only server code. It holds the Anthropic API key (from Vercel's
// environment variables, never from the page) and passes two kinds of requests
// to Claude: build a study card for a word, or translate a sentence.
// The page must send the APP_PASSWORD, so strangers can't spend your credits.

const API = "https://api.anthropic.com/v1/messages";
const CARD_MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5-5";
const FAST_MODEL = process.env.CLAUDE_FAST_MODEL || "claude-haiku-5-5";

// The card prompt leaves out the learner's own sentence on purpose: the same word
// then always gets the same request, so Vercel's CDN can reuse the card (see below).
const CARD_PROMPT = (word) => `You are making a study card for an adult learner of Taiwan Mandarin (low intermediate, Traditional characters).
Word: ${word}

Return ONLY a JSON object, no other text, with exactly these keys:
{
  "word": "the word in Traditional characters",
  "simplified": "Simplified form, or empty string if identical",
  "pinyin": "pinyin with tone marks, Taiwan pronunciation (e.g. 訊息 xùnxí)",
  "meaning": "short English meaning, under 12 words",
  "usage": "one short note on how it is used or a common collocation, or empty string",
  "chars": [ { "char": "one character", "pinyin": "its reading here", "parts": "its parts, e.g. 敬 jìng (sound) + 馬 horse (meaning)", "mnemonic": "one vivid memory hook, under 20 words" } ],
  "example": "one natural Taiwan Mandarin sentence using the word, Traditional characters, at low intermediate level",
  "example_pinyin": "pinyin of the example sentence",
  "example_en": "English translation of the example",
  "related": [ { "word": "related word", "pinyin": "pinyin", "meaning": "short meaning" } ]
}
Give 0 to 3 related words that share a character with the word. Use Taiwan word choices (資料 not 数据, 網路 not 网络).`;

const WORDS_PROMPT = (text) => `A learner of Taiwan Mandarin pasted the text below to add words to a vocabulary list. It may be a tidy list, a messy list with pinyin and English mixed in, or sentences.
Pick out the Chinese vocabulary items they most likely want to study: words and set phrases, not whole sentences, and skip particles and very basic words (的, 了, 我, 是) unless the text is clearly just a list.
Keep the learner's own pinyin and English when given; otherwise give Taiwan pinyin with tone marks and a short English meaning.
Return ONLY JSON: {"words":[{"word":"Traditional characters","pinyin":"...","meaning":"..."}]}, at most 80 items, in the order they appear.

${text}`;

const TRANSLATE_PROMPT = (sentence) => `Translate this Chinese into natural English. Return only the translation, nothing else.

${sentence}`;

async function askClaude(model, prompt, maxTokens) {
  const r = await fetch(API, {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: "user", content: prompt }] }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = (data.error && data.error.message) || `Claude API error ${r.status}`;
    throw Object.assign(new Error(msg), { status: r.status });
  }
  return (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();
}

function parseJSON(text) {
  try { return JSON.parse(text); } catch (e) {}
  const m = text.match(/\{[\s\S]*\}/);  // tolerate stray words around the JSON
  if (m) { try { return JSON.parse(m[0]); } catch (e) {} }
  return null;
}

module.exports = async (req, res) => {
  if (req.method !== "POST" && req.method !== "GET") return res.status(405).json({ error: "Use GET or POST." });
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "No API key on the server. Add ANTHROPIC_API_KEY in Vercel, Settings, Environment Variables, then redeploy." });
  }
  if (!process.env.APP_PASSWORD || req.headers["x-app-password"] !== process.env.APP_PASSWORD) {
    return res.status(401).json({ error: "Wrong or missing password. Set it in Radical's settings (the gear)." });
  }
  const body = req.method === "GET" ? (req.query || {})
    : typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  try {
    if (body.action === "card") {
      const word = String(body.word || "").trim().slice(0, 20);
      if (!word) return res.status(400).json({ error: "No word given." });
      const text = await askClaude(CARD_MODEL, CARD_PROMPT(word), 1200);
      const card = parseJSON(text);
      if (!card) return res.status(502).json({ error: "Claude's answer wasn't readable. Try again." });
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
    if (body.action === "words") {
      const text = String(body.text || "").trim().slice(0, 4000);
      if (!text) return res.status(400).json({ error: "No text given." });
      const out = parseJSON(await askClaude(FAST_MODEL, WORDS_PROMPT(text), 3000));
      if (!out || !Array.isArray(out.words)) return res.status(502).json({ error: "Claude's answer wasn't readable. Try again." });
      return res.status(200).json({ words: out.words.filter(w => w && typeof w.word === "string").slice(0, 80) });
    }
    if (body.action === "translate") {
      const sentence = String(body.sentence || "").trim().slice(0, 600);
      if (!sentence) return res.status(400).json({ error: "No sentence given." });
      const translation = await askClaude(FAST_MODEL, TRANSLATE_PROMPT(sentence), 400);
      return res.status(200).json({ translation });
    }
    return res.status(400).json({ error: "Unknown action." });
  } catch (e) {
    return res.status(e.status === 401 ? 502 : 500).json({ error: e.status === 401 ? "The API key was rejected by Anthropic. Check ANTHROPIC_API_KEY in Vercel." : e.message });
  }
};
