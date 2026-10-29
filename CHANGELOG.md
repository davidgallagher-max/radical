# Changelog

What changed in each version, in plain words. Newest first.

## v58

- Signed in, everything now follows you between devices: your settings (look, goal, cards a day, words target, streak rule, speech, region and the rest), your History of texts and articles, and what you're reading now (a document opens on the same page). The newest change wins. A device signing in for the first time takes the account's settings. History goes up one entry at a time, only when it changes.
- Signed out, Radical asks you to sign in once you've saved 5 words (and again at 25 and 100), so your words are kept on your account.
- The Backup page and its reminder are gone (the account keeps everything). An old backup file still restores in full through the file icon in Add words.
- Export words: a button under the list on Practice saves the words shown (or the ones you ticked) as a spreadsheet file: word, pinyin, meaning, deck, status. Words only, never texts or articles.
- "What do you want to practice?" now says "Pick one, two or all three."

## v57

- When the reading ring around 讀 turns gold, it swells and settles back while gold sparks fly off its rim (about 2 seconds). It plays once, at the moment you reach your target. Off with Reduce Motion.

## v56

- Fix: reading a long paragraph now counts. A paragraph taller than about half the screen never counted as "on screen", so slow scrolling through an article gave almost nothing. Words now count one by one as you read, at the same pace as before (about 1.5 words a second), and a paragraph you scroll past halfway keeps the words you read.
- "N words to go" ticks down in steps of 5.

## v55

- A ring around 讀 on the tab bar fills as you read toward your Words read a day target and turns gold when you reach it.
- Read shows "N words to go" next to the heading, and in the top strip while you scroll. It drops as lines count (each line counts after a few seconds on screen at reading pace).
- Track calendar: on the Both setting, a day with only cards or only reading done shows half filled; tap it to see which half.
- Fix: lowering Cards a day or Words read a day now marks today as met right away if you're already past the new target, and removing the last card of Today (Remove or I know this) still finishes the day.

## v54

- Read: slide your finger sideways along a line to pick several characters; slide back to drop them. The word strip has ⌫, which takes back the last character you added.
- Foreign names spelled out by sound (阿姆斯特爾河) now stay together as one word instead of falling apart.
- Practice: filing Basecamp and ticked words have a Cancel button (it was a small ✕).
- Flash cards: after the big 對 / 半 / 錯, a small glowing one stays in the card's corner until the next card.
- Settings, Account: Delete account. It erases your account copy, friends and AI history, and the sign-in.
- Friends: Block (also on a request) and Report. Blocked people can't send you a request; a report reaches us by email.
- Privacy policy at upslopelabs.com/radical/privacy, linked from About.
- The iPhone app (in progress for TestFlight): the same app in a native shell, with everything it needs inside so it opens and reads with no signal. It picks up new versions of the page from the web by itself, so tweaks keep shipping without a store update. The icon shows the 練 number. Flash cards and the word page stay upright. Built on GitHub's Macs.

## v53

- The deck chip on the card back and the word page has a small DECK label in front (DECKS when the word is in several), so it reads as something you can change.
- Word Decks dates: each deck shows the day it was made or the day you last studied it, whichever is later. Decks made before this guess from the last change to a word in them.
- Basecamp explains itself: "New words camp here until you file them." over the word list, and as a bubble when you tap Basecamp while it's already picked. The button is now gold and says File Basecamp into decks. The deck sheet says "new words camp here" under Basecamp.

## v52

- One deck sheet everywhere (+ Add, ✓ Added, the deck chip, Add words, imports, ticked words): tick as many decks as you like, or Basecamp alone. Nothing changes until Save; Cancel leaves it. + Add always opens it, with your last choice ticked. ✓ Added opens it too, with Remove word.
- All decks: every word, each once. It's at the top of More.
- Ready-made decks are always there: tap a topic to study it. Its words join yours only when you first study them, so no ✓ and no Remove. Admin tools can pre-build every topic deck so they open instantly.
- Flash cards labels are centered, with a line each side.
- The deck chip sits at the bottom of the card back and the word page, with a soft fill.
- Settings: Sound and light is now Sound and lighting.

