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
| `index.html` | The whole app: reader, character breakdown, stroke animation, writing practice, color palettes |
| `scripts/get_data.sh` | Downloads the source data and builds `data/` |
| `scripts/build_words.py` | Turns the CC-CEDICT dictionary into the word files used for reading by word |
| `scripts/build_data.py` | Turns the source data into the per-character files the page reads |
| `licenses/` | Licenses for the character data |
| `CREDITS.md` | Where the data comes from and what was changed |

`raw/` and `data/` are generated and stay out of Git.

## Next up
1. Read text from photos and screenshots (on-device text recognition)
2. Per-sentence translation, hidden until tapped (word glosses free; full sentences via AI, likely paid tier)
3. Taiwan readings for the words where they differ from mainland (訊息 xùnxí)
4. Word bank and flash cards: save words while reading (with the sentence and date), import the existing vocab list, mark words known, and review with spaced repetition. Cards show big Traditional characters (Simplified where different), pinyin on its own line, colored character parts with mnemonics, and an example sentence after each answer, with English only on request. A Vocab / Grammar / Both toggle in review: grammar cards cover patterns (～到 "so X that", 趁, 把, 被, 了/過/著), quizzed as fill-in-the-blank sentences.
5. Grammar switch (sentence diagramming): underline and label grammar points by rule, free and offline (了/過/著, 把/被, 的/得/地, ～到, 因為…所以, 一…就, 是…的, measure words). Later, full phrase brackets (subject, verb, object, time, place) via AI as a paid feature. Tap any marked phrase to explain it and make a grammar card.
6. Wikipedia reading: search Chinese Wikipedia by topic or tap "Surprise me" for a random article, loaded straight into the reader in Taiwan Traditional (zh-tw). Intro first, "keep reading" for more. Free; CC BY-SA, so every article shows its source link. Later: pick articles by how many of their words are already in the word bank.
