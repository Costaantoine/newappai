#!/bin/bash
# Script de deploiement EasyReadVoice — build SUR PJP
# Le build doit se faire la ou la BDD est accessible : PJP a PostgreSQL en local.
set -e

echo "=== DEPLOIEMENT EASYREADVOICE ==="
cd /root/newappai

# 1. Rsync le code source vers PJP
echo "[1/4] Transfert du code source vers PJP..."
rsync -avz --delete \
  --exclude=node_modules --exclude=.next --exclude=.git \
  --exclude=.cache --exclude=.env --exclude=.history \
  /root/newappai/ pjp:/root/newappai-build/src/

# 2. Copier le .env de prod vers le dossier source
echo "[2/4] Copie .env de prod..."
ssh pjp "cp /root/newappai-build/standalone/.env /root/newappai-build/src/.env 2>/dev/null || true"

# 3. Build sur PJP
echo "[3/4] Build sur PJP..."
ssh pjp bash -s << 'BUILD'
  set -e
  cd /root/newappai-build/src
  npm install --ignore-scripts 2>&1 | tail -3
  npx prisma generate 2>&1 | tail -2
  npm run build 2>&1 | tail -5
BUILD

# 4. Copie statics + restart
echo "[4/4] Copie statics + redemarrage..."
ssh pjp bash -s << 'DEPLOY'
  set -e
  cd /root/newappai-build/src
  BUILD_ID=$(cat .next/BUILD_ID)
  echo "Build: $BUILD_ID"
  rm -rf /root/newappai-build/standalone
  cp -r .next/standalone /root/newappai-build/standalone
  cp -r .next/static /root/newappai-build/standalone/.next/static
  cp -r public /root/newappai-build/standalone/public
  cp .env /root/newappai-build/standalone/.env
  fuser -k 3020/tcp 2>/dev/null; sleep 1
  cd /root/newappai-build/standalone
  PORT=3020 HOST=0.0.0.0 nohup node server.js > /tmp/deploy.log 2>&1 &
  disown; sleep 3
DEPLOY

# 5. Verification
echo "=== VERIFICATION ==="
sleep 2
PAGE=$(ssh pjp "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3020/easyreadvoice/login")
QR=$(ssh pjp "curl -s -o /dev/null -w .%{http_code}. http://127.0.0.1:3020/qrcall")
echo "Page login: $PAGE | QRcall: $QR"
if [ "$PAGE" = "200" ] && [ "$QR" = "200" ]; then
  echo "DEPLOIEMENT REUSSI -- build sur PJP avec BDD locale"
else
  echo "ECHEC: page=$PAGE qrcall=$QR"; exit 1
fi
