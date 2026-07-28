#!/bin/bash
# CRT retro monochrome green terminal style transformation
cd /root/newappai/.claude/worktrees/agent-a218e697f919db3c9

FILES="app/page.tsx app/solutions/page.tsx app/about/page.tsx app/contact/page.tsx app/cgv/page.tsx app/mentions-legales/page.tsx app/privacy/page.tsx app/produits/page.tsx app/produits/\[slug\]/page.tsx app/recherche/page.tsx app/qrcall/page.tsx app/success/SuccessContent.tsx app/layout.tsx"

for f in $FILES; do
  [ -f "$f" ] || continue
  echo "Processing: $f"

  # TEXT COLORS
  sed -i 's/text-white/text-#00ff41/g' "$f" 2>/dev/null || true
  sed -i 's/text-green-400/text-#00ff41/g' "$f" 2>/dev/null || true
  sed -i 's/text-green-300/text-#00ff41/g' "$f" 2>/dev/null || true
  sed -i 's/text-green-500/text-#00ff41/g' "$f" 2>/dev/null || true
  sed -i 's/text-emerald-400/text-#00ff41/g' "$f" 2>/dev/null || true
  sed -i 's/text-emerald-300/text-#00ff41/g' "$f" 2>/dev/null || true
  sed -i 's/text-emerald-500/text-#00ff41/g' "$f" 2>/dev/null || true
  sed -i 's/text-slate-400/text-#00cc33/g' "$f" 2>/dev/null || true
  sed -i 's/text-slate-300/text-#00cc33/g' "$f" 2>/dev/null || true
  sed -i 's/text-slate-200/text-#00cc33/g' "$f" 2>/dev/null || true
  sed -i 's/text-slate-100/text-#00ff41/g' "$f" 2>/dev/null || true
  sed -i 's/text-slate-50/text-#00ff41/g' "$f" 2>/dev/null || true
  sed -i 's/text-gray-100/text-#00ff41/g' "$f" 2>/dev/null || true
  sed -i 's/text-gray-200/text-#00cc33/g' "$f" 2>/dev/null || true
  sed -i 's/text-gray-300/text-#00cc33/g' "$f" 2>/dev/null || true
  sed -i 's/text-gray-400/text-#00cc33/g' "$f" 2>/dev/null || true
  sed -i 's/text-gray-500/text-#00cc33/g' "$f" 2>/dev/null || true
  sed -i 's/text-gray-600/text-#00cc33/g' "$f" 2>/dev/null || true
  sed -i 's/text-gray-700/text-#00cc33/g' "$f" 2>/dev/null || true
  sed -i 's/text-gray-800/text-#00ff41/g' "$f" 2>/dev/null || true
  sed -i 's/text-gray-900/text-#00ff41/g' "$f" 2>/dev/null || true

  # BACKGROUND
  sed -i 's/bg-green-500\/10/bg-#00ff41\/10/g' "$f" 2>/dev/null || true
  sed -i 's/bg-green-600/bg-#00ff41/g' "$f" 2>/dev/null || true
  sed -i 's/bg-green-700/bg-#00ff41/g' "$f" 2>/dev/null || true
  sed -i 's/bg-emerald-500\/10/bg-#00ff41\/10/g' "$f" 2>/dev/null || true
  sed -i 's/bg-emerald-600/bg-#00ff41/g' "$f" 2>/dev/null || true
  sed -i 's/bg-slate-900/bg-black/g' "$f" 2>/dev/null || true
  sed -i 's/bg-slate-950/bg-black/g' "$f" 2>/dev/null || true
  sed -i 's/bg-gray-900/bg-black/g' "$f" 2>/dev/null || true
  sed -i 's/bg-gray-950/bg-black/g' "$f" 2>/dev/null || true
  sed -i 's/bg-white\/5/bg-black/g' "$f" 2>/dev/null || true
  sed -i 's/bg-white\/10/bg-black/g' "$f" 2>/dev/null || true
  sed -i 's/bg-white\/20/bg-black/g' "$f" 2>/dev/null || true

  # BORDER
  sed -i 's/border-green-500\/20/border-#00ff41\/20/g' "$f" 2>/dev/null || true
  sed -i 's/border-green-500\/30/border-#00ff41\/30/g' "$f" 2>/dev/null || true
  sed -i 's/border-green-400\/50/border-#00ff41\/50/g' "$f" 2>/dev/null || true
  sed -i 's/border-green-400\/20/border-#00ff41\/20/g' "$f" 2>/dev/null || true
  sed -i 's/border-green-400/border-#00ff41/g' "$f" 2>/dev/null || true
  sed -i 's/border-emerald-500\/20/border-#00ff41\/20/g' "$f" 2>/dev/null || true
  sed -i 's/border-white\/10/border-#00ff41\/20/g' "$f" 2>/dev/null || true
  sed -i 's/border-white\/20/border-#00ff41\/30/g' "$f" 2>/dev/null || true
  sed -i 's/border-white\/5/border-#00ff41\/10/g' "$f" 2>/dev/null || true
  sed -i 's/border-gray-700\/50/border-#00ff41\/20/g' "$f" 2>/dev/null || true
  sed -i 's/border-gray-800\/50/border-#00ff41\/20/g' "$f" 2>/dev/null || true
  sed -i 's/border-gray-800/border-#00ff41\/20/g' "$f" 2>/dev/null || true

  # RING
  sed -i 's/focus:ring-green-500/focus:ring-#00ff41/g' "$f" 2>/dev/null || true
  sed -i 's/focus:ring-green-400/focus:ring-#00ff41/g' "$f" 2>/dev/null || true
  sed -i 's/focus:ring-emerald-500/focus:ring-#00ff41/g' "$f" 2>/dev/null || true
  sed -i 's/focus:border-green-500/focus:border-#00ff41/g' "$f" 2>/dev/null || true

  # HOVER
  sed -i 's/hover:bg-green-500/hover:bg-#66ff66/g' "$f" 2>/dev/null || true
  sed -i 's/hover:bg-green-600/hover:bg-#66ff66/g' "$f" 2>/dev/null || true
  sed -i 's/hover:bg-green-700/hover:bg-#66ff66/g' "$f" 2>/dev/null || true
  sed -i 's/hover:bg-emerald-600/hover:bg-#66ff66/g' "$f" 2>/dev/null || true
  sed -i 's/hover:bg-emerald-700/hover:bg-#66ff66/g' "$f" 2>/dev/null || true
  sed -i 's/hover:text-green-300/hover:text-#66ff66/g' "$f" 2>/dev/null || true
  sed -i 's/hover:text-green-400/hover:text-#66ff66/g' "$f" 2>/dev/null || true
  sed -i 's/hover:border-green-500\/30/hover:border-#00ff41\/30/g' "$f" 2>/dev/null || true
  sed -i 's/hover:border-green-400/hover:border-#66ff66/g' "$f" 2>/dev/null || true

  # GRADIENTS
  sed -i 's/from-green-600 to-green-500/from-#00ff41 to-#66ff66/g' "$f" 2>/dev/null || true
  sed -i 's/from-green-500 to-green-400/from-#00ff41 to-#66ff66/g' "$f" 2>/dev/null || true
  sed -i 's/from-green-400 to-green-500/from-#00ff41 to-#66ff66/g' "$f" 2>/dev/null || true
  sed -i 's/from-green-500\/10 to-transparent/from-#00ff41\/10 to-transparent/g' "$f" 2>/dev/null || true
  sed -i 's/from-slate-950 via-slate-950\/80 to-slate-950/from-black via-black to-black/g' "$f" 2>/dev/null || true

  # SHADOWS
  sed -i 's/shadow-green-500\/25/shadow-#00ff41\/25/g' "$f" 2>/dev/null || true
  sed -i 's/shadow-green-600\/25/shadow-#00ff41\/25/g' "$f" 2>/dev/null || true
  sed -i 's/shadow-emerald-500\/25/shadow-#00ff41\/25/g' "$f" 2>/dev/null || true

  # INLINE RGBA
  sed -i 's/rgba(34, 197, 94, /rgba(0, 255, 65, /g' "$f" 2>/dev/null || true
  sed -i 's/rgba(16, 185, 129, /rgba(0, 255, 65, /g' "$f" 2>/dev/null || true
  sed -i 's/rgba(52, 211, 153, /rgba(0, 255, 65, /g' "$f" 2>/dev/null || true
  sed -i 's/rgba(22, 163, 74, /rgba(0, 255, 65, /g' "$f" 2>/dev/null || true

  # CARET / PLACEHOLDER / DIVIDE
  sed -i 's/placeholder-gray-400/placeholder-#00cc33/g' "$f" 2>/dev/null || true
  sed -i 's/placeholder-gray-500/placeholder-#00cc33/g' "$f" 2>/dev/null || true
  sed -i 's/divide-gray-700\/50/divide-#00ff41\/20/g' "$f" 2>/dev/null || true
  sed -i 's/caret-green-500/caret-#00ff41/g' "$f" 2>/dev/null || true
  sed -i 's/accent-green-500/accent-#00ff41/g' "$f" 2>/dev/null || true
done

# Homepage specific
sed -i 's/#10b981/#00ff41/g' app/page.tsx 2>/dev/null || true
sed -i 's/#16a34a/#00ff41/g' app/page.tsx 2>/dev/null || true
sed -i 's/#059669/#00cc33/g' app/page.tsx 2>/dev/null || true

echo "Main pages transformation complete!"
