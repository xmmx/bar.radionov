#!/usr/bin/env bash
echo "Remove old build..."
rm -rf docs

echo "Copy files..."
cp -r src docs
cd docs
unlink test.html
unlink index-source.html
unlink js/main.js
rm -rf styles
cd ../

echo "Minify css..."
npx css-minify -d src/styles/ -o docs/styles

echo "Minify js..."
npx minify src/js/main.js > docs/js/main.min.js

echo "Collect assets for PWA..."
./collect_assets.js