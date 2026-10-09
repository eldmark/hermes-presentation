// Lógica pura de la escena 10 (sin React ni three).
import { addPoint, clampTables, resizeScores, tableFromKey } from '../../presentation/quizState'
import type { QuizState } from '../../presentation/quizState'
import type { Vec3 } from '../../data/types'

export interface KeyLike { code: string; key: string; shiftKey: boolean }

export const RESET_WINDOW_MS = 2000
export const SEATS = 5

/** Puntuar solo desde la primera pregunta hasta el cierre. */
export function scoringActive(beatId: string): boolean {
  return beatId === 'cierre' || /^q\d+-(pregunta|cadena|respuesta)$/.test(beatId)
}

export interface KeyOutcome { state: QuizState; flash?: number }

/** Dígito de mesa 1..10 (1-indexado) o null. Acepta Digit y Numpad (este último solo con NumLock, es decir key = dígito). */
export function tableFromEvent(e: KeyLike): number | null {
  if (/^Digit\d$/.test(e.code)) return tableFromKey(e.code)
  const m = /^Numpad(\d)$/.exec(e.code)
  if (m && /^\d$/.test(e.key)) return tableFromKey(`Digit${m[1]}`)
  return null
}

/** +1 / -1 para cambiar el número de mesas, o 0. */
export function tablesDeltaFromEvent(e: KeyLike): 1 | -1 | 0 {
  if (e.code === 'NumpadAdd' || e.code === 'Equal' || e.key === '+') return 1
  if (e.code === 'NumpadSubtract' || e.code === 'Minus' || e.key === '-') return -1
  if (e.code === 'Numpad8' && e.key === 'ArrowUp') return 1
  if (e.code === 'Numpad2' && e.key === 'ArrowDown') return -1
  return 0
}

/**
 * Reductor de teclas del marcador. Devuelve null si la tecla no es suya.
 * Dígitos suman (Shift resta) en los pasos de pregunta y cierre; +/- cambian las mesas solo en `mesas`.
 */
export function reduceScoreKey(state: QuizState, e: KeyLike, beatId: string): KeyOutcome | null {
  const t = tableFromEvent(e)
  if (t !== null) {
    if (!scoringActive(beatId)) return null
    const idx = t - 1
    const scores = addPoint(state.scores, idx, e.shiftKey ? -1 : 1)
    if (scores === state.scores) return { state } // mesa inexistente
    return { state: { ...state, scores }, flash: idx }
  }
  if (beatId === 'mesas') {
    const d = tablesDeltaFromEvent(e)
    if (d !== 0) return { state: setTables(state, state.tables + d) }
  }
  return null
}

export function setTables(state: QuizState, n: number): QuizState {
  const tables = clampTables(n)
  return { tables, scores: resizeScores(state.scores, tables) }
}

/** Clic en una fila del marcador: +1, o −1 con Shift. */
export function clickScore(state: QuizState, table: number, delta: 1 | -1): KeyOutcome {
  const scores = addPoint(state.scores, table, delta)
  return scores === state.scores ? { state } : { state: { ...state, scores }, flash: table }
}

export function resetScores(state: QuizState): QuizState {
  return { tables: state.tables, scores: state.scores.map(() => 0) }
}

/** Confirmación de reinicio: la segunda pulsación en menos de RESET_WINDOW_MS reinicia. */
export function resetStep(lastAt: number | null, now: number, windowMs = RESET_WINDOW_MS): { reset: boolean; lastAt: number | null } {
  if (lastAt !== null && now - lastAt < windowMs) return { reset: true, lastAt: null }
  return { reset: false, lastAt: now }
}

/** Pregunta de reserva: `swapped` = índice (0-indexado) de la pregunta que se cambió, o null. Solo se puede una vez. */
export function canSwapReserve(swapped: number | null, quiz: { q: number; phase: string } | undefined): boolean {
  return swapped === null && !!quiz && quiz.phase !== 'revealed'
}
export function swapReserve(swapped: number | null, quiz: { q: number; phase: string } | undefined): number | null {
  return canSwapReserve(swapped, quiz) ? quiz!.q - 1 : swapped
}
/** ¿La pregunta n (1-indexada) usa la reserva? */
export function usesReserve(swapped: number | null, q: number): boolean {
  return swapped === q - 1
}

