import { Suspense, useEffect, useRef, useState } from 'react'
import { SCENES } from '../data/scenes'
import { SceneActiveContext } from './keys'
import { REGISTRY } from './registry'

const FLIGHT_MS = 3200 // tiempo que sigue visible la escena anterior mientras la cámara vuela

/**
 * Monta la escena actual y sus vecinas (±1), cada una en su offset, para que los modelos ya estén cargados.
 * Pero solo se ven la actual y, durante el vuelo de cámara, la anterior: así no se cuelan elementos de escenas
 * vecinas ni se suman sus luces.
 */
export function Stage({ scene, beat }: { scene: number; beat: number }) {
  const prev = useRef(scene)
  const [from, setFrom] = useState<number | null>(null)
  useEffect(() => {
    if (prev.current === scene) return
    setFrom(prev.current)
    prev.current = scene
    const t = setTimeout(() => setFrom(null), FLIGHT_MS)
    return () => clearTimeout(t)
  }, [scene])
  return (
    <>
      {SCENES.map((data, i) => {
        if (Math.abs(i - scene) > 1) return null
        const { component: Scene, offset } = REGISTRY[data.id]
        const active = i === scene
        const b = active ? beat : i < scene ? data.beats.length - 1 : 0
        return (
          <group key={data.id} position={offset} visible={active || i === from}>
            <SceneActiveContext.Provider value={active}>
              <Suspense fallback={null}>
                <Scene data={data} beat={b} beatId={data.beats[b].id} active={active} />
              </Suspense>
            </SceneActiveContext.Provider>
          </group>
        )
      })}
    </>
  )
}
