#!/usr/bin/env bash
echo "Remove old build..."
rm -rf static

echo "Copy files..."
cp -r src static
cd static
unlink test.html
unlink index-source.html
unlink js/main.js
rm -rf styles
cd ../

echo "Minify css..."
npx css-minify -d src/styles/ -o static/styles

echo "Minify js..."
#npx minify src/js/main.js > static/js/main.min.js
cp src/js/main.js static/js/main.min.js

echo "Collect assets for PWA..."
./collect_assets.js