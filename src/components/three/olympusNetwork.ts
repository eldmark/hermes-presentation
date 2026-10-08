import type { Vec3 } from '../../data/types'

export interface NetworkData {
  nodes: Record<string, Vec3>
  links: [string, string][]
}

/**
 * Red del recorrido, idéntica en escenas 1, 9 y 10 (única fuente).
 * Layout: Olimpo arriba al fondo; mundo mítico a la izquierda, Odisea al centro,
 * mundo humano (Grecia, Roma) a la derecha. X ancho, Y altura, Z profundidad.
 */
export const OLYMPUS_NETWORK: NetworkData = {
  nodes: {
    olimpo: [0, 3.5, -4],
    'cueva-maia': [-6, 1, -1],
    'sala-zeus': [-3, 2.5, -3],
    pastos: [-6, 0, 2],
    'isla-calipso': [-1.5, 0, 2],
    'casa-circe': [2, 0, 2.5],
    ithaca: [5, 0.5, 1],
    hades: [1, -2.5, -1],
    'ciudad-griega': [4.5, 1.5, -2],
    roma: [7.5, 1, -3],
  },
  links: [
    ['olimpo', 'sala-zeus'],
    ['olimpo', 'cueva-maia'],
    ['cueva-maia', 'pastos'],
    ['sala-zeus', 'isla-calipso'],
    ['isla-calipso', 'casa-circe'],
    ['casa-circe', 'hades'],
    ['casa-circe', 'ithaca'],
    ['hades', 'olimpo'],
    ['ithaca', 'ciudad-griega'],
    ['ciudad-griega', 'roma'],
  ],
}
