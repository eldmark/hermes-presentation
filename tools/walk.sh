#!/bin/bash
# Recorrido con → y capturas. Uso: OUT=<carpeta> [VIEW=1280x720] tools/walk.sh "N/k" <pasos>
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "${OUT:?define OUT=<carpeta>}"
exec flock /tmp/claude-1000/hermes_shot.lock node "$here/walk.cjs" "$@"
