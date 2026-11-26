# Builds lists/lessons.json from lessons.py (v136, Guided study): one story per lesson of 10 Starter words. Every
# sentence must split into Starter words up to the end of its lesson. Run from the repo root:
# python3 scripts/starter/lessons_build.py
import json, os, sys
here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); os.chdir(here)
exec(open("check.py").read().split("\nbad = 0")[0])  # WORDS, seg (no card checks)
from stories import S
from lessons import L
by = {t: (t, en, text) for d, t, en, text in S}
bad = 0; out = {}
for k, v in L.items():
  d, n = map(int, k.split("-")); end = (d - 1) * 100 + n * 10  # words 1..end are taught
  title, en, text = by[v[1:]] if isinstance(v, str) else v
  ws = []
  for part in [title] + text.split("\n"):
    toks, miss = seg(part, end - 1)
    if toks is None: print("FAIL", k, title, part, "unknown:", miss); bad += 1; continue
    ws += [t["t"] for t in toks if not isinstance(t, str)]
  new = [w["t"] for w in WORDS[end - 10:end]]; used = [w for w in new if w in ws]
  if len(used) < 3: print("FEW", k, title, "uses", used)
  out[k] = {"t": title, "en": en, "text": text, "words": list(dict.fromkeys(ws))}
print("bad", bad, "lessons", len(out))
if bad: sys.exit(1)
json.dump(out, open(os.path.join(here, "..", "..", "lists", "lessons.json"), "w"), ensure_ascii=False, separators=(",", ":"))
