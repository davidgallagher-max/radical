// v63: every AI answer is kept in Storage and shared, so the same question is only ever paid for once. Each answer
// lives at answers/<kind>/<hash of its key>.json as { key, data, at, ... }; the key is the exact question (the word and
// region for a card, the sentence for Explain, the passage and level for an easier version...), so when a Wikipedia
// article changes, only the changed passages are new questions. The stored key is checked on read, so two keys that
// happen to share a hash can't answer for each other.
//   answers/card/...       cards ({ pre: true } once pre-built from Admin tools: their sentences explain for free)
//   answers/pool/...       extra example sentences for a word (beyond the card's 3, at most 3 more), shared
//   answers/judge/...      meaning checks, by word and tidied guess; { dis } counts learners who said "I was right"
//   answers/judge-review.json   checks with enough disagreement for an owner to confirm or flip
//   answers/listed/<tw|cn>/...  v64: one small marker per stored card that's on the 5,000 list (lists/prebuild*.txt),
//                               so Admin tools can count them without reading every card
const crypto = require("crypto");
const hash = s => crypto.createHash("sha256").update(String(s)).digest("hex").slice(0, 40);
// A guess, tidied so "The sea." and "sea" are the same question
const tidy = g => String(g || "").toLowerCase().replace(/[\p{P}\p{S}]+/gu, " ").replace(/\b(a|an|the|to)\b/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
const DISPUTES = 3;  // learners saying "I was right" before a check goes to the owners

// v64: the 5,000 most common words (Simplified, and Traditional as the page converts them). The first card made for one
// of them costs the learner nothing and counts as pre-built (Explain on its sentences is free too).
const fs = require("fs"), pathm = require("path");
const LIST = {};
function onList(rk, word) {
  if (!LIST[rk]) {
    const read = f => { try { return fs.readFileSync(pathm.join(process.cwd(), "lists", f), "utf8").split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("#")); } catch (e) { return []; } };
    LIST[rk] = new Set(rk === "cn" ? read("prebuild.txt") : read("prebuild-tw.txt"));
  }
  return LIST[rk].has(word);
}
const listSize = rk => (onList(rk, ""), LIST[rk].size);

module.exports = ({ getJSON, putJSON, list }) => {
  const path = (kind, key) => `answers/${kind}/${hash(key)}.json`;
  // a stored card on the list leaves a marker (rk|word keys only)
  async function mark(key) { const [rk, word] = String(key).split("|"); if (word && onList(rk, word)) await putJSON(`answers/listed/${rk}/${hash(word)}.json`, { w: word }).catch(() => {}); }
  // Owners: how many list cards are stored, per region, and all cards. Recount (a page of 200 cards at a time, from
  // `from`) adds markers for cards stored before v64.
  async function tally(op, from = 0) {
    const n = async p => (await list(p).catch(() => [])).filter(x => x.endsWith(".json")).length;
    if (op === "recount") {
      const files = (await list("answers/card").catch(() => [])).filter(x => x.endsWith(".json")).sort(), part = files.slice(from, from + 200);
      await Promise.all(part.map(async f => { const x = await getJSON(`answers/card/${f}`).catch(() => null); if (x && x.key) await mark(x.key); }));
      return { next: from + part.length < files.length ? from + part.length : null, total: files.length };
    }
    const [tw, cn, all] = await Promise.all([n("answers/listed/tw"), n("answers/listed/cn"), n("answers/card")]);
    return { tw, cn, all, of: listSize("cn") };
  }
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
  return { get, put, hash, tidy, judgeKey, dispute, review, onList, mark, tally };
};
