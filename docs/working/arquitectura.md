# Arquitectura

## Flujo

```
src/data/scenes.ts  ──►  navigation.ts (reducer {scene, beat} + hash)
                              │
              ┌───────────────┼────────────────┐
              ▼               ▼                ▼
          Stage          CameraRig          Overlay
   (monta escena ±1)  (vuela a shots[beat])  (textos DOM)
              │
              ▼
        src/scenes/SNN*.tsx   (estado derivado de `beat`)
```

`/script` lee los mismos datos, sin importar three ni react-three.

## Decisiones

- **Ruta por hash.** `#/script` y `#/p/4/2` (escena 4, paso 2). GitHub Pages no sirve rutas reales sin trucos, y con hash no hace falta router. Recargar conserva la posición.
- **Carga diferida.** La presentación y `/script` son chunks separados, así el celular no descarga three.js.
- **Un paso por clic.** Las subsecciones del guion (4.1 a 4.6, etc.) se parten en 2 a 4 pasos (`Beat`).
- **Estado derivado del paso.** Todo lo visible se calcula desde `beat` (por ejemplo `useDamp(beat >= 2 ? 1 : 0)`). Retroceder y recargar funcionan sin código extra.
- **Mundo como recorrido.** Cada escena tiene un `offset` en `registry.ts`, separadas unas 150 unidades, con niebla. La cámara vuela de una a otra pasando por un punto elevado.
- **Montaje ±1.** Solo se montan la escena actual y sus vecinas.
- **Cámara amortiguada.** `CameraRig` toma `shots[beat] + offset` y amortigua posición y `lookAt` con `maath/easing`.
- **Sin recursos externos.** Fuentes, modelos y decodificadores están en el repositorio.

## Teclado

| Tecla | Acción |
|---|---|
| → ↓ Espacio PageDown Enter | Avanzar |
| ← ↑ PageUp | Retroceder |
| Home | Ir al inicio |
| F | Pantalla completa |
| H | Mostrar u ocultar el HUD |
| B o . | Pantalla negra |
| D | Depuración de cámara (solo en dev) |

Los controles de presentación suelen mandar PageUp, PageDown, flechas, `.` o `B`. Una escena puede registrar teclas propias con `useSceneKeys`, activo solo cuando la escena está activa (lo usa la escena 10).

## Contrato de datos

Ver `src/data/types.ts`: `SceneData`, `Beat`, `Line`, `QuizQuestion`. El componente 3D de cada escena no va en los datos; `registry.ts` lo asocia por `id`.
