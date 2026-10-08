import { expect, test } from 'bun:test'
import { resolveLabel } from './Overlay'

const mk = (labels: Array<{ place?: string; time?: string } | undefined>) => ({
  beats: labels.map((label, i) => ({ id: `b${i}`, lines: [], label })),
})

test('hereda el último label de pasos anteriores', () => {
  const sc = mk([{ place: 'A' }, undefined, { place: 'B', time: 't' }, undefined])
  expect(resolveLabel(sc, 0)).toEqual({ place: 'A' })
  expect(resolveLabel(sc, 1)).toEqual({ place: 'A' })
  expect(resolveLabel(sc, 2)).toEqual({ place: 'B', time: 't' })
  expect(resolveLabel(sc, 3)).toEqual({ place: 'B', time: 't' })
})

test('sin label previo devuelve undefined y no mira pasos futuros', () => {
  const sc = mk([undefined, { place: 'X' }])
  expect(resolveLabel(sc, 0)).toBeUndefined()
})
