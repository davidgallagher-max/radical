# Builds lists/stories.json from stories.py: every sentence must split into Starter words up to the end of its deck.
# Run from the repo root: python3 scripts/starter/stories_build.py
import json, os, sys
here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); os.chdir(here)
exec(open("check.py").read().split("\nbad = 0")[0])  # WORDS, seg (no card checks)
from stories import S
bad = 0; out = []
for deck, title, en, text in S:
  ws = []
  for part in [title] + text.split("\n"):
    toks, miss = seg(part, deck * 100 - 1)
    if toks is None: print("FAIL", deck, title, part, "unknown:", miss); bad += 1; continue
    ws += [t["t"] for t in toks if not isinstance(t, str)]
  out.append({"deck": deck, "t": title, "en": en, "text": text, "words": list(dict.fromkeys(ws))})
print("bad", bad, "stories", len(out), "characters", sum(len(x["text"]) for x in out))
if bad: sys.exit(1)
json.dump({"stories": out}, open(os.path.join(here, "..", "..", "lists", "stories.json"), "w"), ensure_ascii=False, separators=(",", ":"))
