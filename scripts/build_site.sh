#!/usr/bin/env bash
# Vercel runs this on every deploy: build the data, then gather the site into public/.
set -e
bash scripts/get_data.sh
rm -rf public
mkdir -p public
cp index.html manifest.webmanifest public/
cp -r icons data lists public/
cp CREDITS.md public/
cp -r licenses public/
# Upslope Labs company page, served on upslopelabs.com (see rewrites in vercel.json)
cp -r upslope public/
echo "Site ready in public/"
