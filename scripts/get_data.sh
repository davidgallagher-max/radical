#!/usr/bin/env bash
# Downloads the source data and builds what the page reads.
# Run from the project folder:  bash scripts/get_data.sh
set -e
mkdir -p raw data
echo "Downloading Make Me a Hanzi (about 33 MB)..."
curl -L -o raw/dictionary.txt https://raw.githubusercontent.com/skishore/makemeahanzi/master/dictionary.txt
curl -L -o raw/graphics.txt https://raw.githubusercontent.com/skishore/makemeahanzi/master/graphics.txt
echo "Downloading CC-CEDICT word dictionary (about 4 MB)..."
curl -L -o raw/cedict.txt.gz https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz
gunzip -f raw/cedict.txt.gz
echo "Building character files..."
python3 scripts/build_data.py raw data 64
echo "Building word files..."
python3 scripts/build_words.py raw/cedict.txt data 64
echo "Done. Start the page with:  python3 -m http.server 8000"
