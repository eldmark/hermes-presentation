// Lógica pura del marcador de la actividad (sin React).
export interface QuizState { tables: number; scores: number[] }

export const MIN_TABLES = 2
export const MAX_TABLES = 12
export const DEFAULT_TABLES = 6
export const TABLES_KEY = 'hermes.tables'
export const QUIZ_KEY = 'hermes.quiz'

export function clampTables(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_TABLES
  return Math.min(MAX_TABLES, Math.max(MIN_TABLES, Math.round(n)))
}

/** Ajusta la longitud: mesas nuevas en 0, sobrantes descartadas. */
export function resizeScores(scores: number[], tables: number): number[] {
  return Array.from({ length: tables }, (_, i) => scores[i] ?? 0)
}

/** Suma `delta` a la mesa `table` (0-indexada); nunca baja de 0. Devuelve un arreglo nuevo. */
export function addPoint(scores: number[], table: number, delta: number): number[] {
  if (!Number.isInteger(table) || table < 0 || table >= scores.length) return scores
  return scores.map((s, i) => (i === table ? Math.max(0, s + delta) : s))
}

/** Digit1..Digit9 → número de mesa 1..9; Digit0 → 10 (1-indexado; restar 1 para el índice). Otro → null. */
export function tableFromKey(code: string): number | null {
  const m = /^Digit(\d)$/.exec(code)
  if (!m) return null
  const d = Number(m[1])
  return d === 0 ? 10 : d
}

type Store = Pick<Storage, 'getItem' | 'setItem'>
function store(): Store | null {
  try { return typeof localStorage === 'undefined' ? null : localStorage } catch { return null }
}

export function loadQuizState(s: Store | null = store()): QuizState {
  let tables = DEFAULT_TABLES
  let raw: unknown = []
  try {
    const t = s?.getItem(TABLES_KEY)
    if (t != null) tables = clampTables(Number(t))
    const q = s?.getItem(QUIZ_KEY)
    if (q != null) raw = JSON.parse(q)
  } catch { /* almacenamiento no disponible o JSON dañado */ }
  const arr = Array.isArray(raw) ? raw.map((v) => (typeof v === 'number' && v >= 0 ? Math.floor(v) : 0)) : []
  return { tables, scores: resizeScores(arr, tables) }
}

export function saveQuizState(state: QuizState, s: Store | null = store()): void {
  try {
    s?.setItem(TABLES_KEY, String(state.tables))
    s?.setItem(QUIZ_KEY, JSON.stringify(state.scores))
  } catch { /* ignorar */ }
}
