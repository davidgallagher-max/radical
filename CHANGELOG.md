# Changelog

What changed in each version, in plain words. Newest first.

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
