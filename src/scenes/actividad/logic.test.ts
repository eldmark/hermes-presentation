import { describe, expect, test } from 'bun:test'
import { SCENES } from '../../data/scenes'
import {
  canSwapReserve, chainPath, clickScore, reduceScoreKey, resetScores, resetStep, shotFor, stageFor, swapReserve, usesReserve,
} from './logic'

const k = (code: string, shiftKey = false, key = '') => ({ code, key, shiftKey })
const st = { tables: 4, scores: [0, 1, 0, 0] }

describe('reduceScoreKey', () => {
  test('dígito suma y Shift resta (con flash)', () => {
    expect(reduceScoreKey(st, k('Digit1'), 'q1-respuesta')).toEqual({ state: { tables: 4, scores: [1, 1, 0, 0] }, flash: 0 })
    expect(reduceScoreKey(st, k('Digit2', true), 'q1-respuesta')).toEqual({ state: { tables: 4, scores: [0, 0, 0, 0] }, flash: 1 })
    expect(reduceScoreKey(st, k('Digit1', true), 'cierre')?.state.scores[0]).toBe(0)
  })
  test('mesa inexistente no cambia ni destella', () => {
    expect(reduceScoreKey(st, k('Digit9'), 'q1-cadena')).toEqual({ state: st })
  })
  test('Digit0 es la mesa 10', () => {
    const s = { tables: 10, scores: new Array(10).fill(0) }
    expect(reduceScoreKey(s, k('Digit0'), 'q2-cadena')?.flash).toBe(9)
  })
  test('Numpad con NumLock', () => {
    expect(reduceScoreKey(st, k('Numpad3', false, '3'), 'q1-cadena')?.flash).toBe(2)
    expect(reduceScoreKey(st, k('Numpad3', false, 'PageDown'), 'q1-cadena')).toBeNull()
  })
  test('no puntúa fuera de preguntas/cierre', () => {
    expect(reduceScoreKey(st, k('Digit1'), 'mesas')).toBeNull()
    expect(reduceScoreKey(st, k('Digit1'), 'intro')).toBeNull()
  })
  test('+/- solo en mesas, con límites y ajuste de marcador', () => {
    expect(reduceScoreKey(st, k('Equal', true, '+'), 'mesas')?.state).toEqual({ tables: 5, scores: [0, 1, 0, 0, 0] })
    expect(reduceScoreKey(st, k('Minus', false, '-'), 'mesas')?.state).toEqual({ tables: 3, scores: [0, 1, 0] })
    expect(reduceScoreKey({ tables: 2, scores: [0, 0] }, k('NumpadSubtract'), 'mesas')?.state.tables).toBe(2)
    expect(reduceScoreKey({ tables: 12, scores: new Array(12).fill(0) }, k('NumpadAdd'), 'mesas')?.state.tables).toBe(12)
    expect(reduceScoreKey(st, k('Minus', false, '-'), 'q1-pregunta')).toBeNull()
    expect(reduceScoreKey(st, k('Numpad8', false, 'ArrowUp'), 'mesas')?.state.tables).toBe(5)
  })
  test('no muta', () => {
    const s = { tables: 3, scores: [0, 0, 0] }
    reduceScoreKey(s, k('Digit1'), 'q1-cadena')
    expect(s.scores).toEqual([0, 0, 0])
  })
})

test('clic suma, Shift+clic resta, mesa 12', () => {
  const s = { tables: 12, scores: new Array(12).fill(0) }
  const a = clickScore(s, 11, 1)
  expect(a.state.scores[11]).toBe(1)
  expect(a.flash).toBe(11)
  expect(clickScore(a.state, 11, -1).state.scores[11]).toBe(0)
  expect(clickScore(s, 20, 1)).toEqual({ state: s })
})

test('resetScores conserva mesas', () => {
  expect(resetScores({ tables: 3, scores: [4, 5, 6] })).toEqual({ tables: 3, scores: [0, 0, 0] })
})

describe('resetStep', () => {
  test('primera pulsación avisa; la segunda en <2 s reinicia', () => {
    const a = resetStep(null, 1000)
    expect(a).toEqual({ reset: false, lastAt: 1000 })
    expect(resetStep(a.lastAt, 2500)).toEqual({ reset: true, lastAt: null })
  })
  test('pasados 2 s vuelve a avisar', () => {
    expect(resetStep(1000, 3000)).toEqual({ reset: false, lastAt: 3000 })
    expect(resetStep(1000, 3500).reset).toBe(false)
  })
})

describe('reserva', () => {
  test('solo una vez y no con la respuesta revelada', () => {
    const a = swapReserve(null, { q: 3, phase: 'shown' })
    expect(a).toBe(2)
    expect(swapReserve(a, { q: 4, phase: 'shown' })).toBe(2)
    expect(canSwapReserve(null, { q: 1, phase: 'revealed' })).toBe(false)
    expect(canSwapReserve(null, undefined)).toBe(false)
    expect(usesReserve(a, 3)).toBe(true)
    expect(usesReserve(a, 2)).toBe(false)
  })
})

describe('3D', () => {
  const beats = SCENES.find((s) => s.id === 'actividad')!.beats
  test('hay un shot por paso (25) y todos son finitos', () => {
    expect(beats.length).toBe(25)
    for (const b of beats) {
      const s = shotFor(b.id)
      expect([...s.pos, ...s.look].every(Number.isFinite)).toBe(true)
    }
  })
  test('estado por paso', () => {
    expect(stageFor('reglas-4').chain).toBe(1)
    expect(stageFor('reglas-3').cards).toBe(0)
    expect(stageFor('demo').deform).toBe(true)
    expect(stageFor('cierre').network).toBe(true)
    expect(stageFor('q2-pregunta').cards).toBe(1)
    expect(stageFor('intro').chain).toBe(0)
  })
  test('el camino llega al asiento 4 (a la derecha de quien empezó)', () => {
    const p = chainPath()
    const last = p[p.length - 1]
    expect(last[0]).toBeGreaterThan(0)
    expect(p[0][2]).toBeGreaterThan(2)
  })
})
