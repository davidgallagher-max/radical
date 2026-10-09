"""Build the word list the page uses to read text word by word.

Usage: python3 build_words.py <cedict_ts.u8> <out_dir> <shards>

Reads CC-CEDICT (CC BY-SA 4.0, https://cc-cedict.org) and writes data/w-NN.json.
Each word is filed under its first character, in shard (codepoint % shards), as
[word, pinyin, taiwan_pinyin, meaning]. Both Traditional and Simplified forms are filed.
"""
import json, os, re, sys
from collections import defaultdict

SRC, OUT, N = sys.argv[1], sys.argv[2], int(sys.argv[3])
os.makedirs(OUT, exist_ok=True)

MARKS = {"a": "āáǎà", "e": "ēéěè", "i": "īíǐì", "o": "ōóǒò", "u": "ūúǔù", "ü": "ǖǘǚǜ"}

def mark(syl):
    """Turn numbered pinyin like 'zhang3' or 'lu:4' into 'zhǎng' / 'lǜ'."""
    m = re.fullmatch(r"([A-Za-zü:]+)([1-5])", syl)
    if not m:
        return syl.replace("u:", "ü")
    base, tone = m.group(1).replace("u:", "ü").replace("v", "ü"), int(m.group(2))
    if tone == 5:
        return base
    low = base.lower()
    if "a" in low: i = low.index("a")
    elif "e" in low: i = low.index("e")
    elif "ou" in low: i = low.index("o")
    else:
        i = max((k for k, c in enumerate(low) if c in "aeiouü"), default=-1)
        if i < 0:
            return base
    c = low[i]
    new = MARKS[c][tone - 1]
    if base[i].isupper():
        new = new.upper()
    return base[:i] + new + base[i + 1:]

def to_marks(py):
    return " ".join(mark(s) for s in py.split())

PENALTY = ("surname", "variant of", "old variant", "used in", "archaic", "abbr. for")
LINE = re.compile(r"^(\S+) (\S+) \[([^\]]+)\] /(.*)/\s*$")
TW = re.compile(r"Taiwan pr\. \[([^\]]+)\]")

best = {}  # word -> (score, pinyin, tw, meaning)
for line in open(SRC, encoding="utf-8"):
    if line.startswith("#"):
        continue
    m = LINE.match(line.rstrip("\n"))
    if not m:
        continue
    trad, simp, py, defs = m.groups()
    senses = [d for d in defs.split("/") if d]
    if len(trad) > 8:
        continue
    tw = ""
    t = TW.search(defs)
    if t and len(t.group(1).split()) == len(py.split()):
        tw = to_marks(t.group(1))
    clean = [s for s in senses if not s.startswith("Taiwan pr.")]
    score = len(clean) - 5 * sum(1 for s in clean if s.lower().startswith(PENALTY)) - (3 if py[:1].isupper() else 0)
    meaning = "; ".join(clean[:3])
    entry = (score, to_marks(py), tw, meaning)
    for w in {trad, simp}:
        if w not in best or entry[0] > best[w][0]:
            best[w] = entry

# "variant of 臺灣|台湾[Tai2 wan1]" says nothing useful; borrow the main word's meaning instead.
VAR = re.compile(r"^(?:old )?variant of ([^|\[\s]+)")
for w, (sc, py, tw, meaning) in list(best.items()):
    v = VAR.match(meaning)
    if v and v.group(1) in best and not VAR.match(best[v.group(1)][3]):
        best[w] = (sc, py, tw, best[v.group(1)][3])

shards = [defaultdict(list) for _ in range(N)]
for w, (_, py, tw, meaning) in best.items():
    first = w[0]
    shards[ord(first) % N][first].append([w, py, tw, meaning])
total = 0
for i, s in enumerate(shards):
    for k in s:
        s[k].sort(key=lambda e: -len(e[0]))  # longest first, so the reader can take the first match
    p = f"{OUT}/w-{i:02d}.json"
    json.dump(s, open(p, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    total += os.path.getsize(p)
print("words", len(best), "MB", round(total / 1e6, 1))
