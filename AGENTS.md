# Presentación 3D: Hermes

Presentación estática en 3D sobre Hermes para una exposición universitaria de mitología (3 personas, unos 15 minutos, proyector y control de presentación). La cámara sigue a Hermes por 12 escenas (la 10 son los conceptos, la 11 la actividad y la 12 las referencias). La ruta `#/script` muestra el guion para leerlo en el celular. Todo el texto visible está en español.

## Comandos

Bun está en `~/.bun/bin`; si no está en el PATH, usa `export PATH="$HOME/.bun/bin:$PATH"`.

- `bun install`
- `bun run dev`
- `bun run typecheck`
- `bun test`
- `bun run build`
- `bun run preview`
- `bun run presentar` (build local para el proyector, en http://127.0.0.1:4173/)

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
9. Lo proyectado debe leerse desde el fondo del salón: texto en el overlay DOM, de 32 px o más (los paneles de referencias, de 22 px o más).
10. El cielo y la niebla de cada escena están en `src/presentation/atmosphere.ts`; las escenas vecinas se montan pero solo se ven durante el vuelo de cámara. Cada escena añade sus propias luces, moderadas (la luz base global es ambient 0.5 y directional 0.85).
11. Quién dice cada línea está en `src/data/reparto.ts`; el guion no lleva `presenter` a mano.
12. Para revisar cambios visuales usa capturas reales: `tools/shot.sh` y `tools/walk.sh` (un solo Chromium a la vez; la máquina tiene poca RAM, no lances más de dos agentes en paralelo).

## Mapa

- `script/`: guion original en Markdown (borradores).
- `src/data/`: tipos y escenas.
- `src/presentation/`: navegación, cámara, teclado y overlay.
- `src/components/`: componentes reutilizables (`three/` y `ui/`).
- `src/scenes/`: una escena por archivo.
- `tools/`: capturas y recorrido automático con Chromium.
- `docs/working/`: documentación de trabajo. Empieza por `plan.md`.

## Estado y plan

El plan por fases y su estado están en `docs/working/plan.md`. Marca las tareas al terminarlas.
