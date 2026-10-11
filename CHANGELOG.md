# Changelog

What changed in each version, in plain words. Newest first.

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
