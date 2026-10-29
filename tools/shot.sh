#!/bin/bash
# Cola global: solo UN Chromium a la vez en toda la máquina (la RAM es limitada).
# Uso: OUT=<carpeta> [WAIT=6000] [VIEW=1280x720] tools/shot.sh "N/k" "N/k2" ...
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "${OUT:?define OUT=<carpeta>}"
exec flock /tmp/claude-1000/hermes_shot.lock node "$here/shot.cjs" "$@"
