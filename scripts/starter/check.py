import sys, json, re, unicodedata
sys.path.insert(0, '.')
from words import WORDS
from ex import EX
PUN = set("，。！？、：「」 ")
idx = {w["t"]: i for i, w in enumerate(WORDS)}
def seg(s, n):
  vocab = {w["t"]: w for w in WORDS[:n+1]}; out = []; i = 0
  while i < len(s):
    if s[i] in PUN: out.append(s[i]); i += 1; continue
    for L in (3, 2, 1):
      if s[i:i+L] in vocab: out.append(vocab[s[i:i+L]]); i += L; break
    else: return None, s[i]
  return out, None
TONE = {c: t for t, cs in enumerate(["", "āēīōūǖ", "áéíóúǘ", "ǎěǐǒǔǚ", "àèìòùǜ"]) for c in cs}
def tone(p):
  for c in p:
    if c in TONE: return TONE[c]
  return 0
def first_tone(w, r):
  if w["t"] == "個": return 4
  return tone(r(w).split()[0] if " " in r(w) else r(w))
def py(toks, reg):
  r = lambda w: (w["cn"] or w["tw"]) if reg == "cn" else w["tw"]
  out = []; cap = True
  for k, t in enumerate(toks):
    if isinstance(t, str):
      m = {"，":",","。":".","！":"!","？":"?","、":",","：":":","「":"\"","」":"\""}[t]
      if out and m in ",.!?:": out[-1] += m
      elif m == "\"": out.append(m) if not (out and out[-1].endswith(":")) or True else None
      if m in ".!?": cap = True
      continue
    p = r(t); nxt = next((x for x in toks[k+1:k+2] if not isinstance(x, str)), None)
    if t["t"] in ("不", "一") and nxt is not None:
      nt = first_tone(nxt, r)
      if t["t"] == "不": p = "bú" if nt == 4 else "bù"
      else: p = "yí" if nt == 4 else "yì"
      if t["t"] == "一" and nxt["t"] in ("二", "三", "四"): p = "yī"
    if cap: p = p[0].upper() + p[1:]; cap = False
    if out and out[-1] == "\"": out[-1] += p
    else: out.append(p)
  s = " ".join(out)
  s = s.replace(" \"", " \"").replace("\" ", "\" ")
  return s
bad = 0; data = []
for i, w in enumerate(WORDS):
  exs = EX.get(w["t"], []); items = []
  for zh, en in exs:
    toks, miss = seg(zh, i)
    if toks is None: print("FAIL", i+1, w["t"], zh, "unknown:", miss); bad += 1; continue
    if not any(not isinstance(t, str) and t["t"] == w["t"] for t in toks): print("NOWORD", i+1, w["t"], zh); bad += 1
    simp = "".join(t if isinstance(t, str) else t["s"] for t in toks).replace("「", "“").replace("」", "”")
    items.append({"zh": zh, "zh_cn": simp, "py_tw": py(toks, "tw"), "py_cn": py(toks, "cn"), "en": en})
  data.append({"n": i+1, "word": w["t"], "simplified": w["s"] if w["s"] != w["t"] else "", "pinyin_tw": w["tw"], "pinyin_cn": w["cn"] or w["tw"], "meaning": w["en"], "examples": items})
print("bad", bad, "words", len(data), "examples", sum(len(d["examples"]) for d in data))
json.dump(data, open("starter1.json", "w"), ensure_ascii=False, indent=1)
