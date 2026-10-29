import { describe, expect, test } from 'bun:test'
import { ATMOSPHERE, mixHex } from './atmosphere'
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
})
