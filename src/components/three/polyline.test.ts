import { describe, expect, test } from 'bun:test'
import { arcPoints, slicePolyline } from './polyline'
import { OLYMPUS_NETWORK } from './olympusNetwork'

const pts: [number, number, number][] = [[0, 0, 0], [2, 0, 0], [2, 2, 0]]

describe('slicePolyline', () => {
  test('0 deja solo el inicio, 1 todo', () => {
    expect(slicePolyline(pts, 0)).toEqual([[0, 0, 0]])
    expect(slicePolyline(pts, 1)).toEqual(pts)
  })
  test('interpola dentro de un segmento', () => {
    expect(slicePolyline(pts, 0.25)).toEqual([[0, 0, 0], [1, 0, 0]])
  })
  test('cruza vértices', () => {
    expect(slicePolyline(pts, 0.75)).toEqual([[0, 0, 0], [2, 0, 0], [2, 1, 0]])
  })
  test('limita fuera de rango', () => {
    expect(slicePolyline(pts, 5)).toEqual(pts)
    expect(slicePolyline(pts, -1)).toEqual([[0, 0, 0]])
  })
})

test('arcPoints sube en Y', () => {
  const a = arcPoints([0, 0, 0], [4, 0, 0], 0.3)
  expect(a[0]).toEqual([0, 0, 0])
  expect(a[a.length - 1][0]).toBeCloseTo(4)
  expect(a[12][1]).toBeGreaterThan(0)
})

test('OLYMPUS_NETWORK es consistente', () => {
  for (const [x, y] of OLYMPUS_NETWORK.links) {
    expect(OLYMPUS_NETWORK.nodes[x]).toBeDefined()
    expect(OLYMPUS_NETWORK.nodes[y]).toBeDefined()
  }
})
