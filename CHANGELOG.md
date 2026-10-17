# Changelog

What changed in each version, in plain words. Newest first.

## v33

- The opening screen takes a tap at once. If the characters are slow to arrive, the page opens anyway and says it's still loading, instead of looking frozen. It also shows a quiet line of progress under 部, like "5 days this week · 312 learned".
- This week, at the top of My words: days studied out of the last 7, cards, characters read and words added, then "312 learned · +14 this week · 3 back for review". No streaks; missing a day costs nothing.
- Daily target: set in Settings (Off, 10, 20, 30 or 50 cards). A thin ring around 詞 on the tab bar fills as you study and turns gold when you reach it. The badge still shows the Due count.
- Send feedback is now a form in the menu: write a note, add a screenshot if you like, and it arrives in the owner's inbox (from feedback@upslopelabs.com; replies go to the sender). A copy is kept on the server.
- Color lab (owner only, in Settings under the themes): nudge each part color's brightness, saturation and hue, and set stroke weight, highlight, relief and spark for the theme, all live on a sample and in the reader. Send values emails the numbers so they can be built in for everyone.
- Explore says "Searches Chinese Wikipedia" next to its name.
- Import checklists have Select all and Select none, and for class notes a switch per kind (Words, Phrases, Patterns, Sentences), so all the sentences can be dropped in one tap.
- "+ Add new words" under the text you're reading lists every dictionary word not yet in My words (common little words left out) as a checklist with pinyin and meaning.
- AI use and the $3 daily stop now follow the app's day (which starts at 4am your time), not UTC. The menu re-checks owner status at most once an hour, so the AI tally appears without a visit to Settings.

## v32

- PDFs whose hidden text is scrambled (common with fonts that print pinyin above each character) are now read from the page picture instead, so they no longer come out with Korean letters, wrong characters and missing English letters. Reading a page from a picture keeps English glosses and drops the pinyin.
- Import class notes: the file icon in the add box on My words now takes a PDF or a photo. Every word, phrase, pattern and sentence on the page comes back as a checklist with its pinyin and meaning. The teacher's English becomes the meaning, with spelling fixed; where her English was actually wrong, the right meaning is used and hers is kept as a "Class note". Pasted lists get the same spelling fixes.
- Edit the text you're reading: "Edit text" under the text, or in the 字字 size panel. For a PDF or article it edits the page you're on.
- Pick your own span: after tapping a word, the strip at the bottom shows its characters with ‹ › to take in the character before or after; tap the first or last character to drop it. Long-press a character to start from just that one. "+ Add" saves whatever is selected, and a second tap on it opens it.
- Editable cards: "Edit card" on the word page, or ✎ next to the meaning on a flash card's answer side. Change the meaning, the pinyin (for Taiwan readings), the example sentence (a new one from the AI, or write your own; pinyin and English are added) and add notes. Your version is kept on your word and syncs with your account; everyone else still gets the standard card. Edited parts are marked "yours" (or "from class"), and "Back to standard" undoes it.

## v31

- Ratings make sense at night. The app's day now starts at 4am (for "tomorrow", the daily new-word limit and the tallies). From 6pm a new or missed card's Hard means tomorrow and Good two days, instead of "later today". Again reads "this round" and one day reads "tomorrow".
- Flash cards end with "Another N" (the same kind of set, with the real count, when anything is left), "Go over the ones you missed" when there were misses, and Done. The back arrow is gone on that screen.
- The 詞 badge shows the same number as the Due filter. The Start row splits Today's set, e.g. "27 cards · 19 due + 8 new" (known words back for their check are counted as "known").
- Every speaker alternates: tap once for normal speed, again for about 70%, and back. After about 8 seconds it starts at normal again. Works on reading lines, card sentences and the word page.
- Listen cards have "In a sentence": it plays the word's example sentence without showing it (tap again for slower). It doesn't lower the rating; it's hidden when there's no example.
- All of the app's own Chinese follows 繁/简: the tab bar, headings, the menu, the size button and placeholders. Only the 繁 and 简 buttons stay as they are.
- While Listen plays, the speed slider comes back after Size closes, and a stray tap no longer hides it. Size closes itself 4 seconds after the last touch.
- The walkthrough waits for the opening harp to finish.
- Settings: the themes are compact rows in one panel, still with all five sample characters, and a ✓ on the one in use.
- The menu: History, Settings, How it works, Save a backup (moved from Settings), About, and Send feedback once there's an address. The tabs are no longer in it. Pages opened from the menu say "‹ Menu" and go back to it. About starts with "See how it works".
- Testers: if TESTER_EMAILS is set in Vercel, only those people get the AI features; anyone can still sign in, read, save words and study.
- Settings → Account shows your own AI use this month as an estimate. Owners (OWNER_EMAILS) see a tally of everyone's AI use at the bottom of the menu; tap it for a breakdown by feature and by person.

