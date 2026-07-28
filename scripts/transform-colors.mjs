#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const REP = [
  ['text-white', 'text-[#00ff41]'],
  ['text-green-400', 'text-[#00ff41]'],
  ['text-green-300', 'text-[#00ff41]'],
  ['text-green-500', 'text-[#00ff41]'],
  ['text-emerald-400', 'text-[#00ff41]'],
  ['text-slate-400', 'text-[#00cc33]'],
  ['text-slate-300', 'text-[#00cc33]'],
  ['text-gray-900', 'text-[#00ff41]'],
  ['text-gray-700', 'text-[#00cc33]'],
  ['text-gray-600', 'text-[#00cc33]'],
  ['text-gray-400', 'text-[#00cc33]'],
  ['bg-green-600', 'bg-[#00ff41]'],
  ['bg-green-500/20', 'bg-[#00ff41]/20'],
  ['bg-green-500/10', 'bg-[#00ff41]/10'],
  ['bg-green-900/40', 'bg-[#00ff41]/10'],
  ['bg-emerald-600', 'bg-[#00ff41]'],
  ['bg-emerald-500/10', 'bg-[#00ff41]/10'],
  ['bg-slate-950', 'bg-black'],
  ['bg-white/5', 'bg-black'],
  ['bg-white/10', 'bg-black'],
  ['bg-white/20', 'bg-black'],
  ['bg-white/80', 'bg-black'],
  ['border-green-500/30', 'border-[#00ff41]/30'],
  ['border-green-500/20', 'border-[#00ff41]/20'],
  ['border-green-400', 'border-[#00ff41]'],
  ['border-emerald-500/20', 'border-[#00ff41]/20'],
  ['border-emerald-400', 'border-[#00ff41]'],
  ['border-white/10', 'border-[#00ff41]/20'],
  ['border-white/20', 'border-[#00ff41]/30'],
  ['shadow-green-600/25', 'shadow-[#00ff41]/25'],
  ['shadow-green-400/20', 'shadow-[#00ff41]/20'],
  ['ring-green-400/20', 'ring-[#00ff41]/20'],
  ['focus:ring-green-500', 'focus:ring-[#00ff41]'],
  ['focus:ring-emerald-500', 'focus:ring-[#00ff41]'],
  ['focus:border-green-500', 'focus:border-[#00ff41]'],
  ['focus:border-green-400', 'focus:border-[#00ff41]'],
  ['hover:bg-green-700', 'hover:bg-[#66ff66]'],
  ['hover:bg-green-600', 'hover:bg-[#66ff66]'],
  ['hover:bg-green-500', 'hover:bg-[#66ff66]'],
  ['hover:bg-green-900/30', 'hover:bg-[#00ff41]/20'],
  ['hover:bg-white/10', 'hover:bg-[#00ff41]/10'],
  ['hover:text-green-400', 'hover:text-[#66ff66]'],
  ['hover:text-white', 'hover:text-[#66ff66]'],
  ['hover:border-green-400', 'hover:border-[#66ff66]'],
  ['from-green-600 to-green-500', 'from-[#00ff41] to-[#66ff66]'],
  ['from-green-400 to-green-500', 'from-[#00ff41] to-[#66ff66]'],
  ['from-green-500/10 to-transparent', 'from-[#00ff41]/10 to-transparent'],
  ['bg-gradient-to-br from-green-600 to-green-500', 'bg-[#00ff41]'],
  ['from-slate-950 via-slate-950/80 to-slate-950', 'from-black via-black to-black'],
  ['bg-green-500/10 blur-3xl', 'bg-[#00ff41]/10 blur-3xl'],
  ['bg-emerald-500/10', 'bg-[#00ff41]/10'],
  ['shadow-emerald-400/20', 'shadow-[#00ff41]/20'],
  ['text-emerald-400', 'text-[#00ff41]'],
  ['border-emerald-500/30', 'border-[#00ff41]/30'],
];

const HEX = [
  ['rgba(34, 197, 94, ', 'rgba(0, 255, 65, '],
  ['rgba(16, 185, 129, ', 'rgba(0, 255, 65, '],
  ['rgba(52, 211, 153, ', 'rgba(0, 255, 65, '],
  ['rgba(22, 163, 74, ', 'rgba(0, 255, 65, '],
  ['#10b981', '#00ff41'],
  ['#16a34a', '#00ff41'],
  ['#059669', '#00cc33'],
];

const ALL = [...REP, ...HEX];

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
  for (const [from, to] of ALL) {
    mod = mod.replaceAll(from, to);
  }
  if (orig !== mod) {
    fs.writeFileSync(f, mod, 'utf8');
    console.log('CHANGED:', path.relative(root, f));
    changed++;
  }
}
console.log(changed + ' files changed');
