#!/usr/bin/env bash
# Builds the iPhone app's web folder (app/www) from the site, then copies it into the Xcode project.
# Run from anywhere:  bash scripts/build_app.sh   (needs node; data is built first if it isn't there)
set -e
cd "$(dirname "$0")/.."
[ -d data ] || bash scripts/get_data.sh
VERSION=$(grep -o 'const APP_VERSION = "v[0-9]*"' index.html | grep -o 'v[0-9]*')
rm -rf app/www && mkdir -p app/www/vendor
cp index.html manifest.webmanifest CREDITS.md app/www/
cp -r icons data lists licenses app/www/
cp app/node_modules/opencc-js/dist/umd/full.js app/www/vendor/full.js
cp app/node_modules/hanzi-writer/dist/hanzi-writer.min.js app/www/vendor/hanzi-writer.min.js
# The libraries load from the app, not the internet; the boot script learns which version is inside.
sed -i.bak -E \
  -e 's#https://cdn\.jsdelivr\.net/npm/opencc-js@[^"]*/full\.js#vendor/full.js#' \
  -e 's#https://cdn\.jsdelivr\.net/npm/hanzi-writer@[^"]*/hanzi-writer\.min\.js#vendor/hanzi-writer.min.js#' \
  -e "s#/\*BUNDLED\*/\"\"#/*BUNDLED*/\"$VERSION\"#" app/www/index.html
rm app/www/index.html.bak
grep -q "vendor/full.js" app/www/index.html && grep -q "/\*BUNDLED\*/\"$VERSION\"" app/www/index.html || { echo "index.html rewrite failed"; exit 1; }
cd app && npx cap sync ios
echo "app/www ready ($VERSION) and copied into ios/"
