#!/bin/bash
# import-social.sh <jobDir> <url>
# Importe les photos + textes PUBLICS d'un profil/post social (Instagram /
# TikTok / Facebook / Pinterest) vers <jobDir>/import/ pour alimenter la
# mission de generation.
#
# Instagram (verifie 2026-08-15, durci 2026-08-15) :
#  - PROFIL et POST utilisent le MEME chemin : endpoint graphql
#    web_profile_info (SANS login, header x-ig-app-id) -> 12 posts recents
#    du compte (photos display_url + captions) + bio. Pour un lien de post,
#    on resout d'abord le username (depuis l'URL, sinon depuis la page du
#    post) puis on importe les 12 posts recents de ce compte : plus robuste
#    que og:image (intermittent, absent 8/8 lors des tests) et plus utile
#    pour un site (galerie complete plutot qu'une seule photo).
#    yt-dlp instagram:user est CASSÉ ; posts /p/ aussi (CSRF) -> NE PAS
#    utiliser yt-dlp pour Instagram.
# TikTok : yt-dlp metadonnees OK (bio + captions) ; VIDEO bloquee (impersonation
#          absente) -> frame jpg via ffmpeg si video telechargee.
set -u
JOB_DIR="$1"
URL="$2"
YTDLP=/home/newappai/.local/bin/yt-dlp
OUT="$JOB_DIR/import"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
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
[ -z "$PLATFORM" ] && { echo "ERREUR: plateforme non reconnue"; exit 2; }

if [ "$PLATFORM" = "instagram" ]; then
  if printf '%s' "$URL" | grep -qE 'instagram\.com/(p|reel|tv)/'; then
    # ── Post individuel : username dans l'URL (instagram.com/<user>/p/<code>/) ──
    USERNAME=$(printf '%s' "$URL" | grep -oE 'instagram\.com/[^/]+/(p|reel|tv)/' | sed -E 's#instagram\.com/##; s#/(p|reel|tv)/##')
    if [ -z "$USERNAME" ]; then
      # URL courte sans username (instagram.com/p/<code>/) : le lire depuis la page publique
      PAGE=$(curl -sL -m 25 -A "$UA" "$URL")
      USERNAME=$(printf '%s' "$PAGE" | grep -oE '"owner":\{"username":"[^"]*"' | head -1 | sed -E 's/.*"username":"//; s/"$//')
      [ -z "$USERNAME" ] && USERNAME=$(printf '%s' "$PAGE" | grep -oE '<meta property="og:title" content="[^"]*\(@[^)]*\)' | head -1 | sed -E 's/.*\(@//; s/\)$//')
    fi
  else
    # ── Profil : instagram.com/<user>/ ──
    USERNAME=$(printf '%s' "$URL" | sed -E 's#.*instagram\.com/##; s#/.*##; s/\?.*//' | tr -d '@')
  fi
  [ -z "$USERNAME" ] && { echo "ERREUR: username instagram introuvable dans $URL"; exit 3; }

  # ── graphql web_profile_info (12 posts recents du compte) ──
  GQL=$(mktemp /tmp/ig-gql-XXXXXX.json)
  curl -s -m 25 -A "$UA" -H "x-ig-app-id: 936619743392459" \
    "https://www.instagram.com/api/v1/users/web_profile_info/?username=$USERNAME" -o "$GQL"
  IG_GQL="$GQL" IG_OUT="$OUT" python3 - "$TXT" <<'PYEOF'
import json, sys, urllib.request, time, os
gql = os.environ['IG_GQL']
out = os.environ['IG_OUT']
txt = sys.argv[1]
try:
    d = json.load(open(gql))
except Exception:
    sys.exit(0)
u = d.get('data', {}).get('user', {})
if not u:
    sys.exit(0)
ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36'
lines = []
bio = (u.get('biography') or '').strip()
if bio:
    lines.append('## Bio')
    lines.append(bio)
    lines.append('')
media = u.get('edge_owner_to_timeline_media', {}).get('edges', [])
n = 0
for e in media:
    node = e.get('node', {})
    sc = node.get('shortcode', '')
    url = node.get('display_url', '')
    cap = ''
    cap_edges = node.get('edge_media_to_caption', {}).get('edges') or []
    if cap_edges:
        cap = (cap_edges[0].get('node', {}).get('text') or '').strip()
    if url and sc:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': ua})
            with urllib.request.urlopen(req, timeout=40) as r:
                data = r.read()
            if len(data) > 5000:
                open(os.path.join(out, 'photos', sc + '.jpg'), 'wb').write(data)
                n += 1
        except Exception:
            pass
    if cap:
        lines.append('- %s : %s' % (sc, cap.replace(chr(10), ' ')))
    time.sleep(0.4)
open(txt, 'w').write('\n'.join(lines) + '\n')
print('graphql OK photos=%d textes=%d' % (n, len([l for l in lines if l.startswith('- ')])))
PYEOF
else
  # ── TikTok / Facebook / Pinterest : yt-dlp (metadonnees + medias) ──
  case "$PLATFORM" in
    tiktok) $YTDLP -q -o "$OUT/photos/%(id)s.%(ext)s" --write-info-json --write-description --limit 12 --sleep-requests 2 "$URL" 2>>"$OUT/import.log" ;;
    *) $YTDLP -q -o "$OUT/photos/%(id)s.%(ext)s" --write-info-json --write-description --limit 12 "$URL" 2>>"$OUT/import.log" ;;
  esac
fi

# textes depuis .info.json (yt-dlp) si presents
for f in "$OUT"/photos/*.info.json; do
  [ -f "$f" ] || continue
  TITLE=$(python3 -c "import json,sys; d=json.load(open('$f')); print(d.get('title') or d.get('description') or '')" 2>/dev/null)
  [ -n "$TITLE" ] && echo "- $(basename "$f" .info.json): $TITLE" >> "$TXT"
done

# frames video -> photo (galerie)
for v in "$OUT"/photos/*.mp4; do
  [ -f "$v" ] || continue
  ffmpeg -y -loglevel error -ss 1 -i "$v" -frames:v 1 "${v%.mp4}.jpg" 2>/dev/null
done

NPH=$(find "$OUT/photos" -maxdepth 1 -type f \( -name '*.jpg' -o -name '*.jpeg' -o -name '*.png' -o -name '*.webp' \) 2>/dev/null | wc -l)
NTX=$(grep -c "^- " "$TXT" 2>/dev/null || true)
echo "OK platform=$PLATFORM photos=$NPH textes=$NTX"
exit 0