## v30

- Accounts: Settings → Account. Enter your email, type the 6-digit code it sends (from login@upslopelabs.com), and you're signed in. Your words go into your account and sync across every phone you sign in on, a few seconds after each change and whenever the app opens. A copy of this phone's words is kept on the phone the first time.
- The AI features now use your account instead of the shared app password (the old password keeps working until it's deleted in Vercel).
- Every AI call is logged per person with its estimated cost, with a high daily safety stop ($3 a day per person) until real numbers show what a sensible limit is.
- A status line in Settings says whether the account service is connected.

## v29

- 解 Explain on every line (and in card sentences): how the sentence is built, its grammar points, and words used in a less obvious sense. Made once, then kept.
- A walkthrough: three short cards on the colors, reading and studying. It shows once, and any time from the menu as 導 How it works.
- Flash cards end properly: 完 draws itself, then the session at a glance, words learned, what's due by tomorrow, and "Go over the ones you missed".
- Sounds: guzheng and woodblock only; anything good rises, a miss is one soft low pluck.
- My words: the flash cards box says Today (due cards plus today's new words) instead of Due, with one count on the Start row that matches the 詞 badge. Status colors are the same in every theme; only Due is warm, and Active is never red.
- Writing cards: once a character is done there's one button (Next character or See answer), and no repeated message.
- Listen cards take pinyin or characters in one box; a same-sound character gets sound credit and names the right one.
- A word's full card is made as soon as it's added, two at a time, waiting while offline.

## v28

- The top bar (Back, 部 RADICAL, ☰) stays pinned on every page that opens on top: word page, flash cards, Review, Settings, History, About.
- Listen card speeds are named for what they do: Normal, Spaced, One by one. (The iPhone voice won't stretch a single syllable, so the slower settings add gaps between syllables.)
- On the answer side, the glow sweeps across the whole rating bar and leaves a faint glowing edge.
- While Listen plays, a 慢–快 speed slider opens under the reading controls. It's the same setting as Settings → Speech speed, and letting go restarts the current sentence at the new speed.

## v27

- 部 RADICAL is on every screen. On the tabs, once the header scrolls away a slim strip with the brand and ☰ stays at the top; on other pages a small 部 RADICAL sits in the middle of the top bar. Tapping it jumps back to the top. Back buttons are shorter (My words, Reading, Flash cards), and on flash cards "‹ Previous card" sits on its own line opposite the score.
- Tilt is gone, along with the motion-access popup on every launch. The light still drifts on its own.
- Listen speeds you can hear: Slowest says one syllable at a time with a clear pause, Slower with a short pause; Normal is the whole word.
- Quit on flash cards always asks first, even before any card is rated.
- My words: Import is a file icon inside the add box (no separate row), and the flash cards panel folds to one row that keeps Start (it remembers open or closed).
- Random article scrolls to the results right away, like topics and search.

## v26

- My text now has its "讀 MY TEXT" heading under the 部 RADICAL header, like Explore and My words; the "Add text" and "Read" panel labels are quieter, matching Explore's labels.

## v25

- Reading bar: the Size button shows a small and a large 字 and fills while the slider is open; a second tap closes it. The color legend is bigger and spans the width, shrinking to fit narrow phones. When the bar (or the My words filters) is frozen at the top, a small ☰ sits at its right end, and anything still too wide scrolls sideways with a fade. On iPhone SE width the controls take two rows instead of overlapping.
- Numbers like 3,000, 1,234.5 and 3.5 stay together as one unit.
- Read-aloud goes a sentence at a time (long sentences by clause, unpunctuated text in chunks of about 15 characters) and highlights the whole sentence, so the voice stops skipping words. Listen fills while playing instead of getting wider.
- Every tab now has the 部 RADICAL header and menu; tab names are small headings under it.
- Explore: nine fresh topic chips a day, picked by AI from your searches and recent reading plus a few wild cards, with pinyin (starter topics until then; your raw searches no longer show as chips). The tapped chip stays outlined. Results appear at once: the list scrolls into view with placeholder rows, and chip searches are fetched ahead when Explore opens. "‹ Back to reading" shows when you came from the reading panel.
- My words: "Review these N" (or "Review selection (n)") looks through words card by card with everything showing, no grading and no schedule change; ‹ › or swipe, Shuffle (remembered, only reorders cards you haven't seen), Start over at the end. The selection bar's "Study these" is now "Flash cards (n)".
- Writing cards fit one screen: pinyin, speaker and meaning on one line, slim slots, a one-line coach, and the pad sized so the bottom bar never covers it. "Show this one" draws just the current character on the pad and counts it as hinted; after the last one the answer side opens. "‹ Previous card" moved to the top bar.
- Reading-card clues come in order for each character: sound, then meaning, then pinyin (more taps replay the sound), one at a time, right under the big characters.
- Ratings: Hard on a new or missed card means later today, so all four buttons differ; reviewed cards keep Hard, Good and Easy at least a day apart. The rating row glows when the answer shows, the suggested button pulses, and rating plays a short woodblock tick.
- Listening cards: Slowest, Slower and Normal speeds; tapping one plays the word and keeps the speed.
- Flash cards: "Back to my words" is now "Quit"; once you've rated a card it asks first and shows how far you got and the score.
- Grammar patterns: in items like ~到, the ~ or … shows as a dotted box with a Pattern label; pinyin checks, writing and the voice skip it, and the AI judge knows it's a pattern.
- A slim color line under big characters (word page, answer side, Review cards, a finished writing pad) shows only the colors actually used.
- Send feedback is built into the menu and stays hidden until a feedback address is chosen.

## v24

- Reading controls are compact and stay pinned at the top while you scroll: the color legend on one line, then Traditional/Simplified, Pinyin, Listen and a Size button that opens the text-size slider.
- The Add text and Read panels sit a touch darker than the page with a fine outline, and the tapped word and the word being read aloud are highlighted more strongly.
- Lacquer & Gold has distinct colors: cinnabar, gold, jade, mother-of-pearl, ivory and bronze.
- Flash card choices are outlined, so Start is the only solid button; Practice now includes Listen (hear the word, type its pinyin and meaning).
- Writing: a wider pad, a thinner brush, Hint in the pad's corner, hints in the stroke's own color, and a clear finish for each character (check mark, glow, chime, pad locks).
- My words: the filters fit on one row and stay pinned, and a reminder appears when it's been a week or 100 reviews since your last backup.
- The app now quietly records daily progress and the words you've learned, for a "This week" view coming later.
- Fixed: a card that failed to come back could leave the card screen redrawing itself.

## v23

- Writing cards no longer rush you: a finished character stays on the pad until you tap "Next character ›", and the last one waits for "See answer".
- The writing pad matches your theme again (no more white paper), and the stroke you're drawing is in its component's color with the same 3D look as the big characters.
- Richer, more saturated colors in every look, with softer highlights, so the characters match the color legend.
- The Pinyin toggle and every switch use the theme's accent color.
- The Random article button looks like the topic buttons.

## v22

- The latest v21 work is now actually live. It had been pushed into a nested `radical/radical` folder that Vercel ignores, so the live site was running an earlier v21.
- Restoring a backup file now brings back writing-card progress, not just reading progress.
- Added CLAUDE.md (how David and Claude work on Radical) and this changelog. Releases are now pushed by Claude on "batch", one commit per theme, and recorded here by version.

## v21

- Read-aloud stops when you turn the page or leave the screen.
- Writing flash cards: hear the word and see its meaning, then write it from memory on a rice-paper pad with black brush ink. Writing keeps its own review schedule.
- Flash cards: tap a character for a clue (its pinyin, meaning or sound); "‹ Previous card" undoes the last rating; header shows "Card 8 of 21 · 1 repeat" and a running score; the Done screen gives the totals and your best run.
- Meaning answers are judged by AI when the simple word match says no, so "AI" counts for "artificial intelligence".
- Bigger guess labels, fainter placeholder text, bigger result boxes, and a close × on the word strip in card sentences.
- New look "Original" uses the normal font with no drawing, color or light; the old Original is now "Plain ink". No grid lines except on the writing pad.
- The Traditional/Simplified toggle is labeled, "✓ In my words" asks "Remove?" on a tap, and "Met in your reading" is gone.
