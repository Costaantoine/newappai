#!/bin/bash
# ============================================================
# deploy-vitrine.sh — met en ligne un site généré par l'outil vitrine.
#
# Usage : scripts/deploy-vitrine.sh <slug> <jobId> [--dry-run]
#   slug  : sous-domaine voulu → <slug>.newappai.com (regex [a-z0-9-])
#   jobId : job livré dans /home/newappai/vitrine-livraisons/<jobId>/site/
#
# Pattern de déploiement découvert sur le VPS prod (TÂCHE 1) :
#   - VPS prod : 72.62.25.52, proxy Traefik v3 (conteneur « coolify-proxy »,
#     réseau docker « coolify », provider docker sur /var/run/docker.sock).
#   - Un site statique = un conteneur nginx:alpine dont le dossier hôte est
#     monté en lecture seule sur /usr/share/nginx/html, rattaché au réseau
#     « coolify » et décrit par des labels Traefik (routers http/https, TLS
#     Let's Encrypt via le certresolver « letsencrypt »).
#   - Référence : conteneur « filipac-naildesigner » (dossier /root/filipac-site-web,
#     vhost filipacnaildesigner.newappai.com). Aucun fichier nginx custom n'est
#     monté : la conf par défaut de nginx:alpine sert /usr/share/nginx/html.
#   - « Reload » : Traefik écoute les événements docker → aucun reload manuel.
#
# Sûreté : set -euo pipefail, validation du slug/jobId, vérification que
# index.html existe, jamais de rm -rf (le retrait de conteneur est ciblé et
# précédé d'un test d'existence). --dry-run affiche tout sans rien exécuter.
# ============================================================

set -euo pipefail

# ─── Configuration (surchargable par variables d'environnement) ──────────
SSH_TARGET="${SSH_TARGET:-root@72.62.25.52}"
SITE_ROOT="${SITE_ROOT:-/root/vitrine-sites}"     # dossier hôte qui contient les sites
TRAEFIK_NETWORK="${TRAEFIK_NETWORK:-coolify}"      # réseau docker où route Traefik
IMAGE="${IMAGE:-nginx:alpine}"
DOMAIN_SUFFIX="${DOMAIN_SUFFIX:-newappai.com}"
LOCAL_DELIVERIES_DIR="${LOCAL_DELIVERIES_DIR:-/home/newappai/vitrine-livraisons}"

SSH_FLAGS=(-o BatchMode=yes -o ConnectTimeout=15 -o StrictHostKeyChecking=accept-new)
SCP_FLAGS=(-o BatchMode=yes -o ConnectTimeout=15 -o StrictHostKeyChecking=accept-new)

# ─── Lecture des arguments ───────────────────────────────────────────────
usage() {
  echo "Usage : $0 <slug> <jobId> [--dry-run]" >&2
  echo "  slug  : sous-domaine → <slug>.newappai.com (regex [a-z0-9-])" >&2
  echo "  jobId : job livré dans $LOCAL_DELIVERIES_DIR/<jobId>/site/" >&2
  exit 2
}

DRY_RUN=false
SLUG=""
JOB_ID=""

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    -h|--help) usage ;;
    *)
      if [ -z "$SLUG" ]; then SLUG="$arg"
      elif [ -z "$JOB_ID" ]; then JOB_ID="$arg"
      else usage; fi
      ;;
  esac
done

if [ -z "$SLUG" ] || [ -z "$JOB_ID" ]; then
  usage
fi

# ─── Validation stricte des entrées ──────────────────────────────────────
if ! printf '%s' "$SLUG" | grep -Eq '^[a-z0-9-]+$'; then
  echo "ERREUR : slug invalide « $SLUG » (autorisé : [a-z0-9-])." >&2
  exit 1
fi
if ! printf '%s' "$JOB_ID" | grep -Eq '^[a-zA-Z0-9_-]+$'; then
  echo "ERREUR : jobId invalide « $JOB_ID »." >&2
  exit 1
fi

LOCAL_SITE_DIR="$LOCAL_DELIVERIES_DIR/$JOB_ID/site"
if [ ! -f "$LOCAL_SITE_DIR/index.html" ]; then
  echo "ERREUR : $LOCAL_SITE_DIR/index.html introuvable (job non livré ?)." >&2
  exit 1
fi

# Dépendances locales
for bin in ssh scp; do
  command -v "$bin" >/dev/null 2>&1 || { echo "ERREUR : « $bin » requis en local." >&2; exit 1; }
done

CONTAINER="${SLUG}-vitrine"
HOST="${SLUG}.${DOMAIN_SUFFIX}"
REMOTE_SITE_DIR="$SITE_ROOT/$SLUG"

# ─── Helpers ─────────────────────────────────────────────────────────────
run() {
  # Affiche la commande, puis l'exécute (sauf en dry-run).
  printf '  $ %s\n' "$*"
  if [ "$DRY_RUN" = false ]; then
    "$@"
  fi
}

step() {
  echo
  echo "── $1"
}

if [ "$DRY_RUN" = true ]; then
  echo "=== MODE DRY-RUN : aucune commande ne sera exécutée ==="
fi

