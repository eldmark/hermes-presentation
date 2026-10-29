import { describe, expect, test } from 'bun:test'
import { GEN_H, GEN_LINKS, GEN_NODES, GEN_W, layoutGenealogy } from './genealogia'

describe('genealogia', () => {
  const { nodes, edges } = layoutGenealogy()
  test('ids únicos y enlaces válidos', () => {
    const ids = new Set(GEN_NODES.map((n) => n.id))
    expect(ids.size).toBe(GEN_NODES.length)
    for (const l of GEN_LINKS) {
      expect(ids.has(l.child)).toBe(true)
      l.parents.forEach((p) => expect(ids.has(p)).toBe(true))
    }
    expect(edges.length).toBe(GEN_LINKS.length)
  })
  test('Hermes es el único nodo focal y desciende de Zeus y Maia', () => {
    expect(nodes.filter((n) => n.emphasis === 'focus').map((n) => n.id)).toEqual(['hermes'])
    expect(GEN_LINKS.find((l) => l.child === 'hermes')?.parents).toEqual(['zeus', 'maia'])
  })
  test('todo cabe en el viewBox', () => {
    for (const n of nodes) {
      expect(n.box[0]).toBeGreaterThanOrEqual(0)
      expect(n.box[2]).toBeLessThanOrEqual(GEN_W)
      expect(n.box[1]).toBeGreaterThanOrEqual(0)
      expect(n.box[3]).toBeLessThanOrEqual(GEN_H)
    }
  })
  test('sin solapes entre cajas', () => {
    for (let i = 0; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i].box, b = nodes[j].box
        const overlap = a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3]
        expect(overlap).toBe(false)
      }
  })
  test('es determinista', () => {
    expect(layoutGenealogy()).toEqual(layoutGenealogy())
  })
})
