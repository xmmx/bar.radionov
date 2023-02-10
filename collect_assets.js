#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const assets = [
  "./",
  "./index.html"
]

const folders = ['styles', 'js', 'img']
folders.forEach(folder => {
  fs.readdirSync(path.join('./', 'docs', folder)).forEach(file => {
    if (file != '.DS_Store')
      assets.push(`./${folder}/${file}`);
  });
})

const filename = path.join('./', 'docs', 'worker.js');
const workerContent = fs.readFileSync(filename);
const newContent = `const assets = ${JSON.stringify(assets)}\n${workerContent}`;
fs.writeFileSync(filename, newContent);