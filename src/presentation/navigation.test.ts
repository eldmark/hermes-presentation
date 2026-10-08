import { describe, expect, test } from 'bun:test'
import { formatHash, navigate, parseHash } from './navigation'

const counts = [2, 3, 1]

describe('navigate', () => {
  test('next dentro de una escena', () => {
    expect(navigate({ scene: 1, beat: 0 }, { type: 'next' }, counts)).toEqual({ scene: 1, beat: 1 })
  })
  test('next cruza a la siguiente escena', () => {
    expect(navigate({ scene: 0, beat: 1 }, { type: 'next' }, counts)).toEqual({ scene: 1, beat: 0 })
  })
  test('prev cruza al último paso de la escena anterior', () => {
    expect(navigate({ scene: 1, beat: 0 }, { type: 'prev' }, counts)).toEqual({ scene: 0, beat: 1 })
  })
  test('límites en los extremos', () => {
    const end = { scene: 2, beat: 0 }
    expect(navigate(end, { type: 'next' }, counts)).toBe(end)
    const start = { scene: 0, beat: 0 }
    expect(navigate(start, { type: 'prev' }, counts)).toBe(start)
  })
  test('home y goto con ajuste', () => {
    expect(navigate({ scene: 2, beat: 0 }, { type: 'home' }, counts)).toEqual({ scene: 0, beat: 0 })
    expect(navigate({ scene: 0, beat: 0 }, { type: 'goto', scene: 99, beat: 99 }, counts)).toEqual({ scene: 2, beat: 0 })
    expect(navigate({ scene: 0, beat: 0 }, { type: 'goto', scene: -4, beat: -1 }, counts)).toEqual({ scene: 0, beat: 0 })
  })
})

describe('hash', () => {
  test('formato 1-indexado en la escena', () => {
    expect(formatHash({ scene: 3, beat: 2 })).toBe('#/p/4/2')
  })
  test('round-trip', () => {
    const c = [2, 3, 4, 5]
    for (let scene = 0; scene < c.length; scene++)
      for (let beat = 0; beat < c[scene]; beat++)
        expect(parseHash(formatHash({ scene, beat }), c)).toEqual({ scene, beat })
  })
  test('inválido o fuera de rango', () => {
    expect(parseHash('#/script', counts)).toBeNull()
    expect(parseHash('', counts)).toBeNull()
    expect(parseHash('#/p/abc', counts)).toBeNull()
    expect(parseHash('#/p/2', counts)).toEqual({ scene: 1, beat: 0 })
    expect(parseHash('#/p/9/9', counts)).toEqual({ scene: 2, beat: 0 })
  })
})
