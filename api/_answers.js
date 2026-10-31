// v63: every AI answer is kept in Storage and shared, so the same question is only ever paid for once. Each answer
// lives at answers/<kind>/<hash of its key>.json as { key, data, at, ... }; the key is the exact question (the word and
// region for a card, the sentence for Explain, the passage and level for an easier version...), so when a Wikipedia
// article changes, only the changed passages are new questions. The stored key is checked on read, so two keys that
// happen to share a hash can't answer for each other.
//   answers/card/...       cards ({ pre: true } once pre-built from Admin tools: their sentences explain for free)
//   answers/pool/...       extra example sentences for a word (beyond the card's 3, at most 3 more), shared
//   answers/judge/...      meaning checks, by word and tidied guess; { dis } counts learners who said "I was right"
//   answers/judge-review.json   checks with enough disagreement for an owner to confirm or flip
const crypto = require("crypto");
const hash = s => crypto.createHash("sha256").update(String(s)).digest("hex").slice(0, 40);
// A guess, tidied so "The sea." and "sea" are the same question
const tidy = g => String(g || "").toLowerCase().replace(/[\p{P}\p{S}]+/gu, " ").replace(/\b(a|an|the|to)\b/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
const DISPUTES = 3;  // learners saying "I was right" before a check goes to the owners

module.exports = ({ getJSON, putJSON }) => {
  const path = (kind, key) => `answers/${kind}/${hash(key)}.json`;
  async function get(kind, key) { const x = await getJSON(path(kind, key)).catch(() => null); return x && x.key === key ? x : null; }
  async function put(kind, key, data, extra = {}) { const x = { key, data, at: Date.now(), ...extra }; await putJSON(path(kind, key), x).catch(() => {}); return x; }
  const judgeKey = (word, guess, pattern, cn) => `${cn ? "cn" : "tw"}|${pattern ? "p" : "w"}|${word}|${tidy(guess)}`;
  // "I was right": counted on the stored check; at DISPUTES it joins the owners' review list (once)
  async function dispute(word, guess, pattern, cn) {
    const key = judgeKey(word, guess, pattern, cn), x = await get("judge", key);
    if (!x || x.owner) return { ok: true };  // nothing stored, or an owner already decided
    x.dis = (x.dis || 0) + 1; await putJSON(path("judge", key), x).catch(() => {});
    if (x.dis === DISPUTES) {
      const r = (await getJSON("answers/judge-review.json").catch(() => null)) || { list: [] };
      if (!r.list.some(y => y.key === key)) { r.list.push({ key, word, guess: tidy(guess), verdict: x.data.verdict, note: x.data.note || "", at: Date.now() }); r.list = r.list.slice(-300); await putJSON("answers/judge-review.json", r).catch(() => {}); }
    }
    return { ok: true };
  }
  // Owners: the list, and confirm (keep the verdict) or flip (right <-> wrong) one check; either way it's settled
  async function review(op, key) {
    const r = (await getJSON("answers/judge-review.json").catch(() => null)) || { list: [] };
    if (op === "list") return { list: r.list };
    const item = r.list.find(y => y.key === key); if (!item) return { error: "That one's gone." };
    const x = await get("judge", key);
    if (x) {
      if (op === "flip") x.data = { verdict: x.data.verdict === "right" ? "wrong" : "right", note: "" };
      x.owner = true; x.dis = 0; await putJSON(path("judge", key), x).catch(() => {});
    }
    r.list = r.list.filter(y => y.key !== key); await putJSON("answers/judge-review.json", r).catch(() => {});
    return { ok: true, list: r.list };
  }
  return { get, put, hash, tidy, judgeKey, dispute, review };
};
