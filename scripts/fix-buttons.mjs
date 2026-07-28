#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const REP = [
  // Fix button text: green bg buttons need BLACK text
  ['bg-[#00ff41] text-[#00ff41]', 'bg-[#00ff41] text-black'],
  ['bg-[#00ff41] text-[#00ff41] hover:', 'bg-[#00ff41] text-black hover:'],
  // Fix hover states on green buttons
  ['hover:bg-[#66ff66]', 'hover:bg-[#33ff33]'],
  // Drop shadow green references - keep but update to pure green
  ['shadow-[#00ff41]/25', 'shadow-[#00ff41]/30'],
  ['shadow-[#00ff41]/20', 'shadow-[#00ff41]/25'],
  // Keep border references - they're fine
];

function walkDir(dir, exts) {
  const files = [];
  try {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const fp = path.join(dir, e.name);
      if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules' && e.name !== 'admin')
        files.push(...walkDir(fp, exts));
      else if (e.isFile() && exts.includes(path.extname(e.name)))
        files.push(fp);
    }
  } catch (e) {}
  return files;
}

const targets = [
  ...walkDir(path.join(root, 'app'), ['.tsx', '.ts', '.jsx']),
  ...walkDir(path.join(root, 'components'), ['.tsx', '.ts', '.jsx']),
].filter(f => !f.includes('/components/admin/'));

let changed = 0;
for (const f of targets) {
  const orig = fs.readFileSync(f, 'utf8');
  let mod = orig;
  for (const [from, to] of REP) {
    mod = mod.replaceAll(from, to);
  }
  if (orig !== mod) {
    fs.writeFileSync(f, mod, 'utf8');
    console.log('FIXED:', path.relative(root, f));
    changed++;
  }
}
// Also fix standalone text-[#00ff41] that should be on non-button elements
// Scan for remaining green-on-green issues
let remaining = 0;
for (const f of targets) {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/bg-\[#00ff41\][^"]*text-\[#00ff41\]/g);
  if (matches) {
    console.log('STILL BROKEN:', path.relative(root, f), matches.length, 'occurrences');
    remaining += matches.length;
  }
}
console.log(changed + ' files fixed, ' + remaining + ' green-on-green remaining');
