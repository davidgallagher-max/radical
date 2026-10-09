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

Trying changes before they go live (local server, phone preview, Vercel previews): see `docs/Sandbox guide.docx`.

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

## My words, review, import

- **+ Add to my words** under any tapped word, or type one into **My words**: Claude builds a card (pinyin, meaning, how each character is built, a memory hook, an example sentence, related words).
- **Review**: spaced repetition. Each card shows the word drawn in color (and the sentence you met it in); tap Show answer, then Again / Hard / Good / Easy. Each button shows when the word comes back. Up to 10 new words join per day; "Learn 10 more" at the end adds more.
- **Import**: paste or choose a file, one word per line. `word | pinyin | meaning | where you met it | date` works, so do Quizlet exports (word, tab, meaning) and Radical backups. Missing pinyin and meanings come from CC-CEDICT. Imported words get a free dictionary card; tap **Make full card** for Claude's version. Lines containing "skip" stay out of review.
- **Back up**: saves your words (and review progress) as a .json file. Words live only on the device, so back up now and then. Import the file to restore or move to another device.
- **EN** at the end of each line: Claude translates it (cached on the device).
- **Sound**: speaker buttons on each line, words, characters and example sentences use the phone's own text-to-speech (free, offline), preferring a Taiwan Mandarin voice.
- **History**: the text you're reading is kept between visits; anything replaced (including by "Read it in Radical") goes to History, last 30.
- Tapping a character opens it in a pop-up sheet (parts, stroke order, writing practice). Writing hints come only from the Hint button or after 5 misses on a stroke.

## How the Claude part works

- The page never sees the API key. `api/claude.js` runs on Vercel and reads `ANTHROPIC_API_KEY` and `APP_PASSWORD`. Enter the same password in Radical's settings (the gear).
- Models: Sonnet for cards, Haiku for translations. Override with `CLAUDE_MODEL` / `CLAUDE_FAST_MODEL` in Vercel.
- Cards are requested by GET, one address per word, and Vercel's CDN keeps them for up to a year. A word anyone has already asked for comes back from the cache without calling Claude. This is best effort (cache is per region, rarely used words can be dropped). If the card prompt changes, bump `v=1` in `claude()` in index.html so old cards aren't reused.
- These only work on the live site; `python3 -m http.server` has no `/api`.

## Next up
1. Read text from photos and screenshots (on-device text recognition)
2. Per-sentence translation, hidden until tapped (word glosses free; full sentences via AI, likely paid tier)
3. Taiwan readings for the words where they differ from mainland (訊息 xùnxí)
4. Grammar: a Vocab / Grammar / Both toggle in review; grammar cards cover patterns (～到 "so X that", 趁, 把, 被, 了/過/著), quizzed as fill-in-the-blank sentences. (Word bank, review and import are done.) Also: pre-build cards for the most common words with the batch API, so most taps cost nothing.
5. Grammar switch (sentence diagramming): underline and label grammar points by rule, free and offline (了/過/著, 把/被, 的/得/地, ～到, 因為…所以, 一…就, 是…的, measure words). Later, full phrase brackets (subject, verb, object, time, place) via AI as a paid feature. Tap any marked phrase to explain it and make a grammar card.
6. Wikipedia reading: search Chinese Wikipedia by topic or tap "Surprise me" for a random article, loaded straight into the reader in Taiwan Traditional (zh-tw). Intro first, "keep reading" for more. Free; CC BY-SA, so every article shows its source link. Later: pick articles by how many of their words are already in the word bank.

## Polish queue

- Guess roles for "rest" parts: if the rest sounds like the character (答 dá / 合 hé), mark it a likely sound part, as already done for characters with no breakdown.
- Characters the data can't place (有, 學) are still mostly grey; find better splits
