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
- Reading: `buildLine()` makes the grid (cells carry `_ch`, `_syl`, `_at`); first tap on a word picks it (peek strip), second opens the word page. The pick is a span of cells on one line (`pickSpan(line, a, b, tok)`): ‹ › grow it, tapping an end tile shrinks it, long-press (`holdToPick`) starts from one character; + Add and Open work on any span. `editText()` edits the current text or document page (Edit text under the text and in `#sizePop`). `miniReader()` is the small reader used in card sentences (tap a word for a gloss strip with + Add and ×).
- Speech: `speak(text, slow)`; `slow = { k, gap }` says each character separately (Listen cards' Slowest and Slower); `{ k }` alone is one utterance at k times the speed. Every speaker alternates normal / about 70% on repeat taps (`altSpeed(key)`, resets after 8s): `[data-say]` buttons and the line speaker (`readAloud(lines, false, k)`). Tilt was removed in v27 (iPhones asked for motion access every launch).
- Characters: `svgFor()` draws strokes; `glyphFor()` returns the normal font instead when the "Original" look is chosen. `addLight()` is the 3D lighting on big characters; `lightReader()` adds the sparks in the reader.
- Looks (Settings): Scholar's Ink (default), Lacquer & Gold, Observatory, Plain ink (key `original`: drawn strokes, one color), Original (key `font`: normal font, no color or light).
- Words and review: `myWords` in localStorage, synced to the account when signed in (see Accounts). The menu has 存 Save a backup (`#backupBtn`), restored with the file icon in the add box on My words. Statuses New, Due, Active (internal key `learning`), Known. Known words come back every 60 to 180 days. Reading cards use `w.srs`; writing cards keep their own schedule in `w.wsrs`, listening cards in `w.lsrs`. `grade(w, g, k)`, `setStatus()`.
- Card edits: `w.mine` (meaning, pinyin, example, example_pinyin, example_en, notes) over the shared `w.card`; read through `cardOf(w)`, `wPinyin`, `wMeaning`. `w.fromClass` lists fields from imported notes (marked "from class", otherwise "yours"); `w.classNote` keeps the teacher's original English. `editCard(w, done)` from the word page (Edit card) and the answer side (✎); New sentence uses the `example` action; your own sentence gets `sentencePinyin()` and `translate`.
- Import (file icon in the add box): text files and backups as before; PDFs and photos go to `readNotes()` (each page as a picture to the `notes` action) and show as a checklist (`.nlist`).
- PDFs: `loadPdf`, `pageJpeg`; `pdfPageText()` reads a page from the picture (`ocr`) when the text layer has fewer than 10 Chinese characters or is `garbled()` (Korean, private-use or replacement characters).
- Flash cards: panel asks Practice? (Read / Write / Listen), What type?, How many? It folds to one row with Start (`radical-rev-open`). Import is the file icon in the add box.
  - Finish screen: 完 drawn, summary, learned this session, due by tomorrow; buttons Another N (same `lastSet` mode and count, hidden when nothing's left or after a hand-picked set), Go over the ones you missed (Review), Done; the top-left back is hidden. Walkthrough: `showTour()` (menu 導 How it works, `radical-tour-seen`). Cards are made on add via `queueCard()` (two at a time).
  - Read: guess pinyin and meaning, Check / I know it / Show answer. Tap a character for a clue in a fixed order (sound, meaning, pinyin, then the sound again), shown one at a time under the big characters; any clue caps the suggested rating at Hard. Pinyin is graded per syllable with tips (`checkPinyin`). Meaning: quick word match, then the `judge` AI action if that fails.
  - Write: pinyin, speaker and meaning on one line; the pad is sized to fit above the bottom bar at its tallest; write each character; after each one the app waits for "Next character ›" / "See answer" (`writeFront`). "Show this one" animates only the current character and counts its strokes as hinted. `brushLayer` draws the live stroke in its component color with the 3D lighting.
  - Listen: "In a sentence" plays the example (`card.example`, else `context`) unseen, no rating cap. The word is played without showing it (Normal / Spaced / One by one, keys `normal` / `slower` / `slowest` in `radical-listen-speed`; iPhone voices won't stretch a syllable, so the slow ones add gaps); type pinyin and meaning; the characters appear on Check.
  - Header: "Card N of T · R repeats" and a running score (right / shaky / missed). ‹ Previous card (in the top bar) undoes the last rating (`revHist`). Quit (`#revQuit`) asks first once a card is rated.
  - Ratings: the app's day starts at 4am (`DAY_START_H`; `localDay()`, `midnight()`). `nextIvl` gives new or missed cards Again this round, Hard later today (`LATER`), Good tomorrow, Easy 4 days (from 6pm to 4am: Hard tomorrow, Good 2 days), and keeps Hard < Good < Easy a day apart otherwise. The answer side's whole rating bar glows (`.revbar.glow`); `tick(g)` plays the woodblock.
- Progress record (recorded, not shown yet): `radical-days` holds a per-day tally (`c` cards reviewed, `r` characters read, `n` words added) via `logDay()`; a line counts as read after about 4 seconds on screen or when read aloud (`watchLines`). `learned` (`radical-learned`) lists learned words: earned when Known or a review gap reaches 21 days (`learn`), lost on Again or when the word is added back, including pasted lists (`unlearn`). Both go into backups and are merged on restore.
- Brand on every screen: tabs have a collapsing header (`.minihead` strip shows when the tab has `.collapsed`); sub-pages have `.topbrand` in the middle of `.topbar` (grid: Back, brand, ☰), which is sticky on every `.screen.sub`. Tapping any `.topbrand` scrolls its screen to the top.
- Pinned bars: the reading legend and controls (`#readBar`) and the My words filters (`#filterBar`) stay pinned just under the strip (`top:28px`; `pinned()` adds `.stuck`). `fitLegend()` sizes the legend to the width; `edgeFade()` fades a row that still overflows. Size button `#sizeBtn` (字字) opens `#sizePop`, which closes itself 4s after the last touch (`sizeOpen`); while Listen plays, the speed slider comes back when Size closes. A backup reminder shows on My words after a week or 100 reviews without a backup.
- Read-along: while Listen plays, `#speedPop` (慢–快) shows; `setRate()` keeps it and Settings' `#rate` in step, and `readAloud.restart()` replays the current chunk at the new speed. `readAloud()` speaks one chunk at a time (`chunksOf()`: sentences, long ones split at clauses, unpunctuated text about 15 characters at word boundaries) and highlights the whole chunk; stops on page turn or leaving the screen. Numbers like 3,000 stay one unit (regex in `buildLine`'s `flush`).
- Explore: `openExplore(fromReading)`; nine daily chips from the `topics` action (`fetchDaily`, cached per day in `radical-wiki-daily`, starter `TOPICS` until then; searches recorded in `myTopics` only feed it). Chips change only when Explore opens. `searchHits()` is prefetched per chip; a search shows `skeleton()` rows at once. Wikipedia search by topic or English query (`zhquery`), difficulty rating 1 to 10 (`rate`), Easier / Easiest rewrite (`simplify`).
- Review list (`#lookScreen`, `openLook`): face-up cards in list order, Shuffle (`radical-look-shuffle`) reorders only unseen cards; never grades.
- Grammar patterns: `isSlot`, `isPattern`, `patternPy`, `slotBox`. Color lines: `legendLine(text)`, `showLegend(after, text)`.
- Menu: History, Settings, How it works, Save a backup, About, Send feedback; no tabs. Pages opened from it (`MENU_PAGES`, flag `viaMenu` read by `go()`) show "‹ Menu" and `back()` reopens the menu; opened any other way they show "‹ Back". `showTour(fromMenu)`.
- 繁/简 for the interface: `uiScript()` converts the Chinese text nodes in the tab bar, menu, headings and About (originals in `uiOrig`); add class `uizh` to include more. Settings themes are compact rows (`buildPalettes`, samples via `sample()`).
- Counts: the 詞 badge = words with status Due (same as the filter); the Start row splits Today into due / known / new.
- Feedback: `FEEDBACK_TO` (empty hides the menu item) and `APP_VERSION`; bump `APP_VERSION` each batch.

## Accounts and sync (v30, v31)

- Sign-in is Supabase email OTP, called from the page (`sbAuth`: `otp`, then `verify` with the 6-digit code; `accessToken()` refreshes). Emails go out through Resend as login@upslopelabs.com (custom SMTP in Supabase; templates show `{{ .Token }}`). Session in `radical-session`.
- The server (`api/_account.js`) checks the access token with Supabase and keeps data in a private Storage bucket `radical` (no tables): `users/<id>/data.json` (+ daily `backups/`), `usage/<id>/<day>.json` (every AI call: action, model, tokens, estimated cost). Prices are estimates (env `PRICE_SONNET_IN/OUT`, `PRICE_HAIKU_IN/OUT`); daily stop `RADICAL_DAILY_CAP` (default $3).
- Sync: `saveWords()` stamps changed words with `t` (`stampWords`, comparing to `wordSig`) and records removals in `radical-deleted`; `syncNow()` posts everything, the server merges (newest `t` per word, tombstones, daily tallies by max, learned by union) and `applyMerged()` updates the word objects in place. Known gap: un-learning a word doesn't sync (learned merges by union).
- Env vars in Vercel: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SECRET_KEY` (Secret type), plus `ANTHROPIC_API_KEY`; `APP_PASSWORD` still accepted until deleted. `OWNER_EMAILS` and `TESTER_EMAILS` (Config type, comma separated): if `TESTER_EMAILS` is set, only those (and owners) get AI actions (403 `notester` otherwise); owners see everyone's AI use.
- AI use: usage files also store the email. The `usage` action returns your month (`me`), and for owners `all` (today, month, `byAction`, `byPerson`), listing `usage/` with the Storage list API. Settings → Account shows "AI this month: about $X"; the menu's `#aiTally` (owners only, `radical-owner`) opens a breakdown.

## Server actions (api/claude.js)

`card` (GET, cached at Vercel's CDN for a year), `words`, `ocr`, `translate`, `zhquery`, `rate`, `simplify`, `judge` (takes `pattern`), `topics` (Explore's daily chips), `explain` (解, card model), `notes` (class notes page image to items, card model), `example` (a new example sentence), `sync`, `usage`; public: `config`, `status`. Fast jobs use the Haiku model; cards use Sonnet.

## Open roadmap (not started)

- Apple and Google sign-in buttons, with the app-store wrap (Apple requires Sign in with Apple if Google is offered).
- Offline: app and character data cached, word list, flash cards, reviews, Listen and current reading; offline answers graded locally and re-checked on reconnect.
- Real AI cap after a month of usage data (from `usage/`).
- Mainland/Taiwan setting: Simplified as default (most learners), Taiwan as a toggle, card caches separated by region.
- Grammar mode: catalog from the HSK skeleton, AI-drafted, native-speaker reviewed; multiple-choice and word-tile tests.
- Domain, payments ($9.99 unlock plus an AI subscription), native apps, privacy policy.
- Real instrument recordings.
- "This week" card on My words and one quiet line under the 部 on the opening screen, built from the progress record: days studied (e.g. 5 of 7), cards per day, characters read per day, new words, and words learned shown as "312 learned · +14 this week · 3 back for review" (gains first; losses framed as back for review). No streak cliff and never sell streak protection; if a streak is ever added, give free rest days.
- Daily target on the tab bar (the 詞 badge shows today's progress).
- Notifications (cards due, at a chosen time): only after sign-in, since the server must know each device; iPhone needs the app on the Home Screen (iOS 16.4+).
- AI spending cap before sharing the app: a monthly cap in the Anthropic console and a per-device daily limit in `api/claude.js`.
- Sentence-gap cards (the example sentence with the word blanked out), once pre-built cards exist.
- Pre-built common cards; one-hour license check before charging.
- Save an article for later (a bookmark in Explore and the reader).
- Articles finished per week, as a stat for the This week card.
- Feedback address: `FEEDBACK_TO` is empty; upslopelabs.com exists now, so feedback@ (forwarded by GoDaddy) can go in.
- Launch: app stores only (no home-screen web launch); Apple $99/yr, Google $25; move hosting off Vercel Hobby before selling; no trademark for now. Company: Upslope Labs (upslopelabs.com).
- Branding: Scholar's Ink now; David is tempted by Lacquer & Gold. Not decided.

## Related

Guljan's app idea (working name Turn of Phrase, for long-time immigrants building active vocabulary) has its own handoff page, built from what Radical learned.
