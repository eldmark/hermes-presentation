import { Suspense } from 'react'
import { SCENES } from '../data/scenes'
import { SceneActiveContext } from './keys'
import { REGISTRY } from './registry'

/** Monta la escena actual y sus vecinas (±1), cada una en su offset. */
export function Stage({ scene, beat }: { scene: number; beat: number }) {
  return (
    <>
      {SCENES.map((data, i) => {
        if (Math.abs(i - scene) > 1) return null
        const { component: Scene, offset } = REGISTRY[data.id]
        const active = i === scene
        const b = active ? beat : i < scene ? data.beats.length - 1 : 0
        return (
          <group key={data.id} position={offset}>
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
