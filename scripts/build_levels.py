"""Build lists/hsk.txt and lists/tocfl.txt: the HSK and TOCFL word lists by level, for the level decks on Practice (v98).

Each line is "<level>\t<word>", easiest level first, most common first within a level. Only words written all in Chinese
characters are kept (patterns like 一…就… are left out), and a word comes once, at its lowest level.
- HSK: the new HSK (3.0, 2021) levels 1 to 6 and 7-9 (written 7), Simplified, ordered by the source's frequency rank.
  Source: complete.json from github.com/drkameleon/complete-hsk-vocabulary (MIT).
- TOCFL: levels 1 to 7 of Taiwan's official list (臺灣華語文能力基準詞語表, National Academy for Educational Research,
  coct.naer.edu.tw, 2022-11-14), Traditional, ordered by spoken then written frequency.
  Source: tocfl_words.json from github.com/PSeitz/tocfl (one JSON object a line, from the official spreadsheet).

This runs by hand, not on deploy (the lists are checked in).
Usage: python3 scripts/build_levels.py complete.json tocfl_words.json lists/
"""
import json, re, sys, os

HSK, TOCFL, OUT = sys.argv[1:4]
han = re.compile(r"^[㐀-鿿]+$")

def write(name, head, rows):
    seen, out = set(), []
    for lv, w in rows:
        if han.match(w) and w not in seen:
            seen.add(w); out.append(f"{lv}\t{w}")
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        f.write(head + "\n" + "\n".join(out) + "\n")
    print(name, len(out))

rows = []
for e in json.load(open(HSK, encoding="utf-8")):
    lv = [int(l[4:]) for l in e["level"] if re.fullmatch(r"new-\d", l)]
    if lv: rows.append((min(lv), e.get("frequency") or 10**6, e["simplified"]))
rows.sort()
write("hsk.txt", "# New HSK (3.0) words by level (7 = levels 7-9), Simplified, most common first. From complete-hsk-vocabulary (MIT). See CREDITS.md.",
      [(lv, w) for lv, _, w in rows])

rows = []
for line in open(TOCFL, encoding="utf-8"):
    if not line.strip(): continue
    e = json.loads(line)
    rows.append((int(e["tocfl_level"]), -(e.get("spoken_per_million") or 0), -(e.get("written_per_million") or 0), e["id"], e["text"].strip()))
rows.sort()
write("tocfl.txt", "# TOCFL words by level 1-7, Traditional, most common in speech first. From the official list (NAER, coct.naer.edu.tw, 2022). See CREDITS.md.",
      [(r[0], r[4]) for r in rows])
