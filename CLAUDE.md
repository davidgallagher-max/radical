# Working on Radical

Notes for any new working session (Claude Code, a claude.ai Project, or a person). README.md covers running the app; this file covers how David and Claude work on it, what's been decided, and what's next.

## The app in one paragraph

Radical is a Mandarin reading app for adult learners. Every character is drawn from stroke data (Make Me a Hanzi) and colored by component: meaning, sound, or origin unclear. Users paste or import text, read it on an even grid like a printed Chinese page, tap words to save them, and study them with flash cards. David (CPA, learning Taiwan Mandarin) is the owner and main tester. Goal: classy, intellectual, addictive, beautiful ("Radical loves characters").

- Live: radical-tawny.vercel.app (Vercel Hobby). Repo: github.com/davidgallagher-max/radical. Local clone: ~/Projects/radical.
- `index.html` is the whole app (vanilla JS, one file). `api/claude.js` is the only server code (Vercel function). Data is built on deploy by `scripts/build_data.py` (characters) and `scripts/build_words.py` (CC-CEDICT words).

## How we work

- **Release flow:** David sends ideas from his phone; they're debated, decided and added to a numbered list. Nothing is built, committed or pushed until he says **"batch"**. Then Claude builds the whole list, tests it, and pushes straight to GitHub (`main`); Vercel deploys the live site automatically. No zips, no Terminal steps for David.
- **Commits:** one commit per theme, named for what it does, with a type in front: `feat:` new feature, `fix:` bug, `style:` looks, `docs:` notes, `chore:` housekeeping. Each batch is a version (`v22`, `v23`, ...): add its changes to CHANGELOG.md in plain words, under the version number. (Git tags would be the usual way to mark versions, but pushing tags is blocked from Claude's cloud sessions, so the changelog is the record.) Versions go up by one per batch; don't skip numbers.
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

- Tabs: 讀 My text, 探 Explore, 詞 My words, each under the same 部 RADICAL header (`.brandMark`) with a small `h3.sec.tabsec` name. Sub-screens (word page, flash cards, Review list, settings, history) use a stack: `go()`, `back()`; `setTab()` returns to a tab and ends per-visit toggles (`endSession`).
- Reading: `buildLine()` makes the grid; first tap on a word picks it (peek strip), second opens the word page. `miniReader()` is the small reader used in card sentences (tap a word for a gloss strip with + Add and ×).
- Characters: `svgFor()` draws strokes; `glyphFor()` returns the normal font instead when the "Original" look is chosen. `addLight()` is the 3D lighting on big characters; `lightReader()` adds the sparks in the reader.
- Looks (Settings): Scholar's Ink (default), Lacquer & Gold, Observatory, Plain ink (key `original`: drawn strokes, one color), Original (key `font`: normal font, no color or light).
- Words and review: `myWords` in localStorage (only on the phone until sign-in exists; Settings has "Save a backup file", restored with Import file on My words). Statuses New, Due, Active (internal key `learning`), Known. Known words come back every 60 to 180 days. Reading cards use `w.srs`; writing cards keep their own schedule in `w.wsrs`, listening cards in `w.lsrs`. `grade(w, g, k)`, `setStatus()`.
- Flash cards: panel asks Practice? (Read / Write / Listen), What type?, How many?
  - Read: guess pinyin and meaning, Check / I know it / Show answer. Tap a character for a clue in a fixed order (sound, meaning, pinyin, then the sound again), shown one at a time under the big characters; any clue caps the suggested rating at Hard. Pinyin is graded per syllable with tips (`checkPinyin`). Meaning: quick word match, then the `judge` AI action if that fails.
  - Write: pinyin, speaker and meaning on one line; the pad is sized to fit above the bottom bar at its tallest; write each character; after each one the app waits for "Next character ›" / "See answer" (`writeFront`). "Show this one" animates only the current character and counts its strokes as hinted. `brushLayer` draws the live stroke in its component color with the 3D lighting.
  - Listen: the word is played without showing it (Slowest / Slower / Normal, remembered in `radical-listen-speed`); type pinyin and meaning; the characters appear on Check.
  - Header: "Card N of T · R repeats" and a running score (right / shaky / missed). ‹ Previous card (in the top bar) undoes the last rating (`revHist`). Quit (`#revQuit`) asks first once a card is rated.
  - Ratings: `nextIvl` gives new or missed cards Again soon, Hard later today (`LATER`), Good 1 day, Easy 4 days, and keeps Hard < Good < Easy a day apart otherwise. The answer side's rating row glows (`.grades.glow`); `tick(g)` plays the woodblock.
- Progress record (recorded, not shown yet): `radical-days` holds a per-day tally (`c` cards reviewed, `r` characters read, `n` words added) via `logDay()`; a line counts as read after about 4 seconds on screen or when read aloud (`watchLines`). `learned` (`radical-learned`) lists learned words: earned when Known or a review gap reaches 21 days (`learn`), lost on Again or when the word is added back, including pasted lists (`unlearn`). Both go into backups and are merged on restore.
- Pinned bars: the reading legend and controls (`#readBar`) and the My words filters (`#filterBar`) stay pinned while scrolling (`pinned()` adds `.stuck`, which shows a small ☰ `.stuckmenu`). `fitLegend()` sizes the legend to the width; `edgeFade()` fades a row that still overflows. Size button `#sizeBtn` (字字) opens `#sizePop`. A backup reminder shows on My words after a week or 100 reviews without a backup.
- Read-along: `readAloud()` speaks one chunk at a time (`chunksOf()`: sentences, long ones split at clauses, unpunctuated text about 15 characters at word boundaries) and highlights the whole chunk; stops on page turn or leaving the screen. Numbers like 3,000 stay one unit (regex in `buildLine`'s `flush`).
- Explore: `openExplore(fromReading)`; nine daily chips from the `topics` action (`fetchDaily`, cached per day in `radical-wiki-daily`, starter `TOPICS` until then; searches recorded in `myTopics` only feed it). Chips change only when Explore opens. `searchHits()` is prefetched per chip; a search shows `skeleton()` rows at once. Wikipedia search by topic or English query (`zhquery`), difficulty rating 1 to 10 (`rate`), Easier / Easiest rewrite (`simplify`).
- Review list (`#lookScreen`, `openLook`): face-up cards in list order, Shuffle (`radical-look-shuffle`) reorders only unseen cards; never grades.
- Grammar patterns: `isSlot`, `isPattern`, `patternPy`, `slotBox`. Color lines: `legendLine(text)`, `showLegend(after, text)`.
- Feedback: `FEEDBACK_TO` (empty hides the menu item) and `APP_VERSION`; bump `APP_VERSION` each batch.

## Server actions (api/claude.js)

`card` (GET, cached at Vercel's CDN for a year), `words`, `ocr`, `translate`, `zhquery`, `rate`, `simplify`, `judge` (takes `pattern`), `topics` (Explore's daily chips). Fast jobs use the Haiku model; cards use Sonnet.

## Open roadmap (not started)

- Sign-in and sync: Supabase with Apple and Google sign-in; email sign-in needs a domain plus an email service.
- Mainland/Taiwan setting: Simplified as default (most learners), Taiwan as a toggle, card caches separated by region.
- Grammar mode: catalog from the HSK skeleton, AI-drafted, native-speaker reviewed; multiple-choice and word-tile tests.
- Domain, payments ($9.99 unlock plus an AI subscription), native apps, privacy policy.
- Real instrument recordings.
- "This week" card on My words and one quiet line under the 部 on the opening screen, built from the progress record: days studied (e.g. 5 of 7), cards per day, characters read per day, new words, and words learned shown as "312 learned · +14 this week · 3 back for review" (gains first; losses framed as back for review). No streak cliff and never sell streak protection; if a streak is ever added, give free rest days.
- Daily target on the tab bar (the 詞 badge shows today's progress).
- Notifications (cards due, at a chosen time): only after sign-in, since the server must know each device; iPhone needs the app on the Home Screen (iOS 16.4+).
- First-run walkthrough: three short cards on what the colors mean, tapping words, saving and reviewing.
- AI spending cap before sharing the app: a monthly cap in the Anthropic console and a per-device daily limit in `api/claude.js`.
- Sentence-gap cards (the example sentence with the word blanked out), once pre-built cards exist.
- Pre-built common cards; one-hour license check before charging.
- Save an article for later (a bookmark in Explore and the reader).
- Articles finished per week, as a stat for the This week card.
- Feedback address: `FEEDBACK_TO` is empty until there's a dedicated address (e.g. on the company domain); a personal address would be public in the page code.
- Branding: Scholar's Ink now; David is tempted by Lacquer & Gold. Not decided.

## Related

Guljan's app idea (working name Turn of Phrase, for long-time immigrants building active vocabulary) has its own handoff page, built from what Radical learned.