- Fix (same day): a new deck showed an old date in Word Decks (the last review of a word in it). Making a deck or saving words into one now marks it today.
- Fix (same day): on a card's answer side, the deck chip now sits at the very bottom, under the example sentence.

## v51

- Flash cards: each row has a small label (Deck, Skill, Type, How many). The deck row always shows, with More.
- Practice: adding words is one slim ＋ Add words row. Open it to pick the deck (Into) and type, paste or import. The Word Decks row is gone (More opens the same thing).
- + Add says where the word goes ("+ Add to Hiking"): the deck you picked last, Basecamp at first. ▾ picks another, with your last deck on top.
- The word strip in Read has a ✕ to close it. Its Add and Open buttons have their own row, so the meaning shows in full.
- Tap ✓ Added to take a word back out. If it's in several decks, you pick which ones (or Remove word).
- Fix (same day): changing your goal (Cards a day, Words read a day, Either or Both) now counts from that day on. Before, it re-judged every past day, so the calendar and streak lost their goal days.

## v50

- Flash cards: the deck you're on glows (green, or gold for Basecamp), so it's clear which one is picked. Basecamp is quieter when it isn't picked. Picked Read/Write and Today/New pills have a stronger fill and edge.

## v49

- Admin tools: New message beside Edit. Posting it replaces the pop-up, and the old message stays in Notes from David.
- Take down only ends the pop-up. The message stays in Notes.
- Notes from David: owners get a ✕ on each note to delete it from the history. Nobody else sees it, and the server refuses anyone else.

## v48

- Flash cards list pills: Basecamp always comes first, in gold, then the deck you're on (or the one you used last), then More. The one showing keeps its outline.
- Friends: the Email button is gone. Share does the inviting, with a friendlier message.
- Streaks count days you meet your goal, not just days you open the app: finish Today, or read your words for the day (Settings, Words read a day: 100, 200 or 500). Settings can ask for both instead. Goal days are solid on the calendar. Days before v48 count the old way, and the 3 rest days per 2 weeks stay.
- Settings: Cards a day, Words read a day and what a streak day needs are one group, Daily goal.
- Fix (same day): days before the calendar had 達標 marks now show goal met when you did your Cards a day (or read your words target) that day.

## v47

- Added is now Basecamp: where new words land. It can't be renamed or deleted, and a word leaves it when it goes into a deck.
- A word can be in several decks. Its progress is shared, so studying it in one deck counts in all of them.
- New words always go to Basecamp, wherever you are. + Add has a ▾ beside it (reader, card sentences, word page) to send that one word to a deck or a new deck instead. A note says where it went.
- The word page and the back of a card show the word's decks as a chip. Tap it to add or take out decks. Edit card uses the same chip.
- Practice list: tick words, then Add to deck ▾. On one of your decks, Take out of it. With 10 or more words in Basecamp, Sort into decks › starts this for you.
- Explore's On this day no longer skips politics. It picks the most uplifting events of the day (discoveries, firsts, launches, arts, science, sport) and still leaves out war, disasters and deaths.
- Fix (same day): On this day opened the year's own article (1875年) instead of the one the event is about. Each row now reads as one line, the year and what happened, with the article's English name, length and difficulty under it.

## v46

