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

## How the app is laid out

- **Two tabs:** My text (讀) and My words (詞, with a badge for words due). Word, Review, History and Settings open as full pages with Back.
- **Adding text:** **Photo or file** opens the phone's camera / photo / file picker. Photos are read by Claude (Haiku; set `CLAUDE_OCR_MODEL` in Vercel for a stronger model). PDFs open a page at a time with pdf.js; scanned pages are read by Claude only when you open them. **Wikipedia** searches Chinese Wikipedia or picks a random article (Surprise me); articles open a section at a time with a source link (CC BY-SA 4.0), converted to the selected script. Texts over 1,500 characters show a "Show more" button.
- **Read:** paste text; each character is drawn in color. Characters inside a word sit together, words are spaced apart. 🔊 and **EN** (Claude translation) at the end of each line. **History** keeps the last 30 texts; the current text survives closing the app.
- **Word page** (tap any character): the whole word first, with pinyin, 🔊 and **+ Add**; swipe left (or tap the chips at the top) for each character's parts, stroke order and **Write it** (grid on by default; hints only from Hint or after 5 misses).
- **Words:** a review strip (Start review), one **Add word(s)** box (one word adds at once; a pasted list shows a preview to untick words first; messy text is sorted out by Claude), **Import file** (one or several files, preview, then Import N; Radical backup files restore cards and review progress), filters All / Due / New / Learning / Known, and a word / meaning list. Tap a word for its page: Claude card, "I know this", Read it in Radical, Remove (tap twice).
- **Review:** spaced repetition; up to 10 new words a day ("Learn 10 more" when done). Again / Hard / Good / Easy show when the word comes back.
- **Settings:** colors, speech speed, Claude password, Save a backup file, About (credits and data notes).

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

- Done: parts with no recorded role are guessed as sound parts when they rhyme with the character or serve as a sound part in 3+ other characters (答 = ⺮ + 合). Remaining cases show the radical in the meaning color and the other part as "Origin unclear".
- Characters the data can't place (有, 學) are still mostly grey; find better splits
