# Guía de exposición

## Quién dice qué

El reparto está en [`src/data/reparto.ts`](../../src/data/reparto.ts) y se ve en el celular, en `#/script`, con el filtro **Persona 1 / 2 / 3** (las líneas de las otras personas se atenúan). Se puede cambiar sin tocar el guion.

| # | Escena | Persona 1 | Persona 2 | Persona 3 |
|---|---|---|---|---|
| 1 | Las puertas del Olimpo | 47 | 21 (voz de Hermes) | · |
| 2 | La cueva de Maia | 134 | · | · |
| 3 | El mensaje de Zeus | 99 (incluye la voz de Zeus) | · | · |
| 4 | Hermes y Apolo | 255 | · | · |
| 5 | La isla de Calipso | · | 193 (incluye la voz de Hermes) | 17 (voz de Calipso) |
| 6 | Lo que Hermes sabía de Circe | · | 111 | · |
| 7 | Hermes, guía de las almas | · | 213 | · |
| 8 | Los caminos de Hermes y Mercurio | · | · | 215 |
| 9 | Lo que queda de Hermes | · | · | 219 |
| 10 | Seis ideas para pensar a Hermes | 120 | 81 | 103 |
| 11 | El mensaje que no debe cambiar | 55 | 109 | 208 |
| 12 | Referencias | 15 | · | · |
| | **Total (palabras)** | **725** | **728** | **762** |

Cada persona habla unos **5,6 a 5,9 minutos** (a 130 palabras por minuto, sin pausas). En total son **unos 17 minutos de voz**, sin contar las animaciones, la interacción con el público ni el tiempo de la actividad. Si el límite es de 15 minutos, hay que recortar unos 3 a 5 minutos de texto tras el primer ensayo.

### Cómo se reparte

- **Persona 1** abre y lleva el origen del mito: escenas 1 a 4 (puertas, cueva de Maia con la genealogía, mensaje de Zeus, Apolo y el robo). También abre «Seis ideas» (*mêtis* y *díkē*), pregunta 1 y 4 de la actividad, y despide la exposición con las referencias.
- **Persona 2** lleva el viaje de Odiseo: escenas 5, 6 y 7 (Calipso, Circe y el guía de almas). Dice *eleuthería* y *moira*, presenta la actividad y sus primeras reglas, y lleva las preguntas 2 y 5.
- **Persona 3** lleva el contexto histórico y el cierre: escenas 8 y 9 (Grecia y Roma, lo que queda de Hermes). Dice *areté* y *gnôsis*, cierra «Seis ideas», explica las reglas 4 a 6, la demostración, la pregunta 3 y el cierre de la actividad.
- **Voces de personajes** (fijas, para que se reconozcan): Hermes lo dice la Persona 2, Zeus la Persona 1 y Calipso la Persona 3.

Para mover una línea o un paso, edita `ESCENA`, `PASOS` o `VOZ` en `reparto.ts`.

## Teclas para quien presenta

- Avanzar: `→` o `Espacio` (o el botón del control de presentación). Retroceder: `←`.
- `F`: pantalla completa. `B`: pantalla negra. `H`: mostrar el HUD con escena, paso y cronómetro.
- En la actividad: `1`–`9` y `0` suman punto a esa mesa; `+` y `-` cambian el número de mesas; `R` cambia a la pregunta de reserva. Ver [`actividad.md`](actividad.md).

## En el proyector (build local)

El plan es presentar desde el **build local**, sin depender de internet:

```bash
bun run presentar        # compila y sirve en http://127.0.0.1:4173/
```

Abre esa dirección en el navegador, pon pantalla completa con `F`, y listo. Para ensayar sin compilar cada vez: `bun run dev`.

Si quieren leer el guion en los celulares (`#/script`) desde la misma red wifi, usen `bun run presentar:red`: sirve en todas las interfaces y la dirección para los celulares es `http://<IP-de-la-laptop>:4173/#/script` (la IP se ve con `ip -4 addr`). Es opcional: la presentación no necesita red.

**La resolución se adapta sola**:
- El lienzo ocupa toda la pantalla y se reajusta si cambias de resolución o de pantalla.
- En proyectores 16:9 la composición es la prevista. En 4:3 o 16:10 el campo de visión vertical se amplía para no recortar los lados.
- Si el equipo va justo de fps, la resolución de render baja sola de 1,5× a 1× y vuelve a subir si se recupera.
- Los textos se miden con el ancho de la pantalla y mantienen un mínimo legible.
- El cursor se oculta tras unos segundos sin moverlo.

## Lista de verificación del día

- [ ] Conectar el proyector y poner la **pantalla duplicada o extendida** como se vaya a usar; probar la resolución real.
- [ ] `bun run presentar` y abrir `http://127.0.0.1:4173/` en pantalla completa (`F`).
- [ ] Probar el control de presentación (qué teclas manda) y que avance y retroceda.
- [ ] Recorrer la presentación una vez completa, de la escena 1 a la 12, para que los modelos queden en memoria.
- [ ] Abrir `#/script` en los celulares de las tres personas (con `bun run presentar:red` y la IP de la laptop; o llevar el guion impreso) y desactivar el bloqueo de pantalla.
- [ ] Marcador a cero y número de mesas del salón decidido.
- [ ] Cargador conectado y modo de ahorro de energía desactivado.

## Plan B

- Si falla el proyector o la pantalla completa, presentar desde la pantalla de la laptop.
- Si va lento: `H` muestra el HUD; bajar la resolución de la ventana del navegador mejora los fps.
- Si falla el control de presentación, avanzar con `Espacio`.

## Ensayo

1. Primera pasada completa con el cronómetro del HUD (`H`) y anotar el tiempo de cada escena.
2. Recortar texto en `src/data/scenes.ts` donde sobre tiempo (las escenas 4, 5, 7, 8 y 9 son las más largas).
3. Segunda pasada con los cambios de turno exactos entre personas.
4. Probar la actividad con el salón real o con personas del mismo tamaño de mesas.

## Pendientes de contenido

- Verificar en las ediciones impresas que las citas y los números de verso sean los usados en clase (ver la pantalla de referencias).
