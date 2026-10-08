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
