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

## Live site

Vercel builds and hosts it on every push (`vercel.json` runs `scripts/build_site.sh`, which builds the data and gathers the site into `public/`). On a phone, open the site and choose Add to Home Screen.

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

## Claude features

- **EN** at the end of each line: Claude translates it (cached on the device).
- **+ Add to my words** under any tapped word, or type one into **My words**: Claude builds a card (pinyin, meaning, how each character is built, a memory hook, an example sentence, related words). Words are saved on this device only.
- The page never sees the API key. `api/claude.js` runs on Vercel and reads two environment variables: `ANTHROPIC_API_KEY` and `APP_PASSWORD`. Enter the same password in Radical's settings (the gear).
- Models: Sonnet for cards, Haiku for translations. Override with `CLAUDE_MODEL` / `CLAUDE_FAST_MODEL` in Vercel if needed.
- These only work on the live site; `python3 -m http.server` has no `/api`.

## Next up
1. Read text from photos and screenshots (on-device text recognition)
2. Per-sentence translation, hidden until tapped (word glosses free; full sentences via AI, likely paid tier)
3. Taiwan readings for the words where they differ from mainland (訊息 xùnxí)
4. Word bank and flash cards: save words while reading (with the sentence and date), import the existing vocab list, mark words known, and review with spaced repetition. Cards show big Traditional characters (Simplified where different), pinyin on its own line, colored character parts with mnemonics, and an example sentence after each answer, with English only on request. A Vocab / Grammar / Both toggle in review: grammar cards cover patterns (～到 "so X that", 趁, 把, 被, 了/過/著), quizzed as fill-in-the-blank sentences.
5. Grammar switch (sentence diagramming): underline and label grammar points by rule, free and offline (了/過/著, 把/被, 的/得/地, ～到, 因為…所以, 一…就, 是…的, measure words). Later, full phrase brackets (subject, verb, object, time, place) via AI as a paid feature. Tap any marked phrase to explain it and make a grammar card.
6. Wikipedia reading: search Chinese Wikipedia by topic or tap "Surprise me" for a random article, loaded straight into the reader in Taiwan Traditional (zh-tw). Intro first, "keep reading" for more. Free; CC BY-SA, so every article shows its source link. Later: pick articles by how many of their words are already in the word bank.

## Polish queue
- Characters the data can't place (有, 學) are still mostly grey; find better splits
