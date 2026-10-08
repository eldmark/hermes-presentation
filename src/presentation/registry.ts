import { lazy, useEffect, useState } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'
import type { SceneId, Vec3 } from '../data/types'
import type { SceneProps, Shot } from './types'

interface SceneModule { default: ComponentType<SceneProps>; shots?: Shot[] }
interface Entry {
  load: () => Promise<SceneModule>
  component: LazyExoticComponent<ComponentType<SceneProps>>
  offset: Vec3
}

const SPACING = 150
function entry(index: number, load: () => Promise<SceneModule>): Entry {
  return { load, component: lazy(load), offset: [index * SPACING, 0, 0] }
}

export const REGISTRY: Record<SceneId, Entry> = {
  puertas: entry(0, () => import('../scenes/S01Puertas')),
  cueva: entry(1, () => import('../scenes/S02Cueva')),
  zeus: entry(2, () => import('../scenes/S03Zeus')),
  apolo: entry(3, () => import('../scenes/S04Apolo')),
  calipso: entry(4, () => import('../scenes/S05Calipso')),
  circe: entry(5, () => import('../scenes/S06Circe')),
  almas: entry(6, () => import('../scenes/S07Almas')),
  caminos: entry(7, () => import('../scenes/S08Caminos')),
  hoy: entry(8, () => import('../scenes/S09Hoy')),
  actividad: entry(9, () => import('../scenes/S10Actividad')),
}

const shotsCache = new Map<SceneId, Shot[]>()

/** Los shots de una escena (carga el módulo si hace falta; undefined mientras tanto). */
export function useShots(id: SceneId): Shot[] | undefined {
  const [shots, setShots] = useState(shotsCache.get(id))
  useEffect(() => {
    const cached = shotsCache.get(id)
    if (cached) { setShots(cached); return }
    let cancelled = false
    void REGISTRY[id].load().then((m) => {
      const s = m.shots ?? []
      shotsCache.set(id, s)
      if (!cancelled) setShots(s)
    })
    return () => { cancelled = true }
  }, [id])
  return shots
}
