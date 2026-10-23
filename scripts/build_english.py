"""Build the English index the page uses when you type an English word to add or read (v41).

Usage: python3 build_english.py <cedict.txt> <lists/zhfreq.txt> <out_dir>

Reads CC-CEDICT (CC BY-SA 4.0) and writes data/en-<letter>.json: {english: [[traditional, simplified], ...]},
filed by the English word's first letter. An entry is a sense that is the English itself ("patience", "to be patient"
under "be patient" and "patient"), or a sense of up to four words containing it. Matches are ordered: whole-sense
matches first, then by how common the Chinese word is (lists/zhfreq.txt, from wordfreq), then shorter words.
Surnames, names, variants and archaic senses are left out. At most 8 matches per English word.
"""
import json, os, re, sys
from collections import defaultdict

SRC, FREQ, OUT = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)

rank = {}
for i, line in enumerate(l for l in open(FREQ, encoding="utf-8") if not l.startswith("#")):
    rank.setdefault(line.strip(), i)
BIG = len(rank) + 1

LINE = re.compile(r"^(\S+) (\S+) \[([^\]]+)\] /(.*)/\s*$")
SKIP = re.compile(r"^(surname|variant of|old variant|archaic|used in|abbr\. for|see |CL:|Taiwan pr\.|also pr\.|also written|\(old\)|\(bound form\))", re.I)
OLD = re.compile(r"\((archaic|literary|classical|old|dialect|Cantonese|Buddhism|onom|slang|vulgar|derog)", re.I)
STOP = {"to", "a", "an", "the", "of", "be", "and", "or", "in", "on", "for", "with", "at", "by", "one's", "sb", "sth", "etc", "is", "as", "from", "up", "out"}

def norm(s):
    s = re.sub(r"\([^)]*\)|\[[^\]]*\]", " ", s.lower())
    s = re.sub(r"[^a-z' -]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return re.sub(r"^(to|a|an|the) ", "", s)

hits = defaultdict(dict)  # english -> {(trad, simp): (whole, rank, length)}
for line in open(SRC, encoding="utf-8"):
    if line.startswith("#"):
        continue
    m = LINE.match(line.rstrip("\n"))
    if not m:
        continue
    trad, simp, py, defs = m.groups()
    if py[:1].isupper() or len(simp) > 6 or not re.fullmatch(r"[㐀-鿿]+", simp):
        continue  # names, long phrases, words with letters
    r = rank.get(simp, BIG)
    for sense in re.split(r"[/;]", defs):
        sense = sense.strip()
        if not sense or SKIP.match(sense) or OLD.search(sense):
            continue
        n = norm(sense)
        if not n:
            continue
        words = n.split()
        keys = {n: 1} if len(words) <= 3 else {}
        if len(words) <= 4:
            for w in words:
                if w not in STOP and len(w) > 1:
                    keys.setdefault(w, 0)
        for k, whole in keys.items():
            key = (trad, simp)
            score = (-whole, r, len(simp))
            if key not in hits[k] or score < hits[k][key]:
                hits[k][key] = score

shards = defaultdict(dict)
for k, d in hits.items():
    best = sorted(d.items(), key=lambda x: x[1])[:8]
    shards[k[0] if k[0].isalpha() else "_"][k] = [[t, s] if t != s else [t] for (t, s), _ in best]
total = 0
for letter, d in shards.items():
    with open(os.path.join(OUT, f"en-{letter}.json"), "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False, separators=(",", ":"))
    total += len(d)
print(f"English index: {total} words in {len(shards)} files")
