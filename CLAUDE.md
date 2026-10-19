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

- Never put the API key in chat, code or GitHub. It lives only in the Vercel env var `ANTHROPIC_API_KEY`. Keep `.env` out of git.
- The word "Claude" never appears in the app's visible text (errors say "AI service").
- Never email anyone unless David explicitly says to send it.
- Wikipedia text is CC BY-SA: keep the credit line under articles.

## Structure worth knowing (index.html)

- Tabs: 讀 Read, 探 Explore, 練 Practice (screen id `wordsScreen`), 記 Track (`trackScreen`, `renderTrack()`), each under the same 部 RADICAL header (`.brandMark`) with a small `h3.sec.tabsec` name. Sub-screens (word page, flash cards, Review list, settings, history) use a stack: `go()`, `back()`; `setTab()` returns to a tab and ends per-visit toggles (`endSession`).
- Reading: `buildLine()` makes the grid (cells carry `_ch`, `_syl`, `_at`); first tap on a word picks it (peek strip), second opens the word page. The pick is a span of cells on one line (`pickSpan(line, a, b, tok)`): ‹ › grow it, tapping an end tile shrinks it, long-press (`holdToPick`) opens the character big (`enlarge(ch, actions)`) with Select just this (a one-character pick) and Open; + Add and Open work on any span. `editText()` edits the current text or document page (Edit text under the text and in `#sizePop`). `miniReader()` is the small reader used in card sentences (tap a word for a gloss strip with + Add and ×).
- Speech: `speak(text, slow)`; `slow = { k, gap }` says each character separately (Listen cards' Slowest and Slower); `{ k }` alone is one utterance at k times the speed. Every speaker alternates normal / about 70% on repeat taps (`altSpeed(key)`, resets after 8s): `[data-say]` buttons and the line speaker (`readAloud(lines, false, k)`). Tilt was removed in v27 (iPhones asked for motion access every launch).
- Characters: `svgFor()` draws strokes; `glyphFor()` returns the normal font instead when the "Original" look is chosen. `addLight()` is the 3D lighting on big characters; `lightReader()` adds the still lacquer finish in the reader.
- Looks (Settings): Scholar's Ink (default), Lacquer & Gold, Observatory, Plain ink (key `original`: drawn strokes, one color), Original (key `font`: normal font, no color or light).
- Words and review: `myWords` in localStorage, synced to the account when signed in (see Accounts). Backups are in Settings, Your words (`#backupBtn`, `#restoreFile`). Statuses New, Due, Learning (internal key `learning`; called Active before v34), Known. Known words come back every 60 to 180 days. Reading cards use `w.srs`; writing cards keep their own schedule in `w.wsrs`, listening cards in `w.lsrs`. `grade(w, g, k)`, `setStatus()`.
- Card edits: `w.mine` (meaning, pinyin, example, example_pinyin, example_en, notes) over the shared `w.card`; read through `cardOf(w)`, `wPinyin`, `wMeaning`. `w.fromClass` lists fields from imported notes (marked "from class", otherwise "yours"); `w.classNote` keeps the teacher's original English. `editCard(w, done)` from the word page (Edit card) and the answer side (✎); New sentence uses the `example` action; your own sentence gets `sentencePinyin()` and `translate`.
- Import (file icon in the add box): text files and backups as before; PDFs and photos go to `readNotes()` (each page as a picture to the `notes` action) and show as a checklist (`.nlist`).
- PDFs: `loadPdf`, `pageJpeg`; `pdfPageText()` reads a page from the picture (`ocr`) when the text layer has fewer than 10 Chinese characters or is `garbled()` (Korean, private-use or replacement characters).
- Modes: `KEYS` (read srs, write wsrs, listen lsrs), `modeDue(w, m)`, `dueAny`, `dueCount()` (badge and Clear due cards). `wStatus(w, how)` follows the picked practice (`revHow`, incl. `mix`). In a session `curHow` (Clear due cards = `openReview("clear")` runs as mix) and `cardMode` per word; `howOf(w)`, `srsKey(w)`, `assignModes`. In a clear session a word due in another mode comes back in that mode.
- Flash cards: panel asks Practice? (Read / Write / Listen / Mix), What type? (Suggested = key `due`: due cards plus today's new words, mix shown under it in `.revmix`; New; All), How many? It folds to one row with Start (`radical-rev-open`). With a filter on, Practice shows `#lookFlash` (Flash cards for exactly the filtered words). Import is the file icon in the add box.
  - Finish screen: 完 drawn, summary, learned this session, due by tomorrow; buttons Another N (same `lastSet` mode and count, hidden when nothing's left or after a hand-picked set), Go over the ones you missed (Review), Done; the top-left back is hidden. Walkthrough: `showTour()` (menu 導 How it works, `radical-tour-seen`). Cards are made on add via `queueCard()` (two at a time).
  - Read: guess pinyin and meaning, Check / I know it / Show answer. Front bar: just Check · I know it · Show answer. Header "Flash card 6/19" (`#revProg`, tags for new and the Mix mode); score `scoreHTML` 對 半 錯. Tones: `toneAt(input, t)` (syllables via `sylls`), the `.tonebox` on the right of the Pinyin box, numbers typed after a syllable mark it at once. Tap a character for a clue (sound, meaning, then the sound again; never pinyin), shown one at a time under the big characters; any clue caps the suggested rating at Hard. Pinyin is graded per syllable with tips (`checkPinyin`); a mark on the wrong letter is still right. Meaning: quick word match (words in brackets count as close), then the `judge` AI action (15s); if that fails the card asks ✓/✗ (`aiMean.ask`).
  - Typing: `kbFit()` (on `visualViewport` resize) adds `#reviewScreen.typing` while the keyboard is up: title, score and `#revBar` hide, the screen is sized to the visible area, `.revchars` gets a smaller `--cs`. After Check, `placeAnswer()` scrolls to show characters, result and bar.
  - Big characters: `bigWord()` sets `--n` (up to 4 a row); `holdToEnlarge(node, ch)` opens `enlarge(ch)` (`.bigview`) on a half-second hold without counting as a tap. Word page tiles also 4 a row; a one-time tip (`radical-hold-tip`).
  - Answer side: ✍ Write opens `practiceOnCard()` (the `practice()` pad with `onCard`: Show me / Write it again; not graded); Back to card re-runs `showBack` quietly.
  - Write: pinyin, speaker and meaning on one line; the pad is sized to fit above the bottom bar at its tallest; write each character; after each one the app waits for "Next character ›" / "See answer" (`writeFront`). "Show this one" animates only the current character and counts its strokes as hinted. `brushLayer` draws the live stroke in its component color with the 3D lighting.
  - Listen: "In a sentence" plays the example (`card.example`, else `context`) unseen, no rating cap. The word is played without showing it (the shared pace: Normal / Slower / Step by step; iPhone voices won't stretch a syllable, so the slow ones add gaps); type pinyin and meaning; the characters appear on Check.
  - Score row: 對 / 半 / 錯 and repeats, counted from how the card was answered (`revOutcome`), not the rating. ‹ Previous card (in the top bar) undoes the last rating (`revHist`). Quit (`#revQuit`) asks first once a card is rated.
  - Ratings: the app's day starts at 4am (`DAY_START_H`; `localDay()`, `midnight()`). `nextIvl` gives new or missed cards Again this round, Hard later today (`LATER`), Good tomorrow, Easy 4 days (from 6pm to 4am: Hard tomorrow, Good 2 days), and keeps Hard < Good < Easy a day apart otherwise. The answer side's whole rating bar glows (`.revbar.glow`); `tick(g)` plays the woodblock.
- Progress record (shown on Track and This week): `radical-days` holds a per-day tally (`c` cards reviewed, `r` characters read, `n` words added) via `logDay()`; a line counts as read after about 4 seconds on screen or when read aloud (`watchLines`). `learned` (`radical-learned`) lists learned words: earned when Known or a review gap reaches 21 days (`learn`), lost on Again or when the word is added back, including pasted lists (`unlearn`). Both go into backups and are merged on restore.
- Card sentences: `miniReader(text, mark, en)` has one row under the sentence (listen, 拼 Pinyin, Show English, 解, 字 opening size and speed tied to `radical-size` and `setRate`); no read-aloud highlight; still light (`lightReader(body, true)`).
- Light: big characters keep the slow moving point light (`addLight`, `lightTick`: about 15 updates a second, only svgs 60px+ on screen, paused in the background). Reading text is always still (`movingLight = false`; the spark code remains but is off).
- Speech pace: `sayPace` (`radical-listen-speed`: normal, slower, step), `setPace`, `paceSeg()`, `sayPaced(text, pace)` (sentences step by word via `segment`, words by syllable); repeat taps go one step slower (`altSpeed`, `slowerPace`).
- Track and stats: `streakStats()` (REST_DAYS 3 per REST_WINDOW 14), `charsKnown()` (distinct characters in words past New), daily snapshot `k` in `radical-days`, `knownSeries`, `lineChart`, `barChart`, `headline()` (splash and This week), milestones `checkMilestones()` (`radical-milestones`).
- History: entries {kind typed/photo/pdf/file/wiki/list, title, text | doc | words}; `record()`, `recordDoc(kind)`, `histDocPage()` keeps a document's page, `openHistory(h)`, filters; up to 100, oldest long documents trimmed past 2.5 MB.
- Settings: `<details class="setsec">` sections with `data-sum` summaries (`setSums()`); Speech has `paceSeg` and `sayVoice(tw|cn)`. Backup: `backupData()` (words, learned, days, text, doc, history, `SETTING_KEYS`), summary sheet then Save file; restore `#restoreFile` merges and asks before applying settings.
- Type: `html{font-size:112%}`; small labels have a .84rem (15px) floor. The reading control row uses fixed px sizes so it stays on one line.
- Landscape phones (`orientation:landscape` and `max-height:540px`): `#tabbar` becomes a right column (`--rail`) with `.railbrand` and a ☰ (`.railx`); tab headers hide; `#readBar` is one row; Explore's `.excol` columns sit side by side; the flash card panel goes two columns. Cards and sub-pages are not adapted (the app-store version will lock them upright).
- Brand on every screen: tabs have a collapsing header (`.minihead` strip shows when the tab has `.collapsed`); sub-pages have `.topbrand` in the middle of `.topbar` (grid: Back, brand, ☰), which is sticky on every `.screen.sub`. Tapping any `.topbrand` scrolls its screen to the top.
- Pinned bars: the reading legend and controls (`#readBar`) and the My words filters (`#filterBar`) stay pinned just under the strip (`top:28px`; `pinned()` adds `.stuck`). `fitLegend()` sizes the legend to the width; `edgeFade()` fades a row that still overflows. Size button `#sizeBtn` (字字) opens `#sizePop`, which closes itself 4s after the last touch (`sizeOpen`); while Listen plays, the speed slider comes back when Size closes. A backup reminder shows on My words after a week or 100 reviews without a backup.
- Read-along: while Listen plays, `#speedPop` (慢–快) shows; `setRate()` keeps it and Settings' `#rate` in step, and `readAloud.restart()` replays the current chunk at the new speed. `readAloud()` speaks one chunk at a time (`chunksOf()`: sentences, long ones split at clauses, unpunctuated text about 15 characters at word boundaries) and highlights the whole chunk; stops on page turn or leaving the screen. Numbers like 3,000 stay one unit (regex in `buildLine`'s `flush`).
- Explore: `openExplore(fromReading)`; nine daily chips from the `topics` action (`fetchDaily`, cached per day in `radical-wiki-daily`, starter `TOPICS` until then; searches recorded in `myTopics` only feed it). Chips change only when Explore opens. `searchHits()` is prefetched per chip; a search shows `skeleton()` rows at once. Wikipedia search by topic or English query (`zhquery`), difficulty rating 1 to 10 (`rate`), Easier / Easiest rewrite (`simplify`).
- Review list (`#lookScreen`, `openLook`): face-up cards in list order, Shuffle (`radical-look-shuffle`) reorders only unseen cards; never grades.
- Grammar patterns: `isSlot`, `isPattern`, `patternPy`, `slotBox`. Color lines: `legendLine(text)`, `showLegend(after, text)`.
- Menu: Settings, How it works, About, Send feedback (History is next to Explore; backups are in Settings). Pages opened from it (`MENU_PAGES`, flag `viaMenu` read by `go()`) show "‹ Menu" and hide their ☰, and `back()` reopens the menu; opened any other way they show "‹ Back". `showTour(fromMenu)`.
- 繁/简 for the interface: `uiScript()` converts the Chinese text nodes in the tab bar, menu, headings and About (originals in `uiOrig`); add class `uizh` to include more. Settings themes are compact rows (`buildPalettes`, samples via `sample()`).
- Counts: the 詞 badge = words with status Due (same as the filter); the Start row splits Today into due / known / new.
- Feedback: menu 信 Send feedback opens a form (`metaLine()` adds version, device, screen); the `feedback` action emails `OWNER_EMAILS` through Resend (`RESEND_API_KEY`, from feedback@upslopelabs.com, reply-to the sender) and keeps a copy in `feedback/<day>/`. Color lab Send values uses it with `kind: "lab"`. Bump `APP_VERSION` each batch.
- Splash: `start()` takes the tap first thing (`window.__radicalStarted`), shows `.spstat` from `weekStats()`, and catches load errors; an inline safety-net script under the splash dismisses it if the main script never starts.
- This week and daily target: `weekStats()`, `weekCard()` at the top of Practice (Today: N of target; tap opens Track); `updateRing()` now just refreshes This week and Track (the ring is gone). `radical-target`, Settings `#targetSeg`.
- Color lab (owner only, `#labWrap`, `buildLab()`): nudges in `radical-lab` = {palette: {dark|light: {roleIndex: {l, s, h}}, fx: {weight, highlight, relief, spark}}}; `PAL0` keeps the built-in colors, `applyLab()` rewrites `PALETTES`, `labFx()` feeds `lightReader`, `addLight`, `sheenStops` and `--sw` (stroke outline width on `g.strokes path`).
- Import checklist: `showPreview` rows (`found.notes` or `found.rows`) with Select all/none and kind chips (`.pvctl`); `addNewWords()` builds the reader's list (skips `SKIP_WORDS`).

## Accounts and sync (v30, v31)

- The page sends its app day (`localDay()`, 4am start) in `x-radical-day`; the server's `dayOf(req)` trusts it within a day of UTC and uses it for usage files, the daily cap and the tally's "today".
- Sign-in is Supabase email OTP, called from the page (`sbAuth`: `otp`, then `verify` with the 6-digit code; `accessToken()` refreshes). Emails go out through Resend as login@upslopelabs.com (custom SMTP in Supabase; templates show `{{ .Token }}`). Session in `radical-session`.
- The server (`api/_account.js`) checks the access token with Supabase and keeps data in a private Storage bucket `radical` (no tables): `users/<id>/data.json` (+ daily `backups/`), `usage/<id>/<day>.json` (every AI call: action, model, tokens, estimated cost). Prices are estimates (env `PRICE_SONNET_IN/OUT`, `PRICE_HAIKU_IN/OUT`); daily stop `RADICAL_DAILY_CAP` (default $3).
- Sync: `saveWords()` stamps changed words with `t` (`stampWords`, comparing to `wordSig`) and records removals in `radical-deleted`; `syncNow()` posts everything, the server merges (newest `t` per word, tombstones, daily tallies by max, learned by union) and `applyMerged()` updates the word objects in place. Known gap: un-learning a word doesn't sync (learned merges by union).
- Env vars in Vercel: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SECRET_KEY` (Secret type), plus `ANTHROPIC_API_KEY` (`APP_PASSWORD` was deleted in Oct 2026). `RESEND_API_KEY` (Secret, for feedback email). `OWNER_EMAILS` and `TESTER_EMAILS` (Config type, comma separated; TESTER_EMAILS deliberately unset for now): if `TESTER_EMAILS` is set, only those (and owners) get AI actions (403 `notester` otherwise); owners see everyone's AI use.
- AI use: usage files also store the email. The `usage` action returns your month (`me`), and for owners `all` (today, month, `byAction`, `byPerson`), listing `usage/` with the Storage list API. Settings → Account shows "AI this month: about $X"; the menu's `#aiTally` (owners only, `radical-owner`) opens a breakdown.

## Server actions (api/claude.js)

`card` (GET, cached at Vercel's CDN for a year), `words`, `ocr`, `translate`, `zhquery`, `rate`, `simplify`, `judge` (takes `pattern`), `topics` (Explore's daily chips), `explain` (解, card model), `notes` (class notes page image to items, card model), `example` (a new example sentence), `sync`, `usage`, `feedback` (Resend email; not AI, no tester check); public: `config`, `status`. Fast jobs use the Haiku model; cards use Sonnet.

## Next batches (re-planned Oct 18, 2026: TestFlight first)

- Palettes: David is picking from the comparison page (claude.ai artifact "Radical Palettes": Lacquer & Gold, Scholar's Ink, Dunhuang, Sancai, Celadon & Cinnabar). Every current palette fails the red-green check on Meaning vs Sound; the chosen one gets Meaning and Sound that differ in lightness, not just hue.
- v36, the app: wrap Radical for iPhone, built on GitHub's Mac runners (no Xcode for David), offline mode (Apple rejects a website in a frame; offline is the proof), cards and word page locked upright, TestFlight upload for Laoshi and testers. Sign in with Apple isn't needed while sign-in is email codes only. Waits on David: LLC filed, EIN, D-U-N-S, Apple Developer Program as Upslope Labs ($99/yr); Google Play as an organization too (no 12-tester rule).
- v37, data layer: card library (shared table `cards/` filled from users' cards, vocabulary and patterns only, never sentences or edits; rebuilt into bundled files on a schedule; about 5,000 common words pre-built; each card carries both scripts and both readings; Settings: "Share new words with the card library" opt-out, updates Ask first / Automatic / Never with the size shown, About line with size and date), then the Mainland/Taiwan setting, then offline mode (service worker, Home Screen recommended).
- Looks: David's color lab values built in for everyone; Lacquer & Gold as default and brand if it still wins.
- Own domain (e.g. radical.upslopelabs.com): David adds it in Vercel and a CNAME in GoDaddy; walk him through it.
- Later: notifications (needs Home Screen on iPhone; Vercel Hobby cron is once a day), Apple/Google sign-in with the store wrap (Upslope Labs LLC, D-U-N-S).

## Open roadmap (not started)

- Apple and Google sign-in buttons, with the app-store wrap (Apple requires Sign in with Apple if Google is offered).
- Offline: app and character data cached, word list, flash cards, reviews, Listen and current reading; offline answers graded locally and re-checked on reconnect.
- Real AI cap after a month of usage data (from `usage/`).
- Mainland/Taiwan setting: Simplified as default (most learners), Taiwan as a toggle, card caches separated by region.
- Grammar mode: catalog from the HSK skeleton, AI-drafted, native-speaker reviewed; multiple-choice and word-tile tests.
- Domain, payments ($9.99 unlock plus an AI subscription), native apps, privacy policy.
- Real instrument recordings.
- Streaks: never sell streak protection; if a streak is ever added, give free rest days.
- Notifications (cards due, at a chosen time): only after sign-in, since the server must know each device; iPhone needs the app on the Home Screen (iOS 16.4+).
- AI spending cap before sharing the app: a monthly cap in the Anthropic console and a per-device daily limit in `api/claude.js`.
- Sentence-gap cards (the example sentence with the word blanked out), once pre-built cards exist.
- Pre-built common cards; one-hour license check before charging.
- Save an article for later (a bookmark in Explore and the reader).
- Articles finished per week, as a stat for the This week card.
- Launch: app stores only (no home-screen web launch); Apple $99/yr, Google $25; move hosting off Vercel Hobby before selling; no trademark for now. Company: Upslope Labs (upslopelabs.com).
- Branding: Scholar's Ink now; David is tempted by Lacquer & Gold. Not decided.

## Related

Guljan's app idea (working name Turn of Phrase, for long-time immigrants building active vocabulary) has its own handoff page, built from what Radical learned.
