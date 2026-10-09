"""Build sharded character data for every character in Make Me a Hanzi.

Usage: python3 -I build_all.py <mmah_dir> <out_dir> <shards>
Each character lands in shard (codepoint % shards), file zh-NN.json.
"""
import json, os, sys

MMAH, OUT, N = sys.argv[1], sys.argv[2], int(sys.argv[3])
os.makedirs(OUT, exist_ok=True)

FORM_GLOSS = {
    "忄": "heart (side form of 心)", "⺮": "bamboo (top form of 竹)", "氵": "water (side form of 水)",
    "扌": "hand (side form of 手)", "亻": "person (side form of 人)", "艹": "grass (top form of 艸)",
    "灬": "fire (bottom form of 火)", "辶": "walk", "⻌": "walk", "讠": "speech (simplified 言)",
    "钅": "metal (simplified 金)", "纟": "silk (simplified 糸)", "饣": "food (simplified 食)",
    "宀": "roof", "冖": "cover", "犭": "dog, animal (side form of 犬)", "礻": "spirit, altar (side form of 示)",
    "衤": "clothing (side form of 衣)", "阝": "mound or town (side form)", "刂": "knife (side form of 刀)",
    "⺌": "small (top form of 小)", "罒": "net (top form of 网)", "⺈": "knife (top form)", "龵": "hand",
    "爫": "claw (top form of 爪)", "⺼": "flesh (side form of 肉)", "𧾷": "foot (side form of 足)",
}
OVERRIDES = {
    "稅": {"type": "pictophonetic", "semantic": "禾", "phonetic": "兌", "hint": "grain (taxes were once paid in grain)"},
    "税": {"type": "pictophonetic", "semantic": "禾", "phonetic": "兑", "hint": "grain (taxes were once paid in grain)"},
}
TONE_MARKS = {"ā":("a",1),"á":("a",2),"ǎ":("a",3),"à":("a",4),"ē":("e",1),"é":("e",2),"ě":("e",3),"è":("e",4),
    "ī":("i",1),"í":("i",2),"ǐ":("i",3),"ì":("i",4),"ō":("o",1),"ó":("o",2),"ǒ":("o",3),"ò":("o",4),
    "ū":("u",1),"ú":("u",2),"ǔ":("u",3),"ù":("u",4),"ǖ":("ü",1),"ǘ":("ü",2),"ǚ":("ü",3),"ǜ":("ü",4)}
INITIALS = ["zh","ch","sh","b","p","m","f","d","t","n","l","g","k","h","j","q","x","r","z","c","s","y","w"]
BINARY = set("⿰⿱⿴⿵⿶⿷⿸⿹⿺⿻"); TERNARY = set("⿲⿳")

def plain_tone(syl):
    tone, out = 5, ""
    for ch in syl:
        if ch in TONE_MARKS: base, tone = TONE_MARKS[ch]; out += base
        else: out += ch
    return out.lower(), tone

def split_syl(s):
    for i in INITIALS:
        if s.startswith(i): return i, s[len(i):]
    return "", s

def sound_match(a, b):
    if not a or not b: return None
    pa, ta = plain_tone(a); pb, tb = plain_tone(b)
    if pa == pb: return "same" if ta == tb else "same sound, different tone"
    ia, fa = split_syl(pa); ib, fb = split_syl(pb)
    if fa == fb: return "rhymes"
    if ia and ia == ib: return "same starting sound"
    return "loose hint (pronunciation has shifted over time)"

def parse(s, i=0):
    c = s[i]
    if c in BINARY or c in TERNARY:
        n = 2 if c in BINARY else 3
        kids, j = [], i + 1
        for _ in range(n):
            k, j = parse(s, j); kids.append(k)
        return (c, kids), j
    return c, i + 1

def flat(t):
    return t if isinstance(t, str) else "".join(flat(k) for k in t[1])

dic, gfx = {}, {}
for line in open(f"{MMAH}/dictionary.txt", encoding="utf-8"):
    o = json.loads(line); dic[o["character"]] = o
for line in open(f"{MMAH}/graphics.txt", encoding="utf-8"):
    o = json.loads(line); gfx[o["character"]] = o

def pinyin(ch):
    d = dic.get(ch); return (d.get("pinyin") or [""])[0] if d else ""

def gloss(ch):
    if ch in FORM_GLOSS: return FORM_GLOSS[ch]
    d = dic.get(ch); return (d or {}).get("definition") or ""

def entry(ch):
    d, g = dic[ch], gfx[ch]
    ety = OVERRIDES.get(ch) or d.get("etymology") or {}
    kind = ety.get("type", "unknown")
    try:
        tree, _ = parse(d["decomposition"]) if d.get("decomposition") else ("？", 0)
    except IndexError:
        tree = "？"
    kids = tree[1] if isinstance(tree, tuple) else []
    comps = []
    for idx, k in enumerate(kids):
        form = flat(k)
        if kind == "pictophonetic" and form == ety.get("semantic"): role = "meaning"
        elif kind == "pictophonetic" and form == ety.get("phonetic"): role = "sound"
        elif kind == "ideographic": role = "idea" if idx % 2 == 0 else "idea2"
        else: role = "part"
        if "？" in form: role = "part"
        one = len(form) == 1
        c = {"f": form, "r": role, "p": pinyin(form) if one else "", "g": gloss(form) if one else ""}
        if role == "sound": c["m"] = sound_match(pinyin(ch), c["p"])
        comps.append(c)
    known = any(c["r"] != "part" for c in comps)
    roles = []
    for m in d.get("matches", []):
        roles.append(comps[m[0]]["r"] if (m and known and m[0] < len(comps)) else "part")
    return {"p": d.get("pinyin", []), "d": d.get("definition", ""), "k": kind, "h": ety.get("hint", ""),
            "c": comps, "s": g["strokes"], "md": g["medians"], "r": roles}

shards = [dict() for _ in range(N)]
for ch in gfx:
    if ch in dic:
        shards[ord(ch) % N][ch] = entry(ch)
total = 0
for i, s in enumerate(shards):
    path = f"{OUT}/zh-{i:02d}.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(s, f, ensure_ascii=False, separators=(",", ":"))
    total += os.path.getsize(path)
print("chars", sum(len(s) for s in shards), "MB", round(total / 1e6, 1), "largest KB", max(os.path.getsize(f"{OUT}/zh-{i:02d}.json") for i in range(N)) // 1000)
