# Presentación 3D: Hermes

Presentación estática en 3D sobre Hermes para una exposición universitaria de mitología (3 personas, unos 15 minutos, proyector y control de presentación). La cámara sigue a Hermes por 10 escenas. La ruta `#/script` muestra el guion para leerlo en el celular. Todo el texto visible está en español.

## Comandos

Bun está en `~/.bun/bin`; si no está en el PATH, usa `export PATH="$HOME/.bun/bin:$PATH"`.

- `bun install`
- `bun run dev`
- `bun run typecheck`
- `bun test`
- `bun run build`
- `bun run preview`

## Definición de terminado

`bun run typecheck && bun test && bun run build` pasa, y la escena tocada se recorre con → y ← sin errores en la consola.

## Reglas

1. `src/data/scenes.ts` es la fuente de verdad del texto. Los archivos de `script/*.md` son borradores: si cambian, actualiza `scenes.ts`.
2. `src/data/` no importa react ni three.
3. Las escenas derivan su estado del paso actual (`beat`), de modo que retroceder funcione solo. Nada de animaciones disparadas por eventos.
4. Un archivo por escena en `src/scenes/`. Lo reutilizable va en `src/components/`. No dupliques la red de conexiones: usa `OLYMPUS_NETWORK`.
5. Sin backend y sin recursos en tiempo de ejecución desde CDN: fuentes locales, sin `Environment preset`, glb con meshopt.
6. Las rutas de `public/` siempre pasan por `asset('models/x.glb')`, que usa `import.meta.env.BASE_URL`.
7. Los placeholders se cambian por glb solo con `Model` y `ASSETS`.
8. No agregues dependencias sin justificarlo. Ya están: three, @react-three/fiber, @react-three/drei, maath.
9. Lo proyectado debe leerse desde el fondo del salón: texto en el overlay DOM, de 32 px o más.

## Mapa

- `script/`: guion original en Markdown (borradores).
- `src/data/`: tipos y escenas.
- `src/presentation/`: navegación, cámara, teclado y overlay.
- `src/components/`: componentes reutilizables (`three/` y `ui/`).
- `src/scenes/`: una escena por archivo.
- `docs/working/`: documentación de trabajo. Empieza por `plan.md`.

## Estado y plan

El plan por fases y su estado están en `docs/working/plan.md`. Marca las tareas al terminarlas.
