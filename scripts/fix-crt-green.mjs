#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Replace ALL #00ff41 with #33ff33, #66ff66 with #66ff66 (keep), #00cc33 with #33ff33
const REP = [
  // Primary green: was #00ff41 (too blue/cyan), now #33ff33 (true CRT P1 green)
  ['#00ff41', '#33ff33'],
  // Keep #66ff66 as lighter accent
  // Dark green: was #00cc33, now same as primary
  ['#00cc33', '#33ff33'],
  // Fix button text: green bg buttons MUST have black text
  // Replace green text on known green backgrounds
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
  ...walkDir(path.join(root, 'app'), ['.css']),
].filter(f => !f.includes('/components/admin/'));

// Step 1: Replace all hex color references
let changed1 = 0;
for (const f of targets) {
  const orig = fs.readFileSync(f, 'utf8');
  let mod = orig;
  for (const [from, to] of REP) {
    mod = mod.replaceAll(from, to);
  }
  if (orig !== mod) {
    fs.writeFileSync(f, mod, 'utf8');
    changed1++;
  }
}
console.log('Hex colors updated in', changed1, 'files');

// Step 2: Find all green-on-green issues and fix them
// Pattern: bg-[#33ff33]* followed later (or on same element) by text-[#33ff33]
// We need to make text black on solid green backgrounds
const TARGETS2 = [
  ...walkDir(path.join(root, 'app'), ['.tsx', '.ts', '.jsx']),
  ...walkDir(path.join(root, 'components'), ['.tsx', '.ts', '.jsx']),
].filter(f => !f.includes('/components/admin/'));

// For each file, find lines with both bg- and text- in same className with the green color
let fixed2 = 0;
for (const f of TARGETS2) {
  const orig = fs.readFileSync(f, 'utf8');
  let mod = orig;
  
  // Fix: bg-[#33ff33] with text-[#33ff33] => text-black
  mod = mod.replaceAll('bg-[#33ff33] text-[#33ff33]', 'bg-[#33ff33] text-black');
  // Also catch patterns like: bg-[#33ff33] ...more classes... text-[#33ff33]
  // Using regex: match className strings with both bg-[#33ff33] and text-[#33ff33]
  mod = mod.replace(/(bg-\[#33ff33\][^"]*?)text-\[#33ff33\]/g, '$1text-black');
  // Fix gradient backgrounds with green text
  mod = mod.replace(/(from-\[#33ff33\][^"]*?)text-\[#33ff33\]/g, '$1text-black');
  mod = mod.replace(/(to-\[#33ff33\][^"]*?)text-\[#33ff33\]/g, '$1text-black');
  // Fix remaining green-500/emerald combinations with green text
  mod = mod.replace(/(from-green-500[^"]*?)text-\[#33ff33\]/g, '$1text-black');
  mod = mod.replace(/(from-green-400[^"]*?)text-\[#33ff33\]/g, '$1text-black');
  // Fix shadow-green with green-500
  mod = mod.replace(/shadow-green-500\/25/g, 'shadow-[#33ff33]/25');
  mod = mod.replace(/shadow-green-600\/20/g, 'shadow-[#33ff33]/20');
  // Fix green-500/10 to transparent gradients
  mod = mod.replace(/from-green-500\/10 to-transparent/g, 'from-[#33ff33]/10 to-transparent');
  // Fix green-500/10 blur-3xl
  mod = mod.replace(/bg-green-500\/10 blur-3xl/g, 'bg-[#33ff33]/10 blur-3xl');
  // Fix emerald references
  mod = mod.replace(/bg-emerald-500\/10/g, 'bg-[#33ff33]/10');
  mod = mod.replace(/text-emerald-400/g, 'text-[#33ff33]');
  mod = mod.replace(/border-emerald-500\/30/g, 'border-[#33ff33]/30');
  mod = mod.replace(/border-emerald-400/g, 'border-[#33ff33]');
  // Fix from-green-500 to-emerald-600
  mod = mod.replace(/from-green-500 to-emerald-600/g, 'from-[#33ff33] to-[#33ff33]');
  // Fix scale-transform patterns
  mod = mod.replace(/hover:scale-105/g, 'hover:scale-105');
  
  if (orig !== mod) {
    fs.writeFileSync(f, mod, 'utf8');
    fixed2++;
    console.log('FIXED:', path.relative(root, f));
  }
}
console.log(fixed2, 'files checked for green-on-green');

// Step 3: Also fix globals.css
const cssPath = path.join(root, 'app', 'globals.css');
if (fs.existsSync(cssPath)) {
  let css = fs.readFileSync(cssPath, 'utf8');
  const oldCss = css;
  css = css.replaceAll('#00ff41', '#33ff33');
  css = css.replaceAll('#22c55e', '#33ff33');
  css = css.replaceAll('#16a34a', '#33ff33');
  css = css.replaceAll('rgba(34, 197, 94', 'rgba(51, 255, 51');
  css = css.replaceAll('rgba(0, 255, 65', 'rgba(51, 255, 51');
  // Fix neon-text and neon-border
  css = css.replace(/rgba\(34, 197, 94/g, 'rgba(51, 255, 51');
  if (css !== oldCss) {
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('FIXED: app/globals.css');
  }
}

// Step 4: Count remaining green-on-green issues
let remaining = 0;
for (const f of TARGETS2) {
  const content = fs.readFileSync(f, 'utf8');
  // Check for bg with green on same line as text with green
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('bg-[#33ff33]') && lines[i].includes('text-[#33ff33]') && !lines[i].includes('text-black')) {
      console.log('REMAINING LINE', path.relative(root, f) + ':' + (i+1), lines[i].trim().slice(0,80));
      remaining++;
    }
  }
}
console.log(remaining, 'green-on-green issues remaining');
