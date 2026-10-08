import { useEffect, useState } from 'react'
import { SCENES } from '../data/scenes'
import type { Beat, SceneData } from '../data/types'
import { Caption } from '../components/ui/Caption'
import { PlaceLabel } from '../components/ui/PlaceLabel'
import { WordReveal } from '../components/ui/WordReveal'

export const WORD_INTERVAL_MS = 700

/** Rótulo del paso, heredado: el último `label` definido en pasos 0..beatIndex de la escena. */
export function resolveLabel(scene: Pick<SceneData, 'beats'>, beatIndex: number): Beat['label'] | undefined {
  for (let i = Math.min(beatIndex, scene.beats.length - 1); i >= 0; i--) {
    const l = scene.beats[i].label
    if (l) return l
  }
  return undefined
}

/** Cuenta que sube de a 1 hasta `total`; se reinicia cuando cambia `resetKey`. */
function useCount(total: number, resetKey: string): number {
  const [state, setState] = useState({ key: resetKey, n: 0 })
  useEffect(() => {
    setState({ key: resetKey, n: 0 })
    if (total <= 0) return
    const id = setInterval(() => {
      setState((s) => (s.key === resetKey ? { key: s.key, n: Math.min(total, s.n + 1) } : s))
    }, WORD_INTERVAL_MS)
    return () => clearInterval(id)
  }, [resetKey, total])
  return state.key === resetKey ? state.n : 0
}

export function Overlay({ scene, beat }: { scene: number; beat: number }) {
  const s = SCENES[scene]
  const b = s.beats[beat]
  const words = Array.isArray(b.onScreen) ? b.onScreen : []
  const count = useCount(words.length, `${scene}:${beat}`)
  const label = resolveLabel(s, beat)
  return (
    <div className="overlay" aria-live="polite">
      <PlaceLabel place={label?.place} time={label?.time} />
      <div className="ov-center">
        {typeof b.onScreen === 'string' && <Caption text={b.onScreen} />}
        {Array.isArray(b.onScreen) && <WordReveal key={`${scene}:${beat}`} words={words} count={count} />}
      </div>
    </div>
  )
}
