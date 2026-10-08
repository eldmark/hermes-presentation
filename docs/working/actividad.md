# Actividad: el mensaje que no debe cambiar

Fuente del guion: `script/escena-10-actividad-telefono-descompuesto.md`.

## Reglas (como se proyectan)

1. Se muestra la pregunta con cuatro opciones.
2. Quien sabe la respuesta levanta la mano y empieza la cadena.
3. Las opciones se ocultan: la respuesta solo viaja por voz.
4. Se susurra una sola vez, al oído, a la persona de la izquierda. Cada quien se la pasa a su vecino de la izquierda, sin repetir ni corregir.
5. Responde el último de la cadena (el que estaba a la derecha de quien empezó), levantando la mano.
6. Gana el punto la primera mesa que diga la respuesta correcta. Si el último dice una palabra equivocada, esa mesa queda fuera de la ronda.

## Teclas

| Tecla | Acción |
|---|---|
| Espacio o → | Avanza la fase: pregunta → opciones ocultas → respuesta |
| 1 a 9 | Suma un punto a esa mesa |
| Shift + 1 a 9 | Resta un punto a esa mesa |
| R | Cambia la pregunta actual por la de reserva (Hermas) |
| Shift + Backspace dos veces en menos de 2 s | Reinicia el marcador |

El marcador se guarda en `localStorage` (`hermes.quiz`), así que sobrevive a recargas y a retroceder.

## Configuración

- Número de mesas: `QUIZ.tables` en `src/data/scenes.ts` (6 por defecto; ajustar al salón).
- Las preguntas y sus opciones están en el mismo archivo y en el guion de la escena 10.

## Si se equivocan

Si sumas un punto a la mesa equivocada, usa Shift + dígito para restarlo.