- Today always fills to your Cards a day. Your picked deck comes first; when it runs short, words due in your other lists come next, then new ones. A card from another deck shows that deck's name in its header. The 練 badge shows the same number.
- Mine is now called Added. The list pills on Flash cards are the deck you're on, Added (or the last one you used), and More.
- Topic decks: pick 12, 24 or 50 words in Word Decks before choosing a topic. A topic deck you have gets ＋ More words.
- Share a deck: tick it in Word Decks, then Share. Send a link anyone can open, or send it to a friend, who gets it on 記 Track with Add or No thanks. It goes with your meanings, never your notes or progress. Opening one adds it as your own deck. A friend's row shows how far each of you is in the decks you share.
- Follow the builder: Friends has a David G. row anyone can follow. Followers see David's progress and the decks David sends to followers. David sees only how many follow.
- Friends: Email opens your own Mail with an invitation and your link. Nothing is sent from Radical.
- 箋 Notes from David in the menu lists every Open Message, newest first, with a red dot on ☰ until you open it. Chinese in a message reads like Read: drawn, colored, tap a word, with a speaker. A message can carry a deck with an Add button.
- The Open Message now asks the server fresh every time, checks whenever you come back to the app (at most once a minute), and waits while a sheet or cards are open instead of giving up. Admin tools shows what this phone last heard, with Preview.
- Explore has an On this day row from Chinese Wikipedia (two or three events, skipping politics, states, wars and disasters). Each shows like a search hit: the year and article, its length and difficulty; tap for the event and the opening, then Read in Radical.
- Fixed: a ready-made deck in History could stop the day's Explore chips from loading.
- Fixed (same day): Word Decks and every other tall sheet now scroll, and Word Decks has a ✕.
- Fixed (same day): the message posted before v46 now shows in Notes from David, and opening Notes always clears the red dot.

## v45

- Word Decks: the table lists every deck you have, your own and the ready-made ones you've added, each with its word count and last used day. Study together works across all of them. A ready-made deck is removed from its row (tick it, then Remove: words you haven't studied go, studied ones move to Mine); the separate "Remove the Food deck" button is gone. "✓ you have it" sits beside the Ready-made heading.
- Last used now shows for older decks too: the last day you studied any of its words, or "—" if never. Starting cards counts as using the deck.
- The owners' message now shows when you come back to the app, not only on a fresh start (checked at most every 10 minutes).
- Owners get one menu entry, 管 Admin tools: AI use (with the breakdown), Post an Open Message, and the Color lab (moved out of Settings).
- Post an Open Message stays on the page after Post. A live message shows "Posted Oct 25" with Edit and Take down; Post only shows while you edit.

## v44

- Friends: a username (anything you like) plus your real first and last name. Friends see your username, and your first name with your last initial when they open your row. Adding or accepting a friend needs both names, and anyone missing them is asked once.
- Deleting asks once, and the armed button now has Cancel beside it. It also resets after 4 seconds or when you tap anywhere else (friends, words, decks, the text and card bins).
- Class notes: the teacher's English is kept as the word's meaning, marked "from class". Words already in your list show up in the checklist ("in your words"); adding them puts them in the deck and gives them the teacher's English unless you wrote your own.
- The silent-mode tip on flash cards is gone. The line under Settings, Sound stays.
- Owners can post a notice from the menu (告 Notice, with an optional end date). Everyone sees it once, a moment after the splash. Take down removes it.
- 解 explanations are shared: once anyone has asked for a sentence, the next person gets it at once, at no AI cost.
- Sentences work the same in Read and on cards. The speaker plays at your pace every time, shows ■ to stop, and the 慢–快 slider shows while it reads. Tapping a word gives the pick strip (‹ ›, + Add, Open ›), a second tap opens it, and holding a character enlarges it. EN is now ENG, and 解 says Hide while its explanation is open.
- Word Decks: your decks are a table with their word counts and the day you last used them, newest first. Tap a row to study it, or tick rows for Study together (several decks as one), Rename or Delete. Deck names are at most 20 characters. Green marks only the deck you're on; ready-made decks you have get a ✓. The ready-made one you're on can be removed ("Remove the Food deck").
- Cancel on New deck, Rename or Deck from a topic goes back to Word Decks.
- How it works: the Listen card and the read-aloud page now speak.

## v43

