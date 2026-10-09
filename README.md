# Radical

Paste any Chinese, Traditional or Simplified. Every character is redrawn from stroke data, with its meaning part and sound part in their own colors. Tap a character to take it apart and watch the stroke order.

## Run it on your Mac

From this folder, in Terminal:

```
bash scripts/get_data.sh
python3 -m http.server 8000
```

Then open **http://localhost:8000** in your browser. Press `Ctrl+C` in Terminal to stop it.

You only need `get_data.sh` once (or again after changing `build_data.py`). After that, just run the second line.

## What's in here

| File | What it is |
|---|---|
| `index.html` | The whole app: reader, character breakdown, stroke animation |
| `scripts/get_data.sh` | Downloads the source data and builds `data/` |
| `scripts/build_data.py` | Turns the source data into the per-character files the page reads |
| `licenses/` | Licenses for the character data |
| `CREDITS.md` | Where the data comes from and what was changed |

`raw/` and `data/` are generated and stay out of Git.

## Next up
1. Read by word instead of single character, so pinyin follows context (長大 = zhǎng)
2. Your vocab list built in
3. Save characters and words
4. Flash cards
