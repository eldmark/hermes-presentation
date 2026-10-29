import { describe, expect, test } from 'bun:test'
import { ATMOSPHERE, BEAT_SKY, mixHex, skyFor } from './atmosphere'
import { SCENES } from '../data/scenes'

describe('atmosphere', () => {
  test('toda escena tiene cielo y niebla válidos', () => {
    for (const s of SCENES) {
      const a = ATMOSPHERE[s.id]
      expect(a.sky).toMatch(/^#[0-9a-f]{6}$/i)
      expect(a.far).toBeGreaterThan(a.near)
    }
  })
  test('mixHex mezcla y limita', () => {
    expect(mixHex('#000000', '#ffffff', 0)).toBe('#000000')
    expect(mixHex('#000000', '#ffffff', 1)).toBe('#ffffff')
    expect(mixHex('#000000', '#ffffff', 0.5)).toBe('#808080')
    expect(mixHex('#000000', '#ffffff', 9)).toBe('#ffffff')
  })
  test('el cielo por paso existe y cae en un paso real de su escena', () => {
    for (const [id, pasos] of Object.entries(BEAT_SKY)) {
      const sc = SCENES.find((s) => s.id === id)!
      for (const [beatId, sky] of Object.entries(pasos)) {
        expect(sc.beats.some((b) => b.id === beatId)).toBe(true)
        expect(sky).toMatch(/^#[0-9a-f]{6}$/i)
      }
    }
    expect(skyFor('apolo', 'ante-zeus')).toBe('#2a2a4a')
    expect(skyFor('apolo', 'lira-suena')).toBe(ATMOSPHERE.apolo.sky)
  })
})
