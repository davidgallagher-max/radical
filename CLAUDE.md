# Working on Radical

Notes for any new working session (Claude Code, a claude.ai Project, or a person). README.md covers running the app; this file covers how David and Claude work on it, what's been decided, and what's next.

## The app in one paragraph

Radical is a Mandarin reading app for adult learners. Every character is drawn from stroke data (Make Me a Hanzi) and colored by component: meaning, sound, or origin unclear. Users paste or import text, read it on an even grid like a printed Chinese page, tap words to save them, and study them with flash cards. David (CPA, learning Taiwan Mandarin) is the owner and main tester. Goal: classy, intellectual, addictive, beautiful ("Radical loves characters").

- Live: radical-tawny.vercel.app (Vercel Hobby). Repo: github.com/davidgallagher-max/radical. Local clone: ~/Projects/radical.
- `index.html` is the whole app (vanilla JS, one file). `api/claude.js` is the only server code (Vercel function). Data is built on deploy by `scripts/build_data.py` (characters) and `scripts/build_words.py` (CC-CEDICT words).

## How we work

- **Release flow:** David sends ideas from his phone; they're debated, decided and added to a numbered list. Nothing is built, committed or pushed until he says **"batch"**. Then Claude builds the whole list, tests it, and pushes straight to GitHub (`main`); Vercel deploys the live site automatically. No zips, no Terminal steps for David.
- **Commits:** one commit per theme, named for what it does, with a type in front: `feat:` new feature, `fix:` bug, `style:` looks, `docs:` notes, `chore:` housekeeping. Tag the last commit of each batch with the version (`v22`, `v23`, ...) and add the version's changes to CHANGELOG.md in plain words. Versions go up by one per batch; don't skip numbers.
- **If GitHub access isn't available,** fall back to a zip of the whole app (top folder `radical/`) and these steps, explaining each one:
  ```
  cd ~/Projects
  unzip -o ~/Downloads/radical-vNN.zip
  cd radical
  git add -A
  git commit -m "vNN"
  git push
  ```
  Unzip from `~/Projects`, not from inside `~/Projects/radical`, or the app lands in a nested `radical/radical` folder that Vercel ignores (this happened once).
- **Batching:** while David is using the app he sends notes one at a time. Claude answers each with a one-line read (and a straight opinion if it's a bad idea) and adds it to the list. Flag conflicts or questions when the note arrives, not at build time.
- **Testing:** Playwright with CDN libraries routed to local copies and the API and Wikipedia mocked. Check phone width (390px), dark and light. Things that only show on a real iPhone (finger writing, voice timing, tilt, sound) are called out for David to check.
- David is direct and wants plain pushback when an idea is weak. No flattery, no em dashes in prose.

## Standing rules

- Never put the API key in chat, code or GitHub. It lives only in Vercel env vars `ANTHROPIC_API_KEY` and `APP_PASSWORD`. Keep `.env` out of git.
- The word "Claude" never appears in the app's visible text (errors say "AI service").
- Never email anyone unless David explicitly says to send it.
- Wikipedia text is CC BY-SA: keep the credit line under articles.

## Structure worth knowing (index.html)

- Tabs: 讀 My text, 探 Explore, 詞 My words. Sub-screens (word page, flash cards, settings, history) use a stack: `go()`, `back()`; `setTab()` returns to a tab and ends per-visit toggles (`endSession`).
- Reading: `buildLine()` makes the grid; first tap on a word picks it (peek strip), second opens the word page. `miniReader()` is the small reader used in card sentences (tap a word for a gloss strip with + Add and ×).
- Characters: `svgFor()` draws strokes; `glyphFor()` returns the normal font instead when the "Original" look is chosen. `addLight()` is the 3D lighting on big characters; `lightReader()` adds the sparks in the reader.
- Looks (Settings): Scholar's Ink (default), Lacquer & Gold, Observatory, Plain ink (key `original`: drawn strokes, one color), Original (key `font`: normal font, no color or light).
- Words and review: `myWords` in localStorage (only on the phone until sign-in exists; Settings has "Save a backup file", restored with Import file on My words). Statuses New, Due, Active (internal key `learning`), Known. Known words come back every 60 to 180 days. Reading cards use `w.srs`; writing cards keep their own schedule in `w.wsrs`. `grade(w, g, k)`, `setStatus()`.
- Flash cards: panel asks Practice? (Read / Write), What type?, How many?
  - Read: guess pinyin and meaning, Check / I know it / Show answer. Tap a character for a random clue (its pinyin, meaning or sound); any clue caps the suggested rating at Hard. Pinyin is graded per syllable with tips (`checkPinyin`). Meaning: quick word match, then the `judge` AI action if that fails.
  - Write: pinyin, sound and meaning shown; write each character on a rice-paper pad (`writeFront`, `brushLayer` for the black brush ink, `paperPad`).
  - Header: "Card N of T · R repeats" and a running score (right / shaky / missed). ‹ Previous card undoes the last rating (`revHist`).
- Read-along: `readAloud()` highlights words as the device voice speaks; stops on page turn or leaving the screen.
- Explore: Wikipedia search by topic or English query (`zhquery`), difficulty rating 1 to 10 (`rate`), Easier / Easiest rewrite (`simplify`).

## Server actions (api/claude.js)

`card` (GET, cached at Vercel's CDN for a year), `words`, `ocr`, `translate`, `zhquery`, `rate`, `simplify`, `judge`. Fast jobs use the Haiku model; cards use Sonnet.

## Open roadmap (not started)

- Sign-in and sync: Supabase with Apple and Google sign-in; email sign-in needs a domain plus an email service.
- Mainland/Taiwan setting: Simplified as default (most learners), Taiwan as a toggle, card caches separated by region.
- Grammar mode: catalog from the HSK skeleton, AI-drafted, native-speaker reviewed; multiple-choice and word-tile tests.
- Domain, payments ($9.99 unlock plus an AI subscription), native apps, privacy policy.
- Real instrument recordings; daily goal ring or streak.
- Pre-built common cards; one-hour license check before charging.
- Branding: Scholar's Ink now; David is tempted by Lacquer & Gold. Not decided.

## Related

Guljan's app idea (working name Turn of Phrase, for long-time immigrants building active vocabulary) has its own handoff page, built from what Radical learned.
