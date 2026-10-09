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

# A component often appears in a squeezed form: 水 as 氵 on the left, 心 as 忄, and so on.
VARIANTS = {"水": "氵氺", "心": "忄⺗", "手": "扌", "人": "亻", "艸": "艹", "竹": "⺮", "火": "灬", "言": "訁讠",
    "金": "釒钅", "食": "飠饣", "糸": "糹纟", "犬": "犭", "示": "礻", "衣": "衤", "肉": "⺼月", "刀": "刂",
    "足": "𧾷", "网": "罒", "阜": "阝", "邑": "阝", "辵": "辶⻌", "玉": "王", "攴": "攵", "爪": "爫", "老": "耂",
    "雨": "⻗", "牛": "牜", "羊": "⺶", "魚": "鱼", "鳥": "鸟", "馬": "马", "貝": "贝", "見": "见", "車": "车",
    "門": "门", "頁": "页", "風": "风", "長": "长", "齒": "齿", "龍": "龙", "麥": "麦", "黃": "黄"}
def same(a, b):
    return bool(a) and bool(b) and (a == b or b in VARIANTS.get(a, "") or a in VARIANTS.get(b, ""))

def plain_tone(syl):
    tone, out = 5, ""
    for ch in syl:
        if ch in TONE_MARKS: base, tone = TONE_MARKS[ch]; out += base
        else: out += ch
    return out.lower(), tone

def split_syl(s):
    for i in INITIALS:
        if s.startswith(i):
            rest = s[len(i):]
            if i in ("j", "q", "x", "y") and rest.startswith("u"):  # qu, xu, ju, yu are really ü
                rest = "ü" + rest[1:]
            return i, rest
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

# Components that serve as the sound part in many recorded characters (合 in 給, 拾, 恰...).
# Used to guess the sound part when a character's own origin isn't recorded.
from collections import Counter
PHONETICS = Counter((o.get("etymology") or {}).get("phonetic", "") for o in dic.values()
                    if (o.get("etymology") or {}).get("type") == "pictophonetic")

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
        pass  # roles are assigned below, by searching the whole tree
    # Every subtree, keyed by its path (top-level child 0 is (0,), its first child (0, 0), ...).
    nodes = {}
    def walk(t, path):
        nodes[path] = flat(t)
        if isinstance(t, tuple):
            for i, k in enumerate(t[1]):
                walk(k, path + (i,))
    walk(tree, ())
    def find(form):
        """Shortest path to a subtree that is this component (or one of its side/top forms)."""
        hits = [p for p, f in nodes.items() if p and same(f, form) and "？" not in f]
        return min(hits, key=len) if hits else None

    role_at, inferred = {}, False
    if kind == "pictophonetic":
        sp, pp = find(ety.get("semantic", "")), find(ety.get("phonetic", ""))
        if sp: role_at[sp] = "meaning"
        if pp: role_at[pp] = "sound"
    elif kind == "ideographic" and len(kids) > 1:
        for i, k in enumerate(kids):
            if "？" not in flat(k): role_at[(i,)] = "idea" if i % 2 == 0 else "idea2"
    if not role_at and len(kids) > 1 and kind not in ("pictographic",):
        # No recorded origin: infer from the dictionary radical and the sound of the other part.
        rp = find(d.get("radical", ""))
        if rp and len(rp) == 1:
            others = [(i,) for i in range(len(kids)) if (i,) != rp and "？" not in flat(kids[i])]
            other = nodes[others[0]] if len(others) == 1 else ""
            close = sound_match(pinyin(ch), pinyin(other)) in ("same", "same sound, different tone", "rhymes")
            if other and (close or PHONETICS[other] >= 3):
                role_at[rp], role_at[others[0]], inferred = "meaning", "sound", True
            else:
                role_at[rp] = "radical"
    whole = not role_at and (kind == "pictographic" or len(kids) <= 1)

    comps = []
    for p in sorted(role_at, key=lambda p: p):
        form, role = nodes[p], role_at[p]
        one = len(form) == 1
        c = {"f": form, "r": role, "p": pinyin(form) if one else "", "g": gloss(form) if one else ""}
        if role == "sound": c["m"] = sound_match(pinyin(ch), c["p"])
        if inferred: c["i"] = 1
        comps.append(c)
    for i, k in enumerate(kids):  # top-level parts not covered above, shown uncolored
        if not any(p[:1] == (i,) for p in role_at) and "？" not in flat(k):
            form = flat(k); one = len(form) == 1
            comps.append({"f": form, "r": "part", "p": pinyin(form) if one else "", "g": gloss(form) if one else ""})
    if not role_at:
        comps = [c for c in comps if not whole]

    # Parts with no known job still get their own color: part1, part2, part3 in reading order.
    plain = [i for i in range(len(kids)) if not any(p[:1] == (i,) for p in role_at)]
    rank = {i: f"part{min(n + 1, 3)}" for n, i in enumerate(plain)}
    for c in comps:
        if c["r"] == "part":
            i = next((i for i in plain if flat(kids[i]) == c["f"]), None)
            c["r"] = rank.get(i, "part3")
    roles = []
    for m in d.get("matches", []):
        r = "whole" if whole or not kids else "part3"
        if m:
            path = tuple(m)
            for L in range(len(path), 0, -1):
                if path[:L] in role_at:
                    r = role_at[path[:L]]; break
            else:
                if not whole: r = rank.get(path[0], "part3")
        roles.append(r)
    if inferred: kind = "inferred"
    elif whole: kind = "pictographic" if ety.get("type") == "pictographic" else "whole"
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
