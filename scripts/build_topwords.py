"""Build lists/topwords.txt: the 2,000 most common Chinese WORDS, most common first, for the Top lists on Practice.

v42: Top N is the N most common words (Top 1,000 is exactly 1,000 words). They come straight from lists/zhfreq.txt
(wordfreq's frequency order, CC-CEDICT words only), keeping words whose every character Radical can draw.
lists/common.tsv (characters, each with a common word) stays for the "In a common word" line on one-character cards.

This runs by hand, not on deploy (the list is checked in).
Usage: python3 scripts/build_topwords.py lists/zhfreq.txt <makemeahanzi dictionary.txt> lists/topwords.txt
"""
import json, re, sys

FREQ, MMAH, OUT = sys.argv[1:4]
N = 2000
han = re.compile(r"^[㐀-鿿]+$")
drawn = {json.loads(l)["character"] for l in open(MMAH, encoding="utf-8")}
words = []
for line in open(FREQ, encoding="utf-8"):
    w = line.strip()
    if not w or w.startswith("#") or not han.match(w) or not all(c in drawn for c in w):
        continue
    words.append(w)
    if len(words) == N:
        break
with open(OUT, "w", encoding="utf-8") as f:
    f.write(f"# The {N:,} most common Chinese words (Simplified), most common first, for the Top lists.\n")
    f.write("# Built by scripts/build_topwords.py from lists/zhfreq.txt (wordfreq, CC BY-SA 4.0; CC-CEDICT, CC BY-SA 4.0). See CREDITS.md.\n")
    f.write("\n".join(words) + "\n")
print("words", len(words))
