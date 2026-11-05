# Credits

Radical's character data is built from **Make Me a Hanzi** by Shaunak Kishore:
https://github.com/skishore/makemeahanzi

- Stroke drawings (`graphics.txt`) are derived from the Arphic PL KaitiM GB and Arphic PL UKai fonts by Arphic Technology Co., Ltd., under the Arphic Public License (`licenses/ARPHIC-PUBLIC-LICENSE.txt`).
- Character meanings, readings, and component data (`dictionary.txt`) are derived from Unihan and CJKlib, under the GNU Lesser General Public License v3 (`licenses/LGPL-3.0.txt`).

## Changes made to the data

`scripts/build_data.py` reformats both files into per-character JSON shards, labels each stroke as a meaning, sound, or idea part based on the source's own etymology data, adds a rating of how closely each sound part matches the character's pronunciation, and applies a small set of documented corrections (listed in `OVERRIDES` in that script). The original files are unchanged.

Word segmentation, word pinyin, and word meanings come from **CC-CEDICT** (https://cc-cedict.org), licensed CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). `scripts/build_words.py` reformats it into per-character JSON shards, converts tone numbers to tone marks, and keeps the first three senses of each entry.

Traditional and Simplified conversion uses **OpenCC** via opencc-js: https://github.com/nk2028/opencc-js

Writing practice uses **Hanzi Writer** by David Chanin (MIT license): https://github.com/chanind/hanzi-writer

The Clear color palette is based on the Okabe-Ito colorblind-safe palette.

- **pdf.js** (Mozilla, Apache License 2.0): reads PDFs in the browser, loaded from cdnjs.
- **Wikipedia** (Chinese): articles are shown with a link to the source, under CC BY-SA 4.0.

The most common characters sets (`lists/common.tsv`) are ranked from **wordfreq** by Robyn Speer (https://github.com/rspeer/wordfreq), whose Chinese data combines SUBTLEX-CH (Cai and Brysbaert), OpenSubtitles, Wikipedia and other sources, licensed CC BY-SA 4.0. `scripts/build_common.py` sums word frequencies into character frequencies, keeps the 2,000 most common characters with stroke data, and pairs each with its most common 2 or 3 character CC-CEDICT word. The list is shared under CC BY-SA 4.0.

The Top word lists (`lists/topwords.txt`, since v42) are the 2,000 most common words in `lists/zhfreq.txt` (below) whose characters have stroke data, built by `scripts/build_topwords.py`, shared under CC BY-SA 4.0.

The level decks come from two lists, rebuilt by hand with `scripts/build_levels.py` (words written all in Chinese characters, each once at its lowest level, most common first):
- `lists/hsk.txt`: the new HSK (3.0, 2021) levels 1 to 6 and 7-9, from **Complete HSK Vocabulary** by Yanis Zafirópulos (https://github.com/drkameleon/complete-hsk-vocabulary), MIT License.
- `lists/tocfl.txt`: levels 1 to 7 of the **臺灣華語文能力基準詞語表** (Taiwan Chinese Language Proficiency Benchmark Vocabulary List, 2022-11-14) published by Taiwan's National Academy for Educational Research (https://coct.naer.edu.tw), via the JSON copy at https://github.com/PSeitz/tocfl.

The English index (typing an English word to add or read) is built from CC-CEDICT by `scripts/build_english.py`, ordered by how common each Chinese word is in `lists/zhfreq.txt`: the 40,000 most common words in wordfreq's Chinese data (same sources and license as above) that are in CC-CEDICT, shared under CC BY-SA 4.0.
