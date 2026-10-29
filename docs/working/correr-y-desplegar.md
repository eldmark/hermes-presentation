# Correr y desplegar

## Local

```
export PATH="$HOME/.bun/bin:$PATH"   # si bun no está en el PATH
bun install
bun run dev
```

## Verificación

```
bun run typecheck && bun test && bun run build
```

## GitHub Pages (GitHub Actions)

1. En el repositorio, Settings → Pages → Source: **GitHub Actions**.
2. El workflow (`.github/workflows/deploy.yml`) hace: checkout, `oven-sh/setup-bun@v2`, `bun install --frozen-lockfile`, `BASE=/<repo>/ bun run build`, `upload-pages-artifact` (carpeta `dist`) y `deploy-pages`. Permisos: `pages: write` e `id-token: write`.
3. Revisa que los modelos carguen (sin 404 por `base`) y que `#/script` abra en un celular.

## Vercel

Importa el repositorio. `base` queda en `/`, no hace falta variable.

## Modelos 3D

Pon los `.glb` en `public/models/` y comprímelos:

```
bunx @gltf-transform/cli optimize in.glb public/models/x.glb --compress meshopt --texture-compress webp
```

Meta: menos de 3 MB por modelo y menos de 20 MB en total. No uses Git LFS con Pages.

## Plan B sin internet

Lleva el build en la laptop: `bun run build && bun run preview`. Abrir `dist/index.html` con `file://` no funciona.

## Presentar desde el build local

```
bun run presentar        # tsc + vite build + vite preview en http://127.0.0.1:4173/
bun run presentar:red    # igual, pero visible desde otros dispositivos de la red (guion en los celulares)
```

Abrir la dirección en el navegador y poner pantalla completa con `F`. No requiere internet. Más en `guia-de-exposicion.md`.

## Revisar con capturas

```
OUT=/tmp/capturas tools/shot.sh "4/2" "4/6"        # pasos concretos (VIEW=1024x768 para probar 4:3)
OUT=/tmp/recorrido tools/walk.sh "1/0" 40           # recorrido con → desde el paso dado
```

Necesitan `bun run dev` corriendo en http://127.0.0.1:5175/ (`BASE=` para otra dirección) y el paquete `playwright` (ruta en `PLAYWRIGHT_DIR`). Solo corre un Chromium a la vez.


## GitHub Pages sin Actions

Se puede publicar sin GitHub Actions: `tools/publicar-pages.sh` compila con `BASE=/<repo>/` y sube `dist/` a la rama `gh-pages`. Una sola vez, en el repositorio: Settings → Pages → Source «Deploy from a branch», rama `gh-pages`, carpeta `/ (root)`. La ruta con `#` funciona en Pages porque no necesita reescrituras del servidor. Ojo: el sitio es público aunque el repositorio no lo sea, y el modelo pesa unos 5 MB.
