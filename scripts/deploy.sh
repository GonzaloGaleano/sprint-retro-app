#!/usr/bin/env bash
# Build de producción + subida por rsync al hosting (Hostinger).
# La configuración del servidor se lee de .env.local (ver .env.example).
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -f .env.local ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env.local
  set +a
fi

: "${DEPLOY_SSH_HOST:?Falta DEPLOY_SSH_HOST en .env.local}"
: "${DEPLOY_SSH_USER:?Falta DEPLOY_SSH_USER en .env.local}"
: "${DEPLOY_PATH:?Falta DEPLOY_PATH en .env.local}"
: "${VITE_SUPABASE_URL:?Falta VITE_SUPABASE_URL en .env.local}"
: "${VITE_SUPABASE_ANON_KEY:?Falta VITE_SUPABASE_ANON_KEY en .env.local}"
DEPLOY_SSH_PORT="${DEPLOY_SSH_PORT:-22}"

npm run build

rsync -avz --delete \
  -e "ssh -p ${DEPLOY_SSH_PORT}" \
  dist/ "${DEPLOY_SSH_USER}@${DEPLOY_SSH_HOST}:${DEPLOY_PATH%/}/"

if [ -n "${DEPLOY_URL:-}" ]; then
  echo "Deploy listo: ${DEPLOY_URL}"
fi
