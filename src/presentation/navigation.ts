// Reducer puro {scene, beat}. `scene` es 0-indexado; en el hash la escena es 1-indexada.
export interface NavState { scene: number; beat: number }
export type NavAction =
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'home' }
  | { type: 'goto'; scene: number; beat: number }

/** counts[i] = número de pasos de la escena i. */
export function navigate(state: NavState, action: NavAction, counts: readonly number[]): NavState {
  const last = counts.length - 1
  switch (action.type) {
    case 'next':
      if (state.beat < counts[state.scene] - 1) return { scene: state.scene, beat: state.beat + 1 }
      if (state.scene < last) return { scene: state.scene + 1, beat: 0 }
      return state
    case 'prev':
      if (state.beat > 0) return { scene: state.scene, beat: state.beat - 1 }
      if (state.scene > 0) return { scene: state.scene - 1, beat: counts[state.scene - 1] - 1 }
      return state
    case 'home':
      return { scene: 0, beat: 0 }
    case 'goto': {
      const scene = Math.min(Math.max(Math.trunc(action.scene) || 0, 0), last)
      const beat = Math.min(Math.max(Math.trunc(action.beat) || 0, 0), counts[scene] - 1)
      return { scene, beat }
    }
  }
}

export function formatHash(s: NavState): string {
  return `#/p/${s.scene + 1}/${s.beat}`
}

/** Devuelve null si el hash no es `#/p/N/M`. Fuera de rango se ajusta a los límites. */
export function parseHash(hash: string, counts: readonly number[]): NavState | null {
  const m = /^#\/p\/(\d+)(?:\/(\d+))?\/?$/.exec(hash)
  if (!m) return null
  return navigate({ scene: 0, beat: 0 }, { type: 'goto', scene: Number(m[1]) - 1, beat: Number(m[2] ?? 0) }, counts)
}
