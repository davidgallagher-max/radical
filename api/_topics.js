// v59: ready-made topic decks, run by the owners from Admin tools. topics/catalog.json lists them
// ({ theme, made, live, pub, until }); each has one 50-word list per region in topics/<id>-tw.json and -cn.json,
// and a deck of 12 or 24 is the top of that list, so one edit covers every size. Everyone reads the live ones
// (published, not past their Until date); only owners build, edit, publish, retire or delete.
const SEED = ["Food", "Travel", "Family", "Work", "Feelings", "Time"];
const SIZE = 50;
const idOf = theme => Buffer.from(String(theme).toLowerCase()).toString("hex").slice(0, 120);
const cleanTheme = t => String(t || "").trim().replace(/\s+/g, " ").replace(/[\u0000-\u001f<>]/g, "").slice(0, 60);
const cleanWord = w => w && typeof w.word === "string" && /\p{Script=Han}/u.test(w.word)
  ? { word: w.word.trim().slice(0, 12), pinyin: String(w.pinyin || "").slice(0, 60), meaning: String(w.meaning || "").slice(0, 80) } : null;
const today = () => new Date().toISOString().slice(0, 10);

module.exports = (store) => {
  const { getJSON, putJSON, removeFiles } = store;
  async function catalog() {
    const c = await getJSON("topics/catalog.json").catch(() => null);
    if (c && Array.isArray(c.list)) return c.list;
    return SEED.map(theme => ({ theme, made: "", live: true, pub: 0, until: "" }));  // the six from before v59
  }
  const save = list => putJSON("topics/catalog.json", { list });
  const wordsPath = (theme, r) => `topics/${idOf(theme)}-${r === "cn" ? "cn" : "tw"}.json`;
  const wordsOf = async (theme, r) => ((await getJSON(wordsPath(theme, r)).catch(() => null)) || {}).words || null;
  const isLive = (x, day = today()) => x.live && !(x.until && x.until < day);
  // What everyone sees: live decks, and whether their words are built yet (else the page asks the AI as before)
  async function live() { return (await catalog()).filter(x => isLive(x)).map(({ theme, made, pub, until, built }) => ({ theme, made, pub, until, built: !!built })); }
  async function topic(theme, r) {
    const x = (await catalog()).find(t => t.theme === cleanTheme(theme));
    if (!x || !isLive(x) || !x.built) return null;
    return wordsOf(x.theme, r);
  }
  // Owners. ask(theme, cn, n, avoid) returns words from the AI (api/claude.js passes its own, so the cost is logged).
  async function admin(body, ask) {
    const op = body.op, theme = cleanTheme(body.theme), list = await catalog(), i = list.findIndex(x => x.theme === theme), x = list[i];
    const both = async t => ({ tw: await wordsOf(t, "tw"), cn: await wordsOf(t, "cn") });
    const view = async () => ({ list: await catalog() });
    if (op === "list") return view();
    if (!theme) return { error: "No topic given." };
    if (op === "get") return { theme, ...(await both(theme)) };
    if (op === "build") {
      const [tw, cn] = await Promise.all([ask(theme, false, SIZE, []), ask(theme, true, SIZE, [])]);
      const ctw = tw.map(cleanWord).filter(Boolean).slice(0, SIZE), ccn = cn.map(cleanWord).filter(Boolean).slice(0, SIZE);
      if (!ctw.length || !ccn.length) return { error: "No words came back for that topic. Try another." };
      await putJSON(wordsPath(theme, "tw"), { theme, words: ctw }); await putJSON(wordsPath(theme, "cn"), { theme, words: ccn });
      const row = { theme, made: today(), live: x ? x.live : false, pub: x ? x.pub || 0 : 0, until: x ? x.until || "" : "", built: true };
      if (x) list[i] = row; else list.push(row);
      await save(list); return { ...(await view()), theme, tw: ctw, cn: ccn };
    }
    if (!x) return { error: "That topic isn't in the list." };
    if (op === "swap") {  // take a word out; put in your own (body.own) or the AI's pick
      const r = body.r === "cn" ? "cn" : "tw", words = (await wordsOf(theme, r)) || [], k = words.findIndex(w => w.word === body.word);
      if (k < 0) return { error: "That word isn't in the deck." };
      let put = body.own ? cleanWord(body.own) : null;
      if (!body.own) {
        const got = (await ask(theme, r === "cn", 3, [...words.map(w => w.word), body.word, ...(Array.isArray(body.avoid) ? body.avoid : [])])).map(cleanWord).filter(Boolean);
        put = got.find(w => !words.some(v => v.word === w.word) && w.word !== body.word) || null;
        if (!put) return { error: "The AI had nothing new. Try your own word." };
      }
      if (!put) return { error: "That isn't a Chinese word." };
      if (words.some((v, j) => j !== k && v.word === put.word)) return { error: "That word is already in the deck." };
      words[k] = put; await putJSON(wordsPath(theme, r), { theme, words });
      return { theme, r, words, put };
    }
    if (op === "publish") { list[i] = { ...x, live: true, until: "", pub: x.live ? x.pub || Date.now() : Date.now() }; await save(list); return view(); }
    if (op === "draft") { list[i] = { ...x, live: false }; await save(list); return view(); }
    if (op === "retire") {
      const until = /^\d{4}-\d{2}-\d{2}$/.test(body.until || "") ? body.until : "";
      if (!until) return { error: "Pick the last day." };
      list[i] = { ...x, until }; await save(list); return view();
    }
    if (op === "delete") {
      list.splice(i, 1); await save(list);
      try { await removeFiles([wordsPath(theme, "tw"), wordsPath(theme, "cn")]); } catch (e) {}
      return view();
    }
    return { error: "Unknown op." };
  }
  return { live, topic, admin, idOf };
};