// ---------------------------------------------------------------- 3D (datos puros)

export interface Stage3D {
  cards: number        // 0..1 tarjetas de color sobre la mesa
  hand0: boolean       // quien inicia levanta la mano
  hand4: boolean       // el último levanta la mano
  chain: number        // 0..1 recorrido de la línea
  orb: 'none' | 'follow' | 'loop'
  deform: boolean      // el mensaje se deforma
  ring: boolean        // aro dorado (punto ganado)
  network: boolean     // red de conexiones encendida
  away: boolean        // Hermes se va con la carta
}

export function stageFor(id: string): Stage3D {
  const s: Stage3D = { cards: 0, hand0: false, hand4: false, chain: 0, orb: 'none', deform: false, ring: false, network: false, away: false }
  const r = /^reglas-(\d)$/.exec(id)
  if (r) {
    const n = Number(r[1])
    s.cards = n <= 2 ? 1 : 0
    s.hand0 = n === 2 || n === 3
    s.hand4 = n === 5 || n === 6
    s.chain = n >= 4 ? 1 : 0
    s.orb = n === 4 ? 'follow' : 'none'
    s.ring = n === 6
    return s
  }
  if (id === 'demo') return { ...s, chain: 1, orb: 'loop', deform: true, hand4: true }
  if (id === 'cierre') return { ...s, chain: 1, ring: true, network: true, away: true }
  const q = /^q\d+-(pregunta|cadena|respuesta)$/.exec(id)
  if (q) {
    if (q[1] === 'pregunta') return { ...s, cards: 1 }
    if (q[1] === 'cadena') return { ...s, chain: 1, orb: 'loop' }
    return { ...s, cards: 1, ring: true }
  }
  return s
}

export const TABLE_R = 2.2
export const SEAT_R = 3.5
export const LINE_R = 2.75

/** Ángulo del asiento i: 0 = abajo en pantalla; la cadena avanza hacia la izquierda de cada persona. */
export const seatAngle = (i: number) => (-i * 2 * Math.PI) / SEATS
export const polar = (a: number, r: number, y = 0): Vec3 => [r * Math.sin(a), y, r * Math.cos(a)]

/** Camino desde el asiento 0 hasta el 4 pasando por los demás (hacia la izquierda). */
export function chainPath(r = LINE_R, y = 0.7, perSeg = 14): Vec3[] {
  const pts: Vec3[] = []
  const total = (SEATS - 1) * perSeg
  for (let k = 0; k <= total; k++) pts.push(polar((-(k / perSeg) * 2 * Math.PI) / SEATS, r, y))
  return pts
}

type S = { pos: Vec3; look: Vec3 }
const TOP = (look: Vec3 = [0, 0, 0], h = 11): S => ({ pos: [look[0], h, look[2] + 4], look })

/** Un shot por id de paso (coordenadas locales). */
export function shotFor(id: string): S {
  if (id === 'intro') return { pos: [5.5, 3, 10], look: [4, 1.2, 2] }
  const r = /^reglas-(\d)$/.exec(id)
  if (r) {
    const n = Number(r[1])
    if (n === 2 || n === 3) return TOP([-0.8, 0, 2], 12)
    if (n === 5) return TOP([1.5, 0, 2], 12.5)
    return TOP([0, 0, 2], 12.5)
  }
  if (id === 'demo') return TOP([0, 0, 2], 13)
  if (id === 'mesas') return { pos: [0, 7, 10], look: [0, 0.5, 0] }
  if (id === 'cierre') return { pos: [0, 7.5, 7], look: [0, 2.5, -6] }
  const q = /^q(\d+)-(pregunta|cadena|respuesta)$/.exec(id)
  if (q) {
    const dx = (Number(q[1]) - 3) * 0.5
    const h = q[2] === 'cadena' ? 9 : 8.5
    return { pos: [dx, h, 8], look: [0, 0.3, 0] }
  }
  return TOP()
}
