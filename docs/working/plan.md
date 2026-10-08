# Plan de ejecución

Cada tarea termina con `bun run typecheck && bun test && bun run build` en verde, además de su verificación específica. Marca `[x]` al terminar.

## Fase 0: andamiaje
- [x] T0.1 Proyecto Vite + React + TS con three, @react-three/fiber, @react-three/drei y maath. Scripts `typecheck` y `test`. `git init`.
- [x] T0.2 `AGENTS.md`, `CLAUDE.md` y `docs/working/*`.
- [x] T0.3 `src/data/types.ts`, `src/presentation/navigation.ts` (reducer y hash) con `navigation.test.ts`, y `scenes.ts` mínimo con 10 escenas de 2 pasos.

## Fase 1: núcleo
- [x] T1.1 `main.tsx` con ruta por hash y carga diferida, `Presentation` con Canvas, `useKeyboard`, sincronización del hash y `Hud`.
- [x] T1.2 `registry.ts` con 10 escenas placeholder (caja de color + título), `Stage`, `CameraRig`, `useDamp` y `asset()`.

Después de T1.2 puede hacerse en paralelo:
- [x] T1.3 `Overlay`: Caption, WordReveal, PlaceLabel (con herencia) y clase `flashback`.
- [x] T1.4 `ScriptPage`: índice fijo, acotaciones en cursiva, hablante en negrita, `interaction` resaltado, filtro por persona.
- [x] T2.1 Pasar el guion de las escenas 1 a 5 a `scenes.ts`.
- [x] T2.2 Pasar las escenas 6 a 10 y `QUIZ` a `scenes.ts`, más `scenes.test.ts`.
- [x] T3.1 `GlowLine`, `ConnectionNetwork` y `OLYMPUS_NETWORK`.
- [x] T3.2 `Character`, `Hermes`, `Model` y `ASSETS`.
- [x] T3.3 `Footprints`.
- [x] T3.4 `InfoCard3D` y `Clickable` (fuente local en `public/fonts`).
- [x] T3.5 `QuestionCard` y `Scoreboard`.

## Fase 4: escenas
Cada tarea toca solo su archivo `src/scenes/SNN*.tsx` y, si hace falta, su offset. Verificación común: abrir `#/p/N/0`, recorrer con → y volver con ←; el estado visual se revierte; sin errores en consola; 50 fps o más.

| Tarea | Necesita |
|---|---|
| [x] S01 Puertas | T3.1, T3.2 |
| [x] S02 Cueva | T3.2, T3.3 |
| [x] S03 Zeus | T3.1 |
| [x] S04 Apolo | T3.2, T3.3, T3.4 |
| [x] S05 Calipso | T3.1, T3.2 |
| [x] S06 Circe | T3.2 |
| [x] S07 Almas | T3.1, T3.2 |
| [x] S08 Caminos | T3.1, T3.4 |
| [x] S09 Hoy | T3.1, T3.4 |
| [x] S10a Reglas | T3.1, T3.2 |
| [x] S10b Quiz, marcador y teclas | T3.5 |

Orden recomendado: S01 y S10b primero (inicio y actividad), luego el resto.

## Fase 5: pulido (opcional)
- [ ] T5.1 Modelos glb comprimidos en `ASSETS`.
- [ ] T5.2 Transiciones de Hermes entre escenas.
- [ ] T5.3 Audio.
- [ ] T5.4 Pase de legibilidad en 1920×1080 y 1024×768.

## Fase 6: despliegue
- [ ] T6.1 `.github/workflows/deploy.yml` para GitHub Pages. Conviene hacerlo temprano, apenas pase T1.2, para detectar problemas de `base`.

## Fase 7: ensayo
- [ ] Cronometrar con el HUD, ajustar pasos en `scenes.ts`, repartir `presenter` y actualizar `guia-de-exposicion.md`.

## Qué recortar primero si falta tiempo
Audio, modelos reales (quedan los placeholders), clics con mouse, efectos finos, animación de reglas (pasa a lista), `#/lab`, filtro por persona.

No se recorta: navegación por pasos, textos en pantalla, marcador y preguntas de la escena 10, `#/script` y despliegue.
