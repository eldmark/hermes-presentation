import { describe, expect, test } from 'bun:test'
import { addPoint, clampTables, loadQuizState, resizeScores, saveQuizState, tableFromKey } from './quizState'

const mem = () => {
  const m = new Map<string, string>()
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) }
}

describe('quizState', () => {
  test('clampTables', () => {
    expect(clampTables(1)).toBe(2)
    expect(clampTables(99)).toBe(12)
    expect(clampTables(5)).toBe(5)
    expect(clampTables(NaN)).toBe(6)
  })
  test('resizeScores', () => {
    expect(resizeScores([1, 2], 4)).toEqual([1, 2, 0, 0])
    expect(resizeScores([1, 2, 3], 2)).toEqual([1, 2])
  })
  test('addPoint no baja de 0 y no muta', () => {
    const s = [0, 2]
    expect(addPoint(s, 0, -1)).toEqual([0, 2])
    expect(addPoint(s, 1, 1)).toEqual([0, 3])
    expect(s).toEqual([0, 2])
    expect(addPoint(s, 5, 1)).toEqual([0, 2])
  })
  test('tableFromKey', () => {
    expect(tableFromKey('Digit1')).toBe(1)
    expect(tableFromKey('Digit9')).toBe(9)
    expect(tableFromKey('Digit0')).toBe(10)
    expect(tableFromKey('KeyA')).toBeNull()
  })
  test('guardar y cargar', () => {
    const s = mem()
    saveQuizState({ tables: 4, scores: [1, 2, 3, 4] }, s)
    expect(loadQuizState(s)).toEqual({ tables: 4, scores: [1, 2, 3, 4] })
  })
  test('cargar con datos dañados o sin storage', () => {
    const s = mem()
    s.setItem('hermes.quiz', '{no')
    expect(loadQuizState(s)).toEqual({ tables: 6, scores: [0, 0, 0, 0, 0, 0] })
    expect(loadQuizState(null).tables).toBe(6)
    const boom = { getItem: () => { throw new Error('x') }, setItem: () => { throw new Error('x') } }
    expect(loadQuizState(boom).tables).toBe(6)
    expect(() => saveQuizState({ tables: 3, scores: [0, 0, 0] }, boom)).not.toThrow()
  })
})
