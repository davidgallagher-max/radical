"""Download the source data into raw/. Uses only Python's standard library,
so it runs the same on a Mac and on Vercel's build machines.

Usage: python3 scripts/fetch_data.py
"""
import gzip, os, urllib.request

SOURCES = {
    "raw/dictionary.txt": "https://raw.githubusercontent.com/skishore/makemeahanzi/master/dictionary.txt",
    "raw/graphics.txt": "https://raw.githubusercontent.com/skishore/makemeahanzi/master/graphics.txt",
    "raw/cedict.txt": "https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz",
}

os.makedirs("raw", exist_ok=True)
for path, url in SOURCES.items():
    print(f"Downloading {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "radical-build"})
    with urllib.request.urlopen(req, timeout=120) as r:
        data = r.read()
    if url.endswith(".gz"):
        data = gzip.decompress(data)
    with open(path, "wb") as f:
        f.write(data)
    print(f"  saved {path} ({len(data) // 1_000_000} MB)")
