"""Build lists/common.tsv: the 2,000 most common Chinese characters, most common first, each with a common word
that contains it (for the Common characters sets on Practice).

Character frequency comes from wordfreq's Chinese word list (Robyn Speer, CC BY-SA 4.0; built from SUBTLEX-CH,
OpenSubtitles, Wikipedia, Google Books and other sources): each word's frequency is added to every character in it.
The word for each character is the most frequent two- or three-character CC-CEDICT word containing it (no names).

This runs by hand, not on deploy (the list is checked in). It needs the msgpack package:
  pip install msgpack wordfreq   (or unzip wordfreq/data/large_zh.msgpack.gz from its wheel)
Usage: python3 scripts/build_common.py <large_zh.msgpack.gz> <cedict.txt> <makemeahanzi dictionary.txt> lists/common.tsv
"""
import gzip, json, re, sys
import msgpack

SRC, CEDICT, MMAH, OUT = sys.argv[1:5]
N = 2000

with gzip.open(SRC, "rb") as f:
    data = msgpack.load(f, raw=False)
buckets = data[1:]  # wordfreq's "cB" format: bucket i holds the words with frequency 10 ** (-i / 100)

han = re.compile(r"^[一-鿿]+$")
drawn = set()
for line in open(MMAH, encoding="utf-8"):
    drawn.add(json.loads(line)["character"])

cedict = {}  # simplified word -> pinyin, for words that aren't names
for line in open(CEDICT, encoding="utf-8"):
    m = re.match(r"^(\S+) (\S+) \[([^\]]+)\]", line)
    if m and not m.group(3)[:1].isupper():
        cedict.setdefault(m.group(2), m.group(3))

char_freq, word_freq = {}, {}
for i, words in enumerate(buckets):
    fr = 10 ** (-i / 100)
    for w in words:
        if not han.match(w):
            continue
        word_freq[w] = word_freq.get(w, 0) + fr
        for c in w:
            char_freq[c] = char_freq.get(c, 0) + fr

ranked = [c for c, _ in sorted(char_freq.items(), key=lambda x: -x[1]) if c in drawn][:N]
best = {}
for w, fr in sorted(word_freq.items(), key=lambda x: -x[1]):
    if 2 <= len(w) <= 3 and w in cedict:
        for c in set(w):
            best.setdefault(c, w)

with open(OUT, "w", encoding="utf-8") as f:
    f.write("# The 2,000 most common characters (Simplified), most common first, each with a common word containing it.\n")
    f.write("# Built by scripts/build_common.py from wordfreq (CC BY-SA 4.0) and CC-CEDICT (CC BY-SA 4.0). See CREDITS.md.\n")
    for c in ranked:
        f.write(f"{c}\t{best.get(c, '')}\n")
print("characters", len(ranked), "with a word", sum(1 for c in ranked if best.get(c)))
