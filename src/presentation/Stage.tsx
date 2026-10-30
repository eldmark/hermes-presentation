import { Suspense, useEffect, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { SCENES } from '../data/scenes'
import { SceneActiveContext } from './keys'
import { REGISTRY } from './registry'

const FLIGHT_MS = 3200 // tiempo que sigue visible la escena anterior mientras la cámara vuela

const frames = (n: number) =>
  new Promise<void>((resolve) => {
    let k = 0
    const tick = () => (++k >= n ? resolve() : requestAnimationFrame(tick))
    requestAnimationFrame(tick)
  })

/**
 * Monta todas las escenas, cada una en su offset, para que los modelos ya estén cargados.
 * Pero solo se ven la actual y, durante el vuelo de cámara, la anterior: así no se cuelan elementos de escenas
 * vecinas ni se suman sus luces.
 */
export function Stage({ scene, beat, onReady }: { scene: number; beat: number; onReady?: () => void }) {
  const { gl, scene: three, camera } = useThree()
  const [warm, setWarm] = useState<number[] | null>(null)
  const prev = useRef(scene)
  const [from, setFrom] = useState<number | null>(null)
  useEffect(() => {
    if (prev.current === scene) return
    setFrom(prev.current)
    prev.current = scene
    const t = setTimeout(() => setFrom(null), FLIGHT_MS)
    return () => clearTimeout(t)
  }, [scene])

  // Precalentamiento: antes de empezar se muestra cada escena sola y cada par de escenas contiguas (lo que se ve durante
  // un vuelo de cámara), y se compilan los shaders de cada combinación de luces. Así ningún cambio de escena compila nada.
  useEffect(() => {
    if (navigator.webdriver && !location.search.includes('precarga')) {
      onReady?.()
      return
    }
    let cancelled = false
    ;(async () => {
      await frames(4)
      for (let i = 0; i < SCENES.length && !cancelled; i++) {
        for (const set of i > 0 ? [[i], [i - 1, i]] : [[i]]) {
          setWarm(set)
          await frames(2)
          try {
            await gl.compileAsync(three, camera)
          } catch {
            /* sin compilación asíncrona: se compilará al primer uso */
          }
        }
      }
      if (cancelled) return
      setWarm(null)
      await frames(2)
      onReady?.()
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {SCENES.map((data, i) => {
        const { component: Scene, offset } = REGISTRY[data.id]
        const active = i === scene
        const b = active ? beat : i < scene ? data.beats.length - 1 : 0
        return (
          <group key={data.id} position={offset} visible={warm ? warm.includes(i) : active || i === from}>
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
