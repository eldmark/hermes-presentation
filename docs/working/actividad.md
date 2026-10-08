# Actividad: el mensaje que no debe cambiar

Fuente del guion: `script/escena-10-actividad-telefono-descompuesto.md`.

## Reglas (como se proyectan)

1. Se muestra la pregunta con cuatro opciones.
2. Quien sabe la respuesta levanta la mano y empieza la cadena.
3. Las opciones se ocultan: la respuesta solo viaja por voz.
4. Se susurra una sola vez, al oído, a la persona de la izquierda. Cada quien se la pasa a su vecino de la izquierda, sin repetir ni corregir.
5. Responde el último de la cadena (el que estaba a la derecha de quien empezó), levantando la mano.
6. Gana el punto la primera mesa que diga la respuesta correcta. Si el último dice una palabra equivocada, esa mesa queda fuera de la ronda.

## Número de mesas

Se ingresa durante la presentación, en el paso `mesas` (antes de la primera pregunta). No está en los datos.

- `+` y `-` (y también `↑`/`↓` del teclado numérico) cambian el número de mesas. Mínimo 2, máximo 12, por defecto 6.
- El número se guarda en `localStorage` (`hermes.tables`). Al cambiarlo, el marcador se ajusta: las mesas nuevas empiezan en cero y las que sobran se descartan.
- El paso `mesas` muestra el número grande en pantalla y el marcador en vista previa.

## Teclas

| Tecla | Acción |
|---|---|
| Espacio o → | Avanza la fase: pregunta → opciones ocultas → respuesta |
| 1 a 9, 0 | Suma un punto a la mesa 1 a 9, y la 10 con `0` |
| Clic en una mesa del marcador | Suma un punto (Shift + clic resta). Es la única forma para las mesas 11 y 12 |
| Shift + 1 a 9, 0 | Resta un punto a esa mesa |
| `+` / `-` | Cambia el número de mesas (solo en el paso `mesas`) |
| R | Cambia la pregunta actual por la de reserva (Hermas) |
| Shift + Backspace dos veces en menos de 2 s | Reinicia el marcador |

El marcador se guarda en `localStorage` (`hermes.quiz`), así que sobrevive a recargas y a retroceder.

## Configuración

- Las preguntas y sus opciones están en `src/data/scenes.ts` y en el guion de la escena 10.

## Si se equivocan

Si sumas un punto a la mesa equivocada, usa Shift + dígito para restarlo.
