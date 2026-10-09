#!/usr/bin/env bash
# Downloads the Make Me a Hanzi source files and builds the character data the page reads.
# Run from the project folder:  bash scripts/get_data.sh
set -e
mkdir -p raw data
echo "Downloading Make Me a Hanzi (about 33 MB)..."
curl -L -o raw/dictionary.txt https://raw.githubusercontent.com/skishore/makemeahanzi/master/dictionary.txt
curl -L -o raw/graphics.txt https://raw.githubusercontent.com/skishore/makemeahanzi/master/graphics.txt
echo "Building character files..."
python3 scripts/build_data.py raw data 64
echo "Done. Start the page with:  python3 -m http.server 8000"
