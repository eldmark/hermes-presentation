import type { SceneData, Vec3 } from '../data/types'

export type Shot = { pos: Vec3; look: Vec3 } // coordenadas LOCALES de la escena
export interface SceneProps { data: SceneData; beat: number; beatId: string; active: boolean }
