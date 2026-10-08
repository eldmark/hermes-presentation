# Contratos compartidos

Todos los agentes deben respetar estas interfaces. Si hace falta cambiar una, se cambia aquí y en el código en la misma tarea.

## Datos (`src/data/types.ts`)

```ts
export type SceneId = 'puertas'|'cueva'|'zeus'|'apolo'|'calipso'|'circe'|'almas'|'caminos'|'hoy'|'actividad';
export type Speaker = 'expositor'|'narrador'|'presentador'|'hermes'|'zeus'|'calipso'|'apolo';
export type PresenterId = 1 | 2 | 3;
export type Vec3 = [number, number, number];

export interface Line { speaker: Speaker; text: string; presenter?: PresenterId }

export interface Beat {
  id: string;                         // único dentro de la escena, ej. 'robo-huellas'
  stage?: string;                     // acotación [ ... ]; se muestra en /script, no en el proyector
  lines: Line[];                      // lo que se dice en este paso
  onScreen?: string | string[];       // texto proyectado; array = palabras que aparecen una a una
  label?: { place?: string; time?: string }; // rótulo; se hereda en los pasos siguientes hasta que otro lo cambie
  flashback?: boolean;                // tinte de recuerdo
  interaction?: string;               // instrucción para quien presenta ("El público señala; → revela")
  quiz?: { q: number; phase: 'shown'|'hidden'|'revealed' }; // solo escena 10
}

export interface SceneData {
  id: SceneId; number: number; title: string;
  minutes: [number, number]; place: string;
  question?: string; sources?: string[];
  beats: Beat[];
}

export interface QuizQuestion { prompt: string; options: [string,string,string,string]; correct: 0|1|2|3; fromScene: number }
// El número de mesas NO está en los datos: se ingresa durante la presentación (ver actividad.md).
export const QUIZ: { questions: QuizQuestion[]; reserve: QuizQuestion };
export const SCENES: SceneData[];
```

- Un `Beat` por cada «clic». Las subsecciones del guion (4.1 a 4.6, 5.1 a 5.5…) se parten en 2 a 4 pasos.
- El componente 3D NO va en los datos (para que `/script` no importe three).
- Los pasos de la escena 10 se generan desde `QUIZ`: `intro`, `reglas-1..6`, `demo`, `mesas` (el número de mesas se ingresa aquí), luego `q{n}-pregunta`, `q{n}-cadena`, `q{n}-respuesta` por pregunta, y `cierre`.

## Escena 3D

```ts
// src/presentation/types.ts
export type Shot = { pos: Vec3; look: Vec3 };            // coordenadas LOCALES de la escena
export interface SceneProps { data: SceneData; beat: number; beatId: string; active: boolean }
// Cada src/scenes/SNNNombre.tsx exporta:  shots: Shot[]  y  default function (p: SceneProps)
```

Estado derivado de `beat` (nada disparado por eventos). `registry.ts` mapea `SceneId` a `{ component (lazy), load, offset: Vec3 }` con `Record<SceneId, …>`. `load()` es la importación dinámica del módulo (la usa `useShots(id)` para que `CameraRig` lea `shots` sin montar la escena).

## Componentes reutilizables

`src/components/three/`:
- `useDamp(target, smooth = 0.6)`: valor numérico amortiguado.
- `GlowLine`: `points: Vec3[]; progress: number(0..1); color; width?; opacity?; dashed?` (material aditivo, sin postprocesado).
- `ConnectionNetwork`: `nodes: Record<string,Vec3>; links: [string,string][]; lit: number; color; arc?; pulse?`. Exporta `OLYMPUS_NETWORK` (usada en escenas 1, 9 y 10).
- `Character`: `kind: 'hermes'|'apolo'|'calipso'|'odiseo'|'humano'|'alma'; position; rotation?; action?: 'idle'|'walk'|'wave'|'fly'|'sleep'|'point'|'play'; scale?; ghost?; color?`. Amortigua la posición hacia la prop.
- `Hermes`: `Character` con sombrero alado y caduceo; `holding?: 'carta'|'lira'|'moly'`.
- `Model`: `name: keyof typeof ASSETS; fallback: ReactNode`. Si `ASSETS[name]` es `null` o falla la carga, muestra el fallback. **Hoy todos los ASSETS son `null`: los modelos reales llegan después y entran solo editando `ASSETS`.**
- `Footprints`: `path: Vec3[]; count; visible: number(0..1); reversed?`.
- `InfoCard3D`: `title; subtitle?; icon?; position; highlighted?` (Billboard + `<Text>` con fuente local).
- `Clickable`: `onSelect; children; hint?`.

`src/components/ui/` (DOM sobre el canvas):
- `Caption`, `WordReveal(words, count)`, `PlaceLabel(place?, time?)`.
- `QuestionCard(prompt, options[4], phase, correct)`: colores Kahoot (rojo, azul, amarillo, verde) más formas (triángulo, rombo, círculo, cuadrado).
- `Scoreboard(scores: number[], variant: 'corner'|'center', flash?: number)`.
- `Hud(scene, beat, elapsed, planned)`.

Navegación (`src/presentation/navigation.ts`): `navigate(state, action, counts)` puro con `{scene (0-indexada), beat}`; `formatHash`/`parseHash(hash, counts)` (hash con escena 1-indexada y paso 0-indexado). `useSceneKeys` vive en `src/presentation/keys.ts` y usa `SceneActiveContext` (lo provee `Stage`).

Utilidades: `asset(path)` usa `import.meta.env.BASE_URL`. `useSceneKeys(handler)` devuelve `true` si consumió la tecla y solo está activo cuando la escena está activa.

## Placeholders

Mientras no haya modelos, todo se dibuja con geometrías simples (cajas, esferas, conos, cilindros) con colores distintivos. Cada personaje y objeto debe ser identificable: Hermes con sombrero alado y vara, la lira, la tortuga, el ganado, etc.
