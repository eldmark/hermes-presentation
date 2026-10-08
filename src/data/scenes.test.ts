import { describe, expect, test } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { QUIZ, SCENES } from './scenes'

const all = [...QUIZ.questions, QUIZ.reserve]

describe('scenes', () => {
  test('hay 10 escenas con ids únicos', () => {
    expect(SCENES.length).toBe(10)
    expect(new Set(SCENES.map(s => s.id)).size).toBe(10)
    SCENES.forEach((s, i) => expect(s.number).toBe(i + 1))
  })
  test('beat ids únicos y al menos un paso', () => {
    for (const s of SCENES) {
      expect(s.beats.length).toBeGreaterThanOrEqual(1)
      expect(new Set(s.beats.map(b => b.id)).size).toBe(s.beats.length)
    }
  })
  test('preguntas con 4 opciones y correct válido', () => {
    expect(QUIZ.questions.length).toBe(5)
    for (const q of all) {
      expect(q.options.length).toBe(4)
      expect([0, 1, 2, 3]).toContain(q.correct)
    }
  })
  test('escena 10 tiene 3 pasos por pregunta', () => {
    const s = SCENES[9]
    for (let n = 1; n <= QUIZ.questions.length; n++) {
      expect(s.beats.filter(b => b.quiz?.q === n).length).toBe(3)
      for (const suf of ['pregunta', 'cadena', 'respuesta']) expect(s.beats.some(b => b.id === `q${n}-${suf}`)).toBe(true)
    }
    for (const id of ['intro', 'reglas-1', 'reglas-6', 'demo', 'mesas', 'cierre']) expect(s.beats.some(b => b.id === id)).toBe(true)
  })
  test('ningún texto vacío', () => {
    for (const s of SCENES) {
      expect(s.title.trim()).not.toBe('')
      for (const b of s.beats) {
        expect(b.id.trim()).not.toBe('')
        if (b.stage !== undefined) expect(b.stage.trim()).not.toBe('')
        if (b.interaction !== undefined) expect(b.interaction.trim()).not.toBe('')
        const os = b.onScreen === undefined ? [] : Array.isArray(b.onScreen) ? b.onScreen : [b.onScreen]
        os.forEach(t => expect(t.trim()).not.toBe(''))
        expect(b.lines.length + (b.stage ? 1 : 0)).toBeGreaterThan(0)
        b.lines.forEach(l => expect(l.text.trim()).not.toBe(''))
      }
    }
  })
  test('src/data no importa react ni three', () => {
    for (const f of readdirSync(import.meta.dir).filter(f => /\.tsx?$/.test(f) && !f.endsWith('.test.ts'))) {
      const src = readFileSync(join(import.meta.dir, f), 'utf8')
      expect(/from ['"](react|three)/.test(src)).toBe(false)
    }
  })
})
