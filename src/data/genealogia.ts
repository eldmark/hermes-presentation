// Árbol genealógico de Hermes: datos y layout puros (sin react ni three).
// Coordenadas en unidades de un viewBox de GEN_W x GEN_H; el SVG se escala al panel.

export type Generation = 'primordial' | 'titan' | 'olimpico'
export type Emphasis = 'focus' | 'high' | 'normal' | 'dim'

export interface GenNodeDef {
  id: string
  name: string
  sub?: string[]            // líneas del subtítulo (cursiva)
  gen: Generation
  row: number               // fila de arriba abajo (0..4)
  x: number
  emphasis: Emphasis
  group?: boolean           // nodo que agrupa varios personajes
  alias?: string            // nombre romano
}

export const GEN_W = 1000
export const GEN_H = 600
export const ROW_Y0 = 38
export const ROW_STEP = 112

export const GENERATION_LABELS: { gen: Generation; label: string }[] = [
  { gen: 'primordial', label: 'Primordiales' },
  { gen: 'titan', label: 'Titanes' },
  { gen: 'olimpico', label: 'Olímpicos' },
]

export const GEN_NODES: GenNodeDef[] = [
  { id: 'gaia', name: 'Gaia', sub: ['La Tierra'], gen: 'primordial', row: 0, x: 380, emphasis: 'normal' },
  { id: 'urano', name: 'Urano', sub: ['El Cielo'], gen: 'primordial', row: 0, x: 620, emphasis: 'normal' },
  { id: 'ceos', name: 'Ceos', gen: 'titan', row: 1, x: 130, emphasis: 'normal' },
  { id: 'crono', name: 'Crono', gen: 'titan', row: 1, x: 380, emphasis: 'normal' },
  { id: 'rea', name: 'Rea', gen: 'titan', row: 1, x: 620, emphasis: 'normal' },
  { id: 'japeto', name: 'Jápeto', gen: 'titan', row: 1, x: 880, emphasis: 'normal' },
  { id: 'leto', name: 'Leto', sub: ['Madre de Apolo', 'y Ártemis'], gen: 'titan', row: 2, x: 130, emphasis: 'dim' },
  { id: 'zeus', name: 'Zeus', sub: ['Rey del Olimpo'], gen: 'olimpico', row: 2, x: 490, emphasis: 'high' },
  { id: 'hermanos', name: 'Sus hermanos', sub: ['Hera, Poseidón,', 'Hades, Deméter,', 'Hestia'], gen: 'olimpico', row: 2, x: 695, emphasis: 'dim', group: true },
  { id: 'atlas', name: 'Atlas', sub: ['Sostiene', 'el cielo'], gen: 'titan', row: 2, x: 880, emphasis: 'dim' },
  { id: 'apolo', name: 'Apolo', sub: ['Hermano de Hermes', 'por parte de padre'], gen: 'olimpico', row: 4, x: 250, emphasis: 'high' },
  { id: 'maia', name: 'Maia', sub: ['Una de las', 'Pléyades'], gen: 'titan', row: 3.2, x: 880, emphasis: 'high' },
  { id: 'hermes', name: 'HERMES', gen: 'olimpico', row: 4, x: 600, emphasis: 'focus', alias: 'Mercurio' },
]

/** Cada hijo con sus padres (el amor de pareja se dibuja entre padres de la misma fila). */
export const GEN_LINKS: { parents: string[]; child: string }[] = [
  { parents: ['gaia', 'urano'], child: 'crono' },
  { parents: ['gaia', 'urano'], child: 'rea' },
  { parents: ['gaia', 'urano'], child: 'japeto' },
  { parents: ['gaia', 'urano'], child: 'ceos' },
  { parents: ['crono', 'rea'], child: 'zeus' },
  { parents: ['crono', 'rea'], child: 'hermanos' },
  { parents: ['japeto'], child: 'atlas' },
  { parents: ['ceos'], child: 'leto' },
  { parents: ['atlas'], child: 'maia' },
  { parents: ['zeus', 'maia'], child: 'hermes' },
  { parents: ['zeus', 'leto'], child: 'apolo' },
]

export interface LaidNode extends GenNodeDef {
  y: number
  r: number
  /** Cajas aproximadas del texto (para comprobar solapes): [x0, y0, x1, y1]. */
  box: [number, number, number, number]
  delayGroup: number        // 0..4: orden de aparición (por generaciones)
}

export interface LaidEdge {
  from: string[]
  to: string
  path: string              // trazo SVG
  couple?: [number, number, number, number] // línea de pareja
  hot: boolean              // enlace del linaje de Hermes
}

export const NODE_R: Record<Emphasis, number> = { focus: 34, high: 22, normal: 18, dim: 17 }
export const FONT = { name: 31, nameFocus: 40, sub: 21 }
const CHAR_W = 0.62 // ancho medio de un carácter, en em, tomado del lado seguro

const textW = (s: string, size: number) => s.length * size * CHAR_W

export function layoutGenealogy(): { nodes: LaidNode[]; edges: LaidEdge[] } {
  const nodes: LaidNode[] = GEN_NODES.map((n) => {
    const y = ROW_Y0 + n.row * ROW_STEP
    const r = NODE_R[n.emphasis]
    const nameSize = n.emphasis === 'focus' ? FONT.nameFocus : FONT.name
    const nameY = y + r + nameSize * 0.95
    const lines = n.sub?.length ?? 0
    const w = Math.max(textW(n.name, nameSize), ...(n.sub ?? []).map((s) => textW(s, FONT.sub) * 0.9))
    let x1 = n.x + w / 2
    if (n.alias) x1 = Math.max(x1, n.x + r + 14 + textW(n.alias, 24))
    const bottom = nameY + 8 + lines * (FONT.sub + 4)
    return { ...n, y, r, box: [n.x - w / 2, y - r, x1, bottom], delayGroup: Math.floor(n.row) }
  })
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const hot = new Set(['zeus>hermes', 'maia>hermes', 'zeus>apolo', 'leto>apolo'])
  const edges: LaidEdge[] = GEN_LINKS.map(({ parents, child }) => {
    const c = byId.get(child)!
    const ps = parents.map((p) => byId.get(p)!)
    const top = c.y - c.r
    const curve = (sx: number, sy: number) => {
      const my = sy + (top - sy) * 0.55
      return `M${sx} ${sy} C${sx} ${my} ${c.x} ${top - (top - sy) * 0.55} ${c.x} ${top}`
    }
    const sameRow = ps.length === 2 && ps[0].row === ps[1].row
    if (sameRow) {
      const [a, b] = ps
      const mx = (a.x + b.x) / 2
      return { from: parents, to: child, path: curve(mx, a.y), couple: [a.x + a.r, a.y, b.x - b.r, b.y], hot: false }
    }
    const path = ps.map((p) => curve(p.x, p.y + p.r)).join(' ')
    return { from: parents, to: child, path, hot: parents.some((p) => hot.has(`${p}>${child}`)) }
  })
  return { nodes, edges }
}