echo "=== Déploiement vitrine : $SLUG ==="
echo "  slug      : $SLUG"
echo "  jobId     : $JOB_ID"
echo "  vhost     : https://$HOST"
echo "  conteneur : $CONTAINER (image $IMAGE, réseau $TRAEFIK_NETWORK)"
echo "  distant   : $SSH_TARGET:$REMOTE_SITE_DIR"

# 1. Créer le dossier distant
step "Création du dossier distant $REMOTE_SITE_DIR"
run ssh "${SSH_FLAGS[@]}" "$SSH_TARGET" "mkdir -p $REMOTE_SITE_DIR"

# 2. Copier le contenu du site (le contenu de site/, pas le dossier site/)
step "Copie des fichiers du site"
run scp "${SCP_FLAGS[@]}" -r "$LOCAL_SITE_DIR/." "$SSH_TARGET:$REMOTE_SITE_DIR/"

# 3. (Re)créer le conteneur nginx + labels Traefik
#    Traefik (provider docker) détecte le nouveau conteneur et provisionne le
#    certificat Let's Encrypt automatiquement → aucun reload manuel requis.
step "Mise à jour du conteneur $CONTAINER"
if [ "$DRY_RUN" = true ]; then
  printf '  $ ssh %s docker rm -f %s 2>/dev/null || true\n' "$SSH_TARGET" "$CONTAINER"
  printf '  $ ssh %s docker run -d --name %s --network %s --restart unless-stopped -v %s:/usr/share/nginx/html:ro \\\n' \
    "$SSH_TARGET" "$CONTAINER" "$TRAEFIK_NETWORK" "$REMOTE_SITE_DIR"
  printf '        -l traefik.enable=true \\\n'
  printf '        -l "traefik.http.routers.%s-http.rule=Host(`%s`)" \\\n' "$SLUG" "$HOST"
  printf '        -l "traefik.http.routers.%s-http.entryPoints=http" \\\n' "$SLUG"
  printf '        -l "traefik.http.routers.%s-http.middlewares=%s-redirect" \\\n' "$SLUG" "$SLUG"
  printf '        -l "traefik.http.middlewares.%s-redirect.redirectscheme.scheme=https" \\\n' "$SLUG"
  printf '        -l "traefik.http.routers.%s-https.rule=Host(`%s`)" \\\n' "$SLUG" "$HOST"
  printf '        -l "traefik.http.routers.%s-https.entryPoints=https" \\\n' "$SLUG"
  printf '        -l "traefik.http.routers.%s-https.tls=true" \\\n' "$SLUG"
  printf '        -l "traefik.http.routers.%s-https.tls.certresolver=letsencrypt" \\\n' "$SLUG"
  printf '        -l "traefik.http.routers.%s-https.middlewares=%s-gzip" \\\n' "$SLUG" "$SLUG"
  printf '        -l "traefik.http.middlewares.%s-gzip.compress=true" \\\n' "$SLUG"
  printf '        -l "traefik.http.services.%s.loadbalancer.server.port=80" %s\n' "$SLUG" "$IMAGE"
else
  # Heredoc à délimiteur quoté : aucun développement local. Les backticks du
  # label Host(...) sont échappés pour rester littéraux côté distant.
  ssh "${SSH_FLAGS[@]}" "$SSH_TARGET" bash -s -- \
    "$SLUG" "$HOST" "$REMOTE_SITE_DIR" "$CONTAINER" "$IMAGE" "$TRAEFIK_NETWORK" <<'REMOTE'
set -euo pipefail
slug="$1"
host="$2"
site_dir="$3"
container="$4"
image="$5"
network="$6"

# Retire l'ancien conteneur du même slug s'il existe (jamais de rm -rf, ciblé).
if docker ps -a --format '{{.Names}}' | grep -qx "$container"; then
  docker rm -f "$container" >/dev/null
fi

docker run -d \
  --name "$container" \
  --network "$network" \
  --restart unless-stopped \
  -v "$site_dir:/usr/share/nginx/html:ro" \
  -l "traefik.enable=true" \
  -l "traefik.http.routers.${slug}-http.rule=Host(\`${host}\`)" \
  -l "traefik.http.routers.${slug}-http.entryPoints=http" \
  -l "traefik.http.routers.${slug}-http.middlewares=${slug}-redirect" \
  -l "traefik.http.middlewares.${slug}-redirect.redirectscheme.scheme=https" \
  -l "traefik.http.routers.${slug}-https.rule=Host(\`${host}\`)" \
  -l "traefik.http.routers.${slug}-https.entryPoints=https" \
  -l "traefik.http.routers.${slug}-https.tls=true" \
  -l "traefik.http.routers.${slug}-https.tls.certresolver=letsencrypt" \
  -l "traefik.http.routers.${slug}-https.middlewares=${slug}-gzip" \
  -l "traefik.http.middlewares.${slug}-gzip.compress=true" \
  -l "traefik.http.services.${slug}.loadbalancer.server.port=80" \
  "$image"
REMOTE
fi

echo
if [ "$DRY_RUN" = true ]; then
  echo "=== DRY-RUN terminé — rien n'a été exécuté ==="
else
  echo "=== Déploiement terminé ==="
  echo "  Site en ligne : https://$HOST"
  echo "  (le certificat TLS est provisionné par Traefik/Let's Encrypt en quelques secondes)"
fi
