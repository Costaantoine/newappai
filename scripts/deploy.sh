#!/usr/bin/env bash
# ============================================================
# Deploiement NewAppAI — build source -> /root/newappai-build
# Usage : bash scripts/deploy.sh
# SECURITE : le .env de production vit dans /root/newappai-build/.env
# et est EXCLU du rsync — il ne peut plus etre ecrase par un deploy.
# ============================================================
set -euo pipefail

SRC=/root/newappai
BUILD=/root/newappai-build
SERVICE=newappai
EXCLUDES=(--exclude='.env' --exclude='.env.*')

echo "==> [1/5] Backup du build actuel"
rm -rf "${BUILD}-backup-pre-deploy"
cp -a "$BUILD" "${BUILD}-backup-pre-deploy"

echo "==> [2/5] Build Next.js (source)"
cd "$SRC"
npm run build

echo "==> [3/5] Copie standalone (exclusion .env)"
rsync -a "${EXCLUDES[@]}" "$SRC/.next/standalone/" "$BUILD/"

echo "==> [4/5] Statiques + public (exclusion .env)"
mkdir -p "$BUILD/.next/static"
cp -r "$SRC/.next/static/"* "$BUILD/.next/static/"
rsync -a "${EXCLUDES[@]}" "$SRC/public/" "$BUILD/public/"

echo "==> [5/5] Restart service systemd"
systemctl restart "$SERVICE"

echo "==> Deploiement termine. Service : $(systemctl is-active "$SERVICE")"
