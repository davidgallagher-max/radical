"""Starter decks (v113): the first words for absolute beginners, in teaching order, with sentences that use only the
words up to each card, a sound tip per card, tones per word and the tone changes (不, 一, tone 3s in a row) under each
sentence. Written by hand; check.py proves every sentence segments into earlier words only.
Run from the repo root: python3 scripts/starter/build.py  ->  lists/starter.txt and lists/starter.json"""
import json, os, re, subprocess, sys
here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here)
os.chdir(here); subprocess.run([sys.executable, "check.py"], check=True)  # writes starter1.json, fails on a bad sentence
from tones import sylls, tone, tone_line, to2
from tips import TIPS
d = json.load(open("starter1.json")); os.remove("starter1.json")
CN_TIP = {"東西": TIPS["東西"].replace("dōngxī", "dōngxi")}
def notes(py):
  out = []
  for ph in re.split(r'[,.!?:"“”]', py):
    ss = [s for w in ph.split() for s in sylls(w)]; low = [s.lower() for s in ss]
    if "bú" in low: out.append("不 rises before a tone 4: bú.")
    if "yí" in low: out.append("一 rises before a tone 4: yí.")
    if "yì" in low: out.append("一 is said yì before tones 1, 2 and 3.")
    i = 0
    while i < len(ss):
      if tone(ss[i]) == 3:
        j = i
        while j + 1 < len(ss) and tone(ss[j + 1]) == 3: j += 1
        if j > i:
          run = [s.lower() for s in ss[i:j + 1]]
          out.append(f"Tone 3s in a row: {' '.join(run)} is said {' '.join([to2(s) for s in run[:-1]] + [run[-1]])}.")
        i = j + 1
      else: i += 1
  return list(dict.fromkeys(out))
rows = []
for x in d:
  for e in x["examples"]:
    if e["zh"] == "他說：「好。」": e["py_tw"] = e["py_cn"] = "Tā shuō: “Hǎo.”"
  rows.append({"w": x["word"], "s": x["simplified"], "p": [x["pinyin_tw"], x["pinyin_cn"]], "m": x["meaning"],
    "tip": [TIPS.get(x["word"], ""), CN_TIP.get(x["word"], TIPS.get(x["word"], ""))], "tones": [tone_line(x["pinyin_tw"]), tone_line(x["pinyin_cn"])],
    "ex": [{"z": e["zh"], "e": e["en"], "p": [e["py_tw"], e["py_cn"]], "n": [notes(e["py_tw"]), notes(e["py_cn"])]} for e in x["examples"]]})
root = os.path.join(here, "..", "..", "lists")
json.dump({str(k + 1): rows[k * 100:(k + 1) * 100] for k in range((len(rows) + 99) // 100)}, open(os.path.join(root, "starter.json"), "w"), ensure_ascii=False, separators=(",", ":"))
with open(os.path.join(root, "starter.txt"), "w") as f:
  f.write("# Starter decks: the first words, in teaching order (level\\tword, Traditional). Built by scripts/starter/build.py.\n")
  for i, r in enumerate(rows): f.write(f"{i // 100 + 1}\t{r['w']}\n")
print("starter: ", len(rows), "words,", sum(len(r["ex"]) for r in rows), "sentences")
