# Hermes: el dios más importante del mundo

Presentación 3D para una exposición universitaria de mitología sobre **Hermes**, mensajero de los dioses. La cámara sigue a Hermes por doce escenas, desde las puertas del Olimpo hasta una actividad final con el público y la lista de referencias. Está pensada para tres personas que exponen, un proyector y un control de presentación.

La pregunta que guía todo: **¿podría Hermes ser el dios más importante del mundo?** La exposición la responde recorriendo sus mitos y pensando por qué la comunicación importa.

## Las doce escenas

| # | Escena | Qué cuenta |
|---|---|---|
| 1 | Las puertas del Olimpo | Presentación y la pregunta conductora |
| 2 | La cueva de Maia | Nacimiento, **árbol genealógico** (Zeus, Maia, Apolo), la lira y la tortuga |
| 3 | El mensaje de Zeus | Zeus en su trono envía a Hermes con Calipso |
| 4 | Hermes y Apolo | El robo del ganado, el juicio y la lira |
| 5 | La isla de Calipso | Hermes entrega el mensaje; Odiseo puede partir |
| 6 | Lo que Hermes sabía de Circe | El *moly* y la advertencia a Odiseo |
| 7 | Hermes, guía de las almas | El tránsito entre mundos |
| 8 | Los caminos de Hermes y Mercurio | Hermas, mercado y la versión romana, Mercurio |
| 9 | Lo que queda de Hermes | Pervivencia y respuesta a la pregunta inicial |
| 10 | Seis ideas para pensar a Hermes | *Mêtis*, *díkē*, *eleuthería*, *moira*, *areté* y *gnôsis*, cada una con su definición y su vínculo con el mito |
| 11 | El mensaje que no debe cambiar | Actividad: concurso de preguntas con cadena de susurros |
| 12 | Referencias | Despedida y fuentes en formato APA |

El guion original está en [`script/`](script/) (borradores); el texto que se proyecta vive en `src/data/scenes.ts`.

## Cómo correrlo

