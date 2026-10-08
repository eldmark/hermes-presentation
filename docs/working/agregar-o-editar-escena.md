# Agregar o editar una escena

1. Edita los pasos de la escena en `src/data/scenes.ts` (un `Beat` por clic).
2. Crea `src/scenes/SNNNombre.tsx` con su `default export` y un arreglo `shots` (uno por paso; si falta, se usa el último).
3. Registra la escena y su `offset` en `src/presentation/registry.ts`.
4. Calcula lo visible desde `beat` con `useDamp`, por ejemplo `useDamp(beat >= 2 ? 1 : 0)`.
5. Verifica abriendo `#/p/N/0`: recorre con → y regresa con ←. El estado visual debe revertirse y la consola quedar limpia.

## Plantilla mínima

```tsx
import type { SceneProps, Shot } from '../presentation/types'

export const shots: Shot[] = [
  { pos: [0, 2, 8], look: [0, 1, 0] },
]

export default function S99Ejemplo({ beat }: SceneProps) {
  return (
    <mesh position={[0, 1, 0]}>
      <boxGeometry />
      <meshStandardMaterial color={beat > 0 ? 'gold' : 'gray'} />
    </mesh>
  )
}
```

## Reglas

- No dupliques componentes: si algo se repite en dos escenas, va a `src/components/`.
- Las interacciones del público son un paso más; el clic con el mouse es opcional y nunca el único camino.
