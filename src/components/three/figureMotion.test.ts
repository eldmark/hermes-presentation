import { describe, expect, test } from 'bun:test'
import { P, POSE_SIZE, computePose, blendFactor, type FigureAction } from './figureMotion'

const ACTIONS: FigureAction[] = ['idle', 'walk', 'wave', 'fly', 'sleep', 'point', 'play']
const pose = (a: FigureAction, t = 0.3, walking = false, ph = 0) => {
  const out = new Float64Array(POSE_SIZE)
  computePose(out, a, t, walking, ph)
  return out
}

describe('computePose', () => {
  test('es determinista y finita para todas las acciones', () => {
    for (const a of ACTIONS) for (const t of [0, 0.37, 5, 123.4]) {
      const x = pose(a, t), y = pose(a, t)
      expect(Array.from(x)).toEqual(Array.from(y))
      for (const v of x) expect(Number.isFinite(v)).toBe(true)
    }
  })
  test('al caminar brazos y piernas se balancean en oposición', () => {
    const w = pose('walk', 0.1)
    expect(Math.sign(w[P.armLx])).toBe(-Math.sign(w[P.armRx]))
    expect(Math.sign(w[P.legLx])).toBe(-Math.sign(w[P.legRx]))
    // brazo L y pierna L van en sentidos contrarios
    expect(Math.sign(w[P.armLx])).toBe(-Math.sign(w[P.legLx]))
  })
  test('desplazarse activa el paso aunque la acción sea idle', () => {
    expect(Math.abs(pose('idle', 0.1, true)[P.armLx])).toBeGreaterThan(0.1)
    expect(Math.abs(pose('idle', 0.1, false)[P.armLx])).toBeLessThan(0.05)
  })
  test('el desfase por instancia cambia el ciclo', () => {
    expect(pose('walk', 0.1, false, 0)[P.armLx]).not.toBeCloseTo(pose('walk', 0.1, false, 1)[P.armLx], 3)
  })
  test('idle respira poco', () => {
    for (let t = 0; t < 10; t += 0.25) expect(Math.abs(pose('idle', t)[P.torsoRx])).toBeLessThan(0.05)
  })
  test('wave levanta el brazo derecho (Z negativo) y oscila el antebrazo', () => {
    expect(pose('wave')[P.armRz]).toBeLessThan(-2)
    expect(pose('wave', 0)[P.foreRz]).not.toBeCloseTo(pose('wave', 0.2)[P.foreRz], 2)
  })
  test('point extiende el brazo derecho hacia delante', () => {
    expect(pose('point')[P.armRx]).toBeCloseTo(-Math.PI / 2, 0)
  })
  test('sleep acuesta la figura boca arriba', () => {
    const s = pose('sleep')
    expect(s[P.rootRx]).toBeCloseTo(-Math.PI / 2, 5)
    expect(s[P.rootZ]).toBeGreaterThan(0.5)
  })
  test('fly inclina hacia delante, sube y echa los brazos atrás', () => {
    const f = pose('fly')
    expect(f[P.rootRx]).toBeGreaterThan(0.5)
    expect(f[P.rootY]).toBeGreaterThan(0.3)
    expect(f[P.armLx]).toBeGreaterThan(0)
    expect(f[P.armRx]).toBeGreaterThan(0)
  })
  test('play dobla ambos antebrazos hacia delante', () => {
    const p = pose('play')
    expect(p[P.foreRx]).toBeLessThan(-0.8)
    expect(p[P.foreLx]).toBeLessThan(-0.8)
  })
})

describe('blendFactor', () => {
  test('está entre 0 y 1 y crece con dt', () => {
    expect(blendFactor(0)).toBe(0)
    expect(blendFactor(0.016)).toBeGreaterThan(0)
    expect(blendFactor(1)).toBeLessThan(1)
    expect(blendFactor(0.1)).toBeGreaterThan(blendFactor(0.01))
  })
})
