#!/bin/bash
# import-social.sh <jobDir> <url>
# Importe les photos + textes PUBLICS d'un profil ou post social (Instagram /
# TikTok / Facebook / Pinterest) vers <jobDir>/import/ pour alimenter la
# mission de génération (skill social-content-import). Jamais de login forcé.
set -u

JOB_DIR="$1"
URL="$2"
YTDLP=/home/newappai/.local/bin/yt-dlp
OUT="$JOB_DIR/import"
mkdir -p "$OUT/photos"
TXT="$OUT/textes.md"
: > "$TXT"

PLATFORM=""
case "$URL" in
  *instagram.com*|*instagr.am*) PLATFORM=instagram ;;
  *tiktok.com*|*vm.tiktok.com*) PLATFORM=tiktok ;;
  *facebook.com*|*fb.watch*|*fb.com*) PLATFORM=facebook ;;
  *pinterest.*|*pin.it*) PLATFORM=pinterest ;;
esac
if [ -z "$PLATFORM" ]; then
  echo "ERREUR: plateforme non reconnue (attendu: instagram/tiktok/facebook/pinterest)"
  exit 2
fi

# Bio Instagram quand c'est un PROFIL (instagram:user casse dans yt-dlp) -> meta tags
if [ "$PLATFORM" = "instagram" ] && echo "$URL" | grep -qE "instagram\.com/[A-Za-z0-9_.]+/?$"; then
  BIO=$(curl -sL -m 20 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "$URL" \
    | grep -oE '<meta property="og:description" content="[^"]*"' | head -1 \
    | sed 's/.*content="//;s/"$//')
  if [ -n "$BIO" ]; then
    echo "## Bio (page publique du profil)" >> "$TXT"
    echo "$BIO" >> "$TXT"
    echo "" >> "$TXT"
  fi
fi

# Telechargement limite (public uniquement, rate-limit respecte)
LIMIT=12
case "$PLATFORM" in
  tiktok)    $YTDLP -q -o "$OUT/photos/%(id)s.%(ext)s" --write-info-json --write-description --limit $LIMIT --sleep-requests 2 "$URL" 2>>"$OUT/import.log" ;;
  instagram) $YTDLP -q -o "$OUT/photos/%(id)s.%(ext)s" --write-info-json --write-description --limit $LIMIT "$URL" 2>>"$OUT/import.log" ;;
  facebook|pinterest) $YTDLP -q -o "$OUT/photos/%(id)s.%(ext)s" --write-info-json --write-description --limit $LIMIT "$URL" 2>>"$OUT/import.log" ;;
esac

# Textes reels (bio + captions) depuis les .info.json de chaque post
for f in "$OUT"/photos/*.info.json; do
  [ -f "$f" ] || continue
  TITLE=$(python3 -c "import json,sys
try:
    d=json.load(open('$f'))
    print((d.get('title') or d.get('description') or '').strip())
except Exception:
    pass" 2>/dev/null)
  if [ -n "$TITLE" ]; then
    echo "- $(basename "$f" .info.json): $TITLE" >> "$TXT"
  fi
done

# Videos -> frames photos (galerie)
for v in "$OUT"/photos/*.mp4; do
  [ -f "$v" ] || continue
  ffmpeg -y -loglevel error -ss 1 -i "$v" -frames:v 1 "${v%.mp4}.jpg" 2>/dev/null
done

NPH=$(ls "$OUT"/photos/ 2>/dev/null | grep -cE '\.(jpg|jpeg|png|webp)$' || true)
NTX=$(grep -c "^- " "$TXT" 2>/dev/null || true)
echo "OK platform=$PLATFORM photos=$NPH textes=$NTX"
exit 0
