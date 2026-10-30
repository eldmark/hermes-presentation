#!/bin/bash
# Publica el build en la rama gh-pages (GitHub Pages sin Actions).
# Uso: tools/publicar-pages.sh   (una vez: Settings > Pages > Source = «Deploy from a branch», rama gh-pages, carpeta /)
set -euo pipefail
export PATH="$HOME/.bun/bin:$PATH"
cd "$(dirname "${BASH_SOURCE[0]}")/.."
repo="$(basename "$(git remote get-url origin)" .git)"
BASE="/$repo/" bun run build
tmp="$(mktemp -d)"
cp -r dist/. "$tmp/"
touch "$tmp/.nojekyll"
git -C "$tmp" init -q -b gh-pages
git -C "$tmp" add -A
GIT_AUTHOR_NAME="${GIT_AUTHOR_NAME:-eldmark}" GIT_COMMITTER_NAME="${GIT_COMMITTER_NAME:-eldmark}" \
GIT_AUTHOR_EMAIL="${GIT_AUTHOR_EMAIL:-marcoalejandro.diazcastaneda@gmail.com}" GIT_COMMITTER_EMAIL="${GIT_COMMITTER_EMAIL:-marcoalejandro.diazcastaneda@gmail.com}" \
  git -C "$tmp" commit -qm "Publicar build"
# Usa el token de la cuenta personal (eldmark) aunque `gh` tenga otra cuenta activa.
user="$(git remote get-url origin | sed -E 's#.*github.com[:/]([^/]+)/.*#\1#')"
helper="!f() { test \"\$1\" = get || exit 0; echo username=$user; echo \"password=\$(gh auth token --user $user)\"; }; f"
git -C "$tmp" -c credential.helper= -c "credential.helper=$helper" push -f "https://github.com/$user/$repo.git" gh-pages
rm -rf "$tmp"
echo "Listo: https://eldmark.github.io/$repo/"