- English in the reader uses a serif that matches the Chinese, like a printed page.
- Reading in portrait: once, after 20 seconds, a quiet tip says "Turn your phone for a wider page."
- The dividing lines in the Flash cards box are a little stronger.
- Your own decks: ＋ New deck in Word Decks (name it), rename or delete it (its words go back to Mine), and Mine can be renamed. A word you add goes into the deck you're in. Importing class notes asks which deck, or a new one ("Lesson 5"). Edit card moves a word to another deck. The AI topic deck is now "＋ Deck from a topic".
- Friends: each friend is a row with a ›; tap it to open their numbers right there. Adding or accepting a friend needs your real name (first name and last initial), and anyone with friends but no name is asked once.
- Settings → Account: "Your AI usage this month: about $X", with when it resets (the 1st, 4:00 am).
- The AI safety stop is $0.25 a day per person. Owners have none, signed-out tries share $1 a day, and people on the GENEROUS_EMAILS list get $3. The old app password is gone.
- Track's calendar: tap a day for its cards, words read and words added. Days you finished your cards show 達標 Goal met.
- The Meaning box on cards has autocorrect.
- The meaning check tries twice before asking you ✓ / ✗, and failed checks are logged (owners see them in the AI breakdown).
- Today: words you've practiced today are done for the day, so the badge reaches zero. Hard means tomorrow, not later today; only Again repeats a card, in the same round. Today fills with new words only, never Known or Learning ones. A word you missed and left shows as "N to go over again".
- Mastered: right with tones on two different days, rated Good or Easy both times. The word then goes to Known with one check a month later. I know it makes a word Recognized; at the month check, a right answer (or I know it again) makes it Mastered. Hard never counts.
- A tone slip with the sounds and meaning right pushes the word out further (1.5 times the gap instead of 1.2).
- Mastering a word on a card: 掌握 Mastered blooms in gold with a sweep up the guzheng.
- A half-right answer (半) has its own soft middle note.
- On iPhone, the first five card sessions say "Card sounds play when your phone isn't on silent." Settings says it too.

## v42

- 普通话 or 國語: a Mandarin setting (first on the start sheet, then first in Settings) picks Mainland or Taiwan. It sets the readings, the voice, the word choices in cards and sentences, and the script. No flags. Existing users keep what they had (Traditional means Taiwan).
- English in the reader flows like a printed page: Chinese keeps its squares, English sits at its own width and breaks between words, and punctuation takes half a square. A comma or closing bracket never starts a line. English is a little bigger.
- Top 1,000 is exactly 1,000 words (it was about 880, because several characters shared one word).
- Picking a list or Word Deck opens on All. Coming back to 練 still opens on Today.
- Today always fills to Cards a day: due, then new, then Learning, then Known. The hidden 10-new-words cap is gone.
- Flash cards keep your place. The tab bar stays during cards (hidden while typing), 練 takes you back to your card, and Quit is the only way out. Exit and "Continue · N left" are gone. Tapping the card outside a box closes the keyboard.
- The card 🗑 sits on the card's corner and is always there. The card header fits one line. Fixed: the header and score could stay hidden after the keyboard closed.
- Rating bar: "Rate it to move on". "Suggested" takes the suggested button's color. "It decides when this comes back" is gone.
- Mix: Listen cards have "Not now". The card becomes a Read card and Listen sits out the rest of the session.
- Every speaker shows ■ while it talks; tap to stop. The next tap plays it slower.
- Card sentences have the same controls as Read: speaker, EN, 解 Explain, then 拼 Pinyin, ↻ and 字 (size). While the sentence plays, a 慢–快 dial shows.
- Word Sets are now Word Decks. With many decks, the row shows the one you're on, your recent ones and More.
- A line divides the list pills from the mode pills.
- Track's calendar is two greens again: bright for days you finished your Cards a day, pale for days you studied.
- Friends need approval. A code or link sends a request; the other person sees a red number on 記 and Accept / Decline (Decline can be undone for a few seconds). Code tries are limited per day.
- Your name for friends shows as text with a pencil; Save lights up only after a change.
- Fixed: a sync answer with no words could empty your word list.

## v41

