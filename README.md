# Hermes: el dios más importante del mundo

Presentación 3D para una exposición universitaria de mitología sobre **Hermes**, mensajero de los dioses. La cámara sigue a Hermes por diez escenas, desde las puertas del Olimpo hasta una actividad final con el público. Está pensada para unos 15 minutos, tres personas que exponen, un proyector y un control de presentación.

La pregunta que guía todo: **¿podría Hermes ser el dios más importante del mundo?** La exposición la responde recorriendo sus mitos y pensando por qué la comunicación importa.

## Las diez escenas

| # | Escena | Qué cuenta |
|---|---|---|
| 1 | Las puertas del Olimpo | Presentación y la pregunta conductora |
| 2 | La cueva de Maia | Nacimiento, padres, la lira y la tortuga |
| 3 | El mensaje de Zeus | Zeus en su trono envía a Hermes con Calipso |
| 4 | Hermes y Apolo | El robo del ganado, el juicio y la lira |
| 5 | La isla de Calipso | Hermes entrega el mensaje; Odiseo puede partir |
| 6 | Lo que Hermes sabía de Circe | El *moly* y la advertencia a Odiseo |
| 7 | Hermes, guía de las almas | El tránsito entre mundos |
| 8 | Los caminos de Hermes y Mercurio | Hermas, mercado y la versión romana, Mercurio |
| 9 | Lo que queda de Hermes | Pervivencia y respuesta a la pregunta inicial |
| 10 | Actividad | Concurso de preguntas con cadena de susurros |

El guion completo está en [`script/`](script/) y es la fuente de los textos de la presentación.

## Cómo correrlo

Necesitas [Bun](https://bun.sh).

```bash
bun install
bun run dev
```

Abre la dirección que imprime Vite (normalmente `http://localhost:5173/`).

| Dirección | Para qué sirve |
|---|---|
| `/` | La presentación, en el proyector |
| `/#/script` | El guion para leerlo en el celular (cada persona se desplaza a mano; tiene filtro por persona) |
| `/#/p/N/k` | Salta a la escena `N`, paso `k` (por ejemplo `#/p/3/0`) |

### Controles

| Tecla | Acción |
|---|---|
| `→` `↓` `Espacio` `PageDown` `Enter` | Avanzar un paso |
| `←` `↑` `PageUp` | Retroceder |
| `Inicio` | Volver al principio |
| `F` | Pantalla completa |
| `H` | Mostrar u ocultar el HUD (escena, paso y cronómetro) |
| `B` o `.` | Pantalla negra |

Los controles de presentación por Bluetooth funcionan sin configurar nada, porque mandan estas mismas teclas.

## La actividad final

La escena 10 es un concurso de cinco preguntas, estilo Kahoot, que cada mesa responde con una **cadena de susurros**: quien sabe la respuesta la dice al oído a su vecino de la izquierda, y el último de la cadena la dice en voz alta. Las cuatro opciones de cada pregunta suenan parecido y se ocultan al empezar la cadena. El número de mesas (de 2 a 12) se ingresa durante la presentación y el marcador se lleva con el teclado. No hay servidor ni celulares. Las reglas y las teclas están en [`docs/working/actividad.md`](docs/working/actividad.md).

## Cómo está hecho

- **Bun + Vite + React + TypeScript**, con [`three`](https://threejs.org) a través de `@react-three/fiber` y `@react-three/drei`.
- **Completamente estático**: sin servidor ni base de datos, y sin recursos desde CDN en tiempo de ejecución.
- **Un solo archivo de datos** (`src/data/scenes.ts`) alimenta la presentación y la página del guion.
- **Cada escena deriva su estado del paso actual**, así que retroceder y recargar en cualquier punto funcionan sin código extra.
- **Modelos 3D hechos en Blender** con scripts reproducibles (carpeta [`blender/`](blender/)), exportados a `public/models/`. Los personajes tienen articulaciones con nombre y se animan por código. Si un modelo falla al cargar, se dibuja una versión simple de respaldo.

```
script/           guion en Markdown (borradores)
src/data/         tipos y escenas (fuente de verdad del texto)
src/presentation/ navegación, cámara, teclado y overlay
src/components/   componentes reutilizables (3D y UI)
src/scenes/       una escena por archivo
blender/          scripts que generan los modelos
public/models/    modelos .glb
docs/working/     documentación de trabajo
```

## Comandos

```bash
bun run dev        # servidor de desarrollo
bun run typecheck  # tipos
bun test           # pruebas
bun run build      # compilación de producción
bun run preview    # sirve la compilación
```

## Documentación

Todo el detalle está en [`docs/working/`](docs/working/):

- [`arquitectura.md`](docs/working/arquitectura.md): cómo encajan las piezas
- [`agregar-o-editar-escena.md`](docs/working/agregar-o-editar-escena.md): cómo agregar o cambiar una escena
- [`modelos.md`](docs/working/modelos.md): catálogo de modelos y cómo regenerarlos con Blender
- [`actividad.md`](docs/working/actividad.md): reglas y teclas de la actividad
- [`guia-de-exposicion.md`](docs/working/guia-de-exposicion.md): hoja para quienes exponen y lista de verificación del día
- [`correr-y-desplegar.md`](docs/working/correr-y-desplegar.md): ejecución y despliegue
- [`plan.md`](docs/working/plan.md): estado del proyecto

## Estado

Las diez escenas y la actividad funcionan, y el proyecto compila y pasa sus pruebas. Quedan pendientes el despliegue público (GitHub Pages), la compresión de los modelos y el reparto de líneas entre las tres personas. El estilo de los modelos es esquemático y limpio, no realista.

## Fuentes antiguas

Homero, *Odisea* (cantos V, X y XXIV) y el *Himno homérico a Hermes*. En cada archivo de [`script/`](script/) se indica qué parte viene de las fuentes y qué es adaptación para la presentación.
