import type { SceneId } from '../data/types'

/** Cielo y niebla de cada escena. La niebla toma el color del cielo para que lo lejano se funda con él. */
export interface Atmosphere { sky: string; near: number; far: number }

export const ATMOSPHERE: Record<SceneId, Atmosphere> = {
  puertas:     { sky: '#a9c9e8', near: 90,  far: 420 },
  cueva:       { sky: '#a9c9e8', near: 70,  far: 360 },
  zeus:        { sky: '#c8d3df', near: 90,  far: 380 },
  apolo:       { sky: '#a9c9e8', near: 90,  far: 380 },
  calipso:     { sky: '#9ccdf0', near: 90,  far: 400 },
  circe:       { sky: '#9a8f70', near: 60,  far: 300 },
  almas:       { sky: '#1b2236', near: 50,  far: 320 },
  caminos:     { sky: '#a9c9e8', near: 90,  far: 400 },
  hoy:         { sky: '#bcd0e6', near: 120, far: 460 },
  conceptos:   { sky: '#bcd6ee', near: 90,  far: 400 },
  actividad:   { sky: '#e0d5bf', near: 120, far: 460 },
  referencias: { sky: '#e8dcc3', near: 120, far: 460 },
}

/** Mezcla `a` hacia `b` (colores #rrggbb) en la proporción t. Pura, para poder probarla. */
export function mixHex(a: string, b: string, t: number): string {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const [ar, ag, ab] = p(a)
  const [br, bg, bb] = p(b)
  const m = (x: number, y: number) => Math.round(x + (y - x) * Math.min(1, Math.max(0, t)))
  const hex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${hex(m(ar!, br!))}${hex(m(ag!, bg!))}${hex(m(ab!, bb!))}`
}

/** Cielo propio de algunos pasos (por id de escena y de paso); si no hay, vale el de la escena. */
export const BEAT_SKY: Partial<Record<SceneId, Record<string, string>>> = {
  apolo: {
    robo: '#e89a6a', 'robo-huellas': '#e89a6a', investigacion: '#f0c0b8',
    'cuna-finge': '#2a2a4a', 'ante-zeus': '#2a2a4a', devolucion: '#f0b080', 'lira-acuerdo': '#f4d890',
  },
  almas: { itaca: '#6f84a8', 'almas-siguen': '#3a4666' },
}

export function skyFor(id: SceneId, beatId: string): string {
  return BEAT_SKY[id]?.[beatId] ?? ATMOSPHERE[id].sky
}