- Practice has lists. Mine, Top 1,000, Travel and each Word Set you start get a pill at the top of Flash cards. Today, the counts, Start, the list below and the red number on 練 follow the list you picked. The others wait: nothing piles up on them.
- The daily cap is shared across lists. Do 20 on Travel and the rest of the day has 10 left, wherever you switch.
- Top lists teach words, not single characters: 管理 for 管, 國際 for 際. The whole list shows at once; a word joins your words when you first study it. Single characters from before stay.
- Word Sets: a set's cards are made when you first study a word, not when the set is added. Tapping a set you have switches to it. Remove (in the Word Sets sheet) drops the words you haven't studied; studied ones move to Mine.
- First start asks "How much Chinese do you know?": Just starting (Top 100), A few hundred words (Top 1,000, starting at #300), 1,000+ words (Top 2,000, starting at #1,000), or pick a topic.
- Progress is counted in words everywhere. Track's boxes sit under one Words heading: recognized, mastered, read. Familiar is now Recognized and Learned is Mastered. The Characters bar is gone; the Words bar's labels are colored like the bar. Milestones, the splash line, the chart, the yearly table and Friends count words too. Words read starts counting from this version.
- Flash cards: a 🗑 on every card (tap, then Remove?) and a pencil beside the pinyin for Edit. Remove and I know this are out of the edit sheet, and it no longer pops the keyboard.
- I know it on a new card marks it Known (back in 2 to 6 months), shown as Known on the rating button. No more days under the rating buttons.
- The score rolls as the bloom fades, on the answer side.
- "2 done today" instead of "2 today".
- Add takes English. One word gives a list of Chinese words with their meanings, most common first; a few words in context ("patience with kids") gets the best fit. The Read box turns an English passage into Chinese to read, and one English word gives the same list.
- 🗑 under the reading text clears it (it stays in History).
- How it works plays each animation once, with ↻ to replay.
- Track's calendar starts on Sunday.
- The sign-in sheet says why it opened ("Sign in to use Explain") and what you get. Signed out, the first 10 uses of Explain, English and the like work without signing in.
- Fixed: the Travel set said "The answer wasn't readable". The Word Sets line could show twice.

## v40

- Hotfix: the Read tab was blank since v39. The tour's styling hid the text box and reading area.

## v39

- Practice: the This week box is gone. "12 today" sits by the Flash cards title, in the theme's second color; tap it for Track. The daily target is gone too.
- Practice opens on Today, with a red badge on its count, while Today has cards. Once Today is done it opens on All, so the list below is never empty. A pill you tap stays until you leave the tab.
- Word Sets replace Most common characters. Top 100 · 500 · 1,000 · 2,000, six topics (Food, Travel, Family, Work, Feelings, Time) and ＋ Make a set for any topic you type, checked against the dictionary. With no words yet, Word Sets fill the top of Practice; after that, one line under Add opens them.
- First start: "Start with a curated list at your level." New, Some or Comfortable (the Top list from #1, #300 or #1,000), or pick a topic.
- Sign in comes right after you choose a set, in a small sheet: email, then the 6-digit code. Anything that needs the account opens the same sheet instead of jumping to Settings. Still optional.
- How it works is four short pages, each one line and a little animation: the colors, reading, listening and explaining, saving and practicing. With reduced motion they're still pictures.
- The Learning focus pop-up is now just "What do you want to practice?" with Read, Write, Listen.
- Settings: Cards a day (10, 20, 30 or 50) sets the size of Today. Default 30.
- Backup has its own page in the menu (存 Backup), out of Settings.
- Feedback: when you're signed in, a copy of your note goes to your email.
- Shorter text all over: hints, notes, errors and Settings. Friends hides when you're signed out. The Easier version line says "rephrased by Radical."
- Fixed: on a first launch the Start reading button under the colors was missing.

## v38

- Most common characters, for beginners: one line on Practice under Add offers the 100, 500, 1,000 or 2,000 most common. A set joins your own words rather than living apart: a few characters a day fill the new-card slots your own new words leave, so nothing arrives as a pile. The line then reads "Common 500 · N familiar"; tap it to see just those words, grow the set, or remove it (only the unstudied ones go). Single-character cards now show a common word with that character on the answer side. New users are offered the first 100 once. The ranking comes from wordfreq (CC BY-SA, credited).
- Track: characters now have three stages. Seen (in a word you've practiced), Familiar (right on two different days) and Learned (remembered after three weeks, as before). Familiar moves within days, so the effort shows. A bar shows all three, the Words bar adds Seen and Familiar, and the yearly table adds Words familiar. The old line chart only shows once there's a month of history and 50 familiar characters, and then shows familiar and learned together.
- Track boxes: the three numbers under the calendar are yours to choose (Seen, Familiar, Learned, Characters read, Words learned, Cards reviewed, Days practiced). Tap a box to see its characters or words; touch and hold to change it. Also in Settings, Track boxes. This week shows the same three.
- Friends: each signed-in person gets a short code on Track, with Share (a link) and a QR code. Enter a friend's code or open their link and you're connected both ways; either can remove it. Friends see your chosen name, characters by stage, this week and your chart. Never your words. No search and no public list.
- The 部 mark, the splash and the Home Screen icon are Lacquer & Gold in every theme (阝 in cinnabar, the rest gold; deeper gold on light pages). Reading colors still follow your theme.
- "My goal" is now Learning focus: "The red number on 練 shows the minimum flash cards to practice Today." A switch in Settings turns the red number off.
- Today holds at most 30 cards; the rest wait. N more takes the ones that waited first.
- The finish screen counts like the red number: "N left today" and "Tomorrow: about N cards".
- Flash cards: when the meaning can't be graded and the card asks ✓ Right / ✗ Wrong, the 對 半 錯 flourish and its sound wait for your answer. The score now rolls the right way (the new number drops in from above) and only after the flourish fades.
- ✎ on the answer side has I know this and Remove this word (tap twice), which take the word out of the set at once without scoring it.
- Reader: numbers and English sit smaller, in the plain font, with no big gaps, and a number keeps its unit (401.3 km²).
- Listen reads the whole text, turning pages on its own; turn a page yourself and it carries on from the top of that page. It keeps the line being read about a quarter to a third of the way down, and waits a few seconds after you scroll by hand. Switching tabs still stops it.
- Read tab: the add box folds into one slim "＋ New text" row, so the article starts right under the controls. The "Read" heading above the colors is gone.
- Grey text everywhere is about 10% bigger and a little lighter.
- Two thin lines in the Flash cards box, under Read · Write · Listen · Mix and under the Today row.

## v37

- Flash cards, redone. One box at the top of Practice holds everything as pills: Read · Write · Listen · Mix, then Today · New · Learning · Known · All (with counts, and the list below follows the one you pick), then how many, then Start. The count row only offers sizes smaller than the group, plus All; a small group just shows All (8). Learning is every word you don't know yet. New, Known and All come up shuffled.
- "Due" is gone. Today means the words up for review in your goal plus a few new ones. The 練 badge counts what's left in Today and now updates when you come back to the app, once a minute while it's open, and when the day turns at 4am.
- My goal replaces I practice: pick Read, Write, Listen, any one or more (asked once, changeable in Settings). Every mode is always there to practice; the goal only decides what Today and the badge count. Clear due cards, Suggested, What type?, How many? and the separate Resume row are gone.
- Leaving cards: top left is now Exit, which keeps your place (Practice shows "Continue · 12 left"). Quit, top right, ends the session and still asks first. Finishing Today says "Done for today" with a button for 10 more.
- The "Flash card 6/19" line and the 對 半 錯 score stay pinned at the top of the card, and the answer scrolls in under them. When a score goes up, it glows and its number rolls over like a dial.
- The 對 半 錯 flourish holds longer (about 2 seconds). The rating bar no longer flashes a light across; it grows a little, settles back and keeps a soft glow, and the suggested rating pulses slowly until you pick. Its lines now read "Rate it for next card" and "Suggested or your choice".
- Tone boxes show only when the syllable before the cursor can take a tone (it has a vowel and no mark yet).
- Write cards: Show this one puts the finished character on the pad at once, with "▶ Watch it drawn" if you want the strokes. Show answer reveals the whole word. No more "Character done" text, just the button.
- Three example sentences per new card, one picked each time. ↻ next to the sentence steps to the next one, and after the last it writes a fresh one (older cards get two more on the first tap). Your own sentence always stays. The word page shows them all.
- Characters read is honest now: a line counts once a day, and credit builds at reading pace (about 2.5 characters a second while it's on screen). Redrawing the page or flicking past an article no longer adds anything. Past numbers stay as they were.
- Reader: English and numbers inside Chinese text read as normal words ("401.3 km² (154.9 mi²)"), wrapping only between words.
- Explore: no voice when you tap a topic, topics change more from day to day (a week of recent ones are avoided; 7 varied picks plus 2 near what you read). Headings are Pick a topic, Search and Surprise me, with "Real Chinese Wikipedia, written by native speakers." under the title.
- Two-way and three-way switches (繁/简, Original/Easier/Easiest and the rest) have clean rounded corners on the picked side.
- Adding words from a text: each word has a check circle. "Check the ones to add." No more strikethrough.

## v36

- One due number everywhere: the badge, Clear due cards and the Due chip in Mix count words due, not cards. A word due in Read and Write is one word, and clearing it covers both. Under Suggested: "10 of 38 due + 2 new".
- I practice (Settings): Read, Write, Listen. Only Read is on to start. A mode that's off makes no cards, isn't in the badge and never shows up in Mix or Clear due cards; its progress is kept for when you turn it back on. (Mix used to pick modes at random, which put words into Write you never chose.)
- Practice tab: This week at the top, then a pinned Read · Write · Listen · Mix row with the status chips, then Clear due cards, Flash cards, Add words and your list. Everything under the row follows the mode picked. A mode that's off shows dimmed and offers to turn itself on; Mix waits for a second mode.
- Step away from flash cards (another tab, the menu, closing the app) and Practice shows "Resume · 7 of 19" until the day ends. Quit still ends the session, and still asks first.
- Gold leaf: each screen's main button has a metal finish in the theme's accent (real gold in Lacquer & Gold); other selected controls get a thin outline and colored lettering instead of a fill.
- Three new themes: Bauhaus, Aurora and Risograph.
- Color vision (Settings, Appearance): Red-green safe keeps your theme and makes Meaning darker and Sound lighter so they never look alike.
- When you answer a card, 對, 半 or 錯 blooms in the middle of the screen and fades (off with Reduce Motion).
- Write cards: "Show this one" on the last character waits for See answer, and a character with no stroke data no longer jumps to the answer. The rating buttons ignore a tap for half a second after they appear, so a tap meant for the button before can't rate the card.
- Listen cards have the tone boxes and typed tone numbers, the same as Read.
- "Characters learned" replaces "characters known" (opening screen, This week, Track and milestones) and counts only characters in learned words (marked Known, or three weeks between reviews). The Track chart is rebuilt from the day each word was learned.
- Settings opens folded every time (Account still opens on its own when you're signed out).

## v35

- Four tabs: 讀 Read · 探 Explore · 練 Practice · 記 Track. "My words" is now Practice everywhere.
- Track (記): your streak (3 rest days in any 14 don't break it; the 4th does), today against your daily target, a month calendar of days used, characters known and characters read, a chart of characters known over time, the last 30 days of cards and reading, words by stage (new, learning, learned) and a table of this year, last year and all time. No accuracy chart.
- Milestones: a short moment at round numbers (characters known, characters read, streak, cards). Ones already passed were recorded quietly.
- The opening screen and This week lead with streak, characters known and days this week; This week also shows "Today: 12 of 20 cards" and opens Track when tapped.
- The ring around 詞 is gone. The Due badge is a standard red, and it counts every card waiting in any mode.
- Practice has Mix: each card comes up in a mode where it's due (Read, Write or Listen); new words start in Read. The filter chips and dots follow the practice you pick.
- "Clear due cards · N" sits on top of Practice whenever anything is due; it runs every due card in every mode, so the badge really reaches zero.
- Flash cards: the header reads "Flash card 6/19"; the front is just Check · I know it · Show answer; the score is 對 · 半 · 錯 in green, yellow and red; the practice bar just says Practice writing.
- Tone boxes (1 ˉ 2 ˊ 3 ˇ 4 ˋ) on the right of the Pinyin box once there's a vowel; a number typed after a syllable marks it at once (xun4 → xùn). Syllables are split properly (xunxi + 2 → xunxí).
- One speed setting for every speaker: Normal, Slower and Step by step (a word a syllable at a time, a sentence a word at a time). Chosen on Listen cards, in a sentence's 字 panel or in Settings.
- Touch and hold a character in the reader to see it big, with Select just this and Open.
- Grid and Strokes on the writing pad are remembered until you change them (Write cards follow the grid, never the strokes).
- History keeps everything you open (typed or pasted, photos, PDFs, files, Wikipedia) and word lists you import, with filters; a document reopens whole, on the page you were on. It left the menu; it's next to Explore.
- Settings is a list of sections that open on tap, each with a one-line summary. Speech has two voice samples (Taiwan and Mainland). Daily target uses the right font.
- Backup is everything (words and progress, learned list and tallies, what you're reading, History, settings), with a summary before Save file. Restore is in Settings, Your words: words and History merge, settings ask first.
- Reading text keeps a still 3D finish; the moving-light switch is gone. Big characters keep their slow light, now at a gentler rate, only when on screen and never in the background (easier on the battery).
- Color lab: sliding a color changes only that color; nothing else moves.
- Pages opened from the menu have no ☰ (‹ Menu goes back to it). About shows the version and no longer repeats How it works.
- Phone on its side: a slimmer right column (characters only), and the selection bar and word strip stop at it.

## v34

- Flash cards, answering: after Check the screen scrolls so the characters, your result and the rating bar show together. While the keyboard is up the card fits above it: the characters shrink just enough to stay whole, the title and bottom bar step aside, and moving between Pinyin and Meaning doesn't scroll anything. The keyboard's return key goes Pinyin, Meaning, Check.
- Tone buttons (1 ā, 2 á, 3 ǎ, 4 à) sit on top of the keyboard in the Pinyin box: type the syllable plainly, tap the tone, and the mark lands on the right vowel. Tone numbers still work.
- A tone mark on the wrong letter counts as fully right; the note about where it goes stays as a tip.
- Clues give the sound and the meaning only, never the pinyin.
- Meaning checks: words in brackets count ("text" for 訊息, "(often a text message)"), the AI check gets longer to answer, and if it can't answer the card asks you: "was it right?" with ✓ and ✗.
- The score counts how you answered, not the button you rate with: I know it or a right check is right, a partly right check is shaky, Show answer or a wrong check is missed. The rating only decides when the card comes back.
- ✍ Write on the answer side: practice writing the word on the pad, with Show me and Write it again. Not graded; Back to card returns to your rating.
- Big characters fit up to four in a row (cards, word page, Review list), wrapping only from five. Touch and hold any big character to see it full size; tap to close.
- Card sentences have one row of controls under them: listen, 拼 Pinyin, Show English, 解, and 字 for text size and reading speed (the reader's settings). Reading a card sentence aloud no longer highlights it.
- Flash card choices are Suggested (due cards plus today's new words, with the mix, e.g. "9 due + 10 new", shown right under the choice), New and All. Active is gone from the choices and is called Learning everywhere else. With a filter on, My words has a Flash cards button for exactly those words.
- Reading text keeps a still light: the drifting spark across a page pulled the eye away (and flickered on cards). Big characters keep their slow light. Settings has a "Moving light in text" switch to bring the spark back.
- Larger type across the app (about 12%, more for small labels).
- A phone on its side: the tab bar becomes a column on the right with 部 and ☰, the reading controls sit in one row, Explore and the flash card panel use two columns, so the text gets the height.
- English inside Chinese text reads as phrases ("City and County of Denver") instead of one word per square.
- Explore: "Or open one at random".
- Color lab: the sliders move each color only a little (brightness ±20%, saturation 60 to 130%, hue ±12°), so a red stays a red.

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
