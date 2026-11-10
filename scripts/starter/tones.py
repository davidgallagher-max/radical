import re
V = "aeiouüāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ"
SYL = re.compile(rf"(?:zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])?[{V}]+(?:ng(?![{V}])|n(?![{V}])|r(?![{V}]))?", re.I)
TONE = {c: t for t, cs in enumerate(["", "āēīōūǖ", "áéíóúǘ", "ǎěǐǒǔǚ", "àèìòùǜ"]) for c in cs}
def tone(s):
  for c in s.lower():
    if c in TONE: return TONE[c]
  return 0
def sylls(p): return SYL.findall(p)
NAME = {1: "tone 1, high and flat", 2: "tone 2, rising", 3: "tone 3, dip", 4: "tone 4, falling", 0: "light (no tone)"}
def tone_line(p):
  ss = sylls(p)
  return " · ".join(f"{s.lower()}: {NAME[tone(s)]}" for s in ss)
PLAIN = str.maketrans("āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ", "aaaaeeeeiiiioooouuuuüüüü")
def to2(s):  # third tone written as second
  out = ""
  for c in s:
    if c in TONE and TONE[c] == 3: out += "āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ"["āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ".index(c) - 1]
    else: out += c
  return out
