#!/usr/bin/env bash
echo "Remove old build..."
rm -rf public

echo "Copy files..."
cp -r src public
cd public
unlink test.html
unlink index-source.html
unlink js/main.js
rm -rf styles
cd ../

echo "Minify css..."
npx css-minify -d src/styles/ -o public/styles

echo "Minify js..."
npx minify src/js/main.js > public/js/main.min.js

echo "Collect assets for PWA..."
./collect_assets.js