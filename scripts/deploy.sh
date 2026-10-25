#!/usr/bin/env bash
# Deploy nihongo (app + VOICEVOX) to the LAN VM via docker compose.
# Override with DEPLOY_HOST (user@host) and DEPLOY_DIR (remote dir, relative to $HOME).
set -euo pipefail

HOST="${DEPLOY_HOST:-tom@10.1.1.81}"
DIR="${DEPLOY_DIR:-nihongo}"
ADDR="${HOST#*@}"

cd "$(git rev-parse --show-toplevel)"

git ls-files -z | tar --null -czf - -T - |
  ssh "$HOST" "mkdir -p '$DIR' && cd '$DIR' && rm -rf src && tar -xzf - && docker compose up -d --build"

echo "Deployed. App: http://$ADDR:8080  VOICEVOX: http://$ADDR:50021 (set this URL in Settings)"
