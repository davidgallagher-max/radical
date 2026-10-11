#!/usr/bin/env bash
# Vercel runs this on every deploy: build the data, then gather the site into public/.
set -e
bash scripts/get_data.sh
rm -rf public
mkdir -p public
cp index.html manifest.webmanifest public/
cp -r icons data public/
cp CREDITS.md public/
cp -r licenses public/
echo "Site ready in public/"
