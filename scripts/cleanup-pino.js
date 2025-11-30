#!/usr/bin/env node
// Remove test files from pino packages to avoid Next.js build issues
const fs = require('fs');
const path = require('path');

const dirsToRemove = [
  'node_modules/thread-stream/test',
  'node_modules/pino/test',
];

const filesToRemove = [
  'node_modules/thread-stream/LICENSE',
  'node_modules/thread-stream/README.md',
  'node_modules/thread-stream/bench.js',
  'node_modules/pino/LICENSE',
  'node_modules/pino/README.md',
];

dirsToRemove.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log(`Removing ${dir}...`);
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
});

filesToRemove.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    console.log(`Removing ${file}...`);
    fs.rmSync(fullPath, { force: true });
  }
});

console.log('Cleaned up pino test files.');
