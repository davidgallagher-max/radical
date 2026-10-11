#!/usr/bin/env bash
# Downloads the source data and builds what the page reads.
# Run from the project folder:  bash scripts/get_data.sh
set -e
mkdir -p data
[ -n "$SKIP_FETCH" ] || python3 scripts/fetch_data.py
echo "Building character files..."
python3 scripts/build_data.py raw data 64
echo "Building word files..."
python3 scripts/build_words.py raw/cedict.txt data 64
echo "Done. Start the page with:  python3 -m http.server 8000"