Necesitas [Bun](https://bun.sh).

```bash
bun install
bun run dev          # desarrollo, con recarga automática
bun run presentar    # compila y sirve el build local en http://127.0.0.1:4173/ (el modo para el proyector)
```

| Dirección | Para qué sirve |
|---|---|
| `/` | La presentación, en el proyector |
| `/#/script` | El guion para leerlo en el celular, con filtro por persona |
| `/#/p/N/k` | Salta a la escena `N`, paso `k` (por ejemplo `#/p/3/0`) |

Para leer el guion en los celulares desde la misma red: `bun run presentar:red` y abrir `http://<IP-de-la-laptop>:4173/#/script`.

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

### En el proyector

La resolución se adapta sola: el lienzo ocupa toda la pantalla, en proyectores 4:3 o 16:10 el campo de visión se ajusta para no recortar los lados, la resolución de render baja sola si el equipo va justo de fps, y el cursor se oculta tras unos segundos. Detalles y lista de verificación en [`docs/working/guia-de-exposicion.md`](docs/working/guia-de-exposicion.md).

## Quién dice qué

El reparto entre las tres personas está en [`src/data/reparto.ts`](src/data/reparto.ts) y se ve en `#/script` con el filtro **Persona 1 / 2 / 3**. Son unas 730 palabras para cada persona (unos 5,6 minutos hablados). La tabla por escena está en la guía de exposición.

## La actividad final

La escena 11 es un concurso de cinco preguntas, estilo Kahoot, que cada mesa responde con una **cadena de susurros**: quien sabe la respuesta la dice al oído a su vecino de la izquierda, y el último de la cadena la dice en voz alta. Las cuatro opciones de cada pregunta suenan parecido y se ocultan al empezar la cadena. El número de mesas (de 2 a 12) se ingresa durante la presentación y el marcador se lleva con el teclado. No hay servidor ni celulares. Las reglas y las teclas están en [`docs/working/actividad.md`](docs/working/actividad.md).

## Cómo está hecho

- **Bun + Vite + React + TypeScript**, con [`three`](https://threejs.org) a través de `@react-three/fiber` y `@react-three/drei`.
- **Completamente estático**: sin servidor ni base de datos, y sin recursos desde CDN en tiempo de ejecución (las fuentes Cinzel y EB Garamond y los modelos van en el repositorio).
- **Un solo archivo de datos** (`src/data/scenes.ts`) alimenta la presentación y la página del guion; el reparto se aplica encima (`src/data/reparto.ts`).
- **Cada escena deriva su estado del paso actual**, así que retroceder y recargar en cualquier punto funcionan sin código extra.
- **Cielo y niebla por escena** (`src/presentation/atmosphere.ts`); las escenas vecinas solo se ven durante el vuelo de cámara.
- **Paneles sobre el 3D** (`panel` en cada paso): árbol genealógico en SVG, tarjetas de concepto y listas de referencias.
- **Modelos 3D hechos en Blender** con scripts reproducibles (carpeta [`blender/`](blender/)), exportados a `public/models/`. Los personajes tienen articulaciones con nombre y se animan por código. Si un modelo falla al cargar, se dibuja una versión simple de respaldo.

```
script/           guion en Markdown (borradores)
src/data/         tipos, escenas, reparto y genealogía (fuente de verdad del texto)
src/presentation/ navegación, cámara, atmósfera, teclado y overlay
src/components/   componentes reutilizables (3D y UI)
src/scenes/       una escena por archivo
blender/          scripts que generan los modelos
tools/            capturas y recorrido automático con Chromium
public/models/    modelos .glb
docs/working/     documentación de trabajo
```

## Comandos

```bash
bun run dev              # servidor de desarrollo
bun run presentar        # build local para el proyector
bun run presentar:red    # lo mismo, visible desde otros dispositivos de la red
bun run typecheck        # tipos
bun test                 # pruebas
bun run build            # compilación de producción
bun run preview          # sirve la compilación
```

Para revisar la presentación con capturas reales (render por software): `OUT=<carpeta> tools/walk.sh "1/0" 40` recorre con la tecla `→` y guarda una imagen por paso; `tools/shot.sh` captura pasos concretos. Ver [`tools/`](tools/).

## Documentación

Todo el detalle está en [`docs/working/`](docs/working/):

- [`arquitectura.md`](docs/working/arquitectura.md): cómo encajan las piezas
- [`agregar-o-editar-escena.md`](docs/working/agregar-o-editar-escena.md): cómo agregar o cambiar una escena
- [`modelos.md`](docs/working/modelos.md): catálogo de modelos y cómo regenerarlos con Blender
- [`actividad.md`](docs/working/actividad.md): reglas y teclas de la actividad
- [`guia-de-exposicion.md`](docs/working/guia-de-exposicion.md): reparto, proyector, ensayo y lista de verificación del día
- [`correr-y-desplegar.md`](docs/working/correr-y-desplegar.md): ejecución y despliegue
- [`plan.md`](docs/working/plan.md): estado del proyecto

## Estado

Las doce escenas y la actividad funcionan, y el proyecto compila y pasa sus pruebas. Quedan pendientes el ensayo con cronómetro para recortar texto (hoy son unos 17 minutos de voz), la compresión de los modelos y, si se quiere, el despliegue público (GitHub Pages). El estilo de los modelos es esquemático y limpio, no realista.

## Fuentes

Homero, *Odisea* (cantos V, X y XXIV); *Himno homérico a Hermes*; Hesíodo, *Teogonía*; Detienne y Vernant sobre la *mêtis*; objetos del Metropolitan Museum of Art y del British Museum. La lista completa en formato APA está en la última escena de la presentación y en `src/data/scenes.ts`. En cada archivo de [`script/`](script/) se indica qué parte viene de las fuentes y qué es adaptación.
