import type { PresenterId, SceneData, SceneId, Speaker } from './types'

/**
 * Quién dice cada línea. Se ajusta aquí, sin tocar el guion.
 *
 * Orden de prioridad para cada línea:
 *  1. Si habla un personaje (Hermes, Zeus, Calipso, Apolo), lo pone su voz fija (VOZ).
 *  2. Si el paso tiene un responsable propio (PASOS), ese.
 *  3. Si no, la persona de la escena (ESCENA).
 */
export const VOZ: Partial<Record<Speaker, PresenterId>> = {
  hermes: 2,
  zeus: 1,
  calipso: 3,
  apolo: 3,
}

export const ESCENA: Record<SceneId, PresenterId> = {
  puertas: 1, cueva: 1, zeus: 1, apolo: 1,
  calipso: 2, circe: 2, almas: 2,
  caminos: 3, hoy: 3,
  conceptos: 1,
  actividad: 3,
  referencias: 1,
}

/** Excepciones por paso: clave `${escena}/${paso}`. */
export const PASOS: Record<string, PresenterId> = {
  // Seis ideas: se reparten entre las tres personas.
  'conceptos/libertad': 2, 'conceptos/destino': 2,
  'conceptos/etica': 3, 'conceptos/conocimiento': 3, 'conceptos/cierre': 3,
  // Actividad: P2 abre y explica las primeras reglas, P3 el resto, y las preguntas rotan.
  'actividad/intro': 2, 'actividad/reglas-1': 2, 'actividad/reglas-2': 2, 'actividad/reglas-3': 2,
  'actividad/q1-pregunta': 1, 'actividad/q1-cadena': 1, 'actividad/q1-respuesta': 1,
  'actividad/q2-pregunta': 2, 'actividad/q2-cadena': 2, 'actividad/q2-respuesta': 2,
  'actividad/q3-pregunta': 3, 'actividad/q3-cadena': 3, 'actividad/q3-respuesta': 3,
  'actividad/q4-pregunta': 1, 'actividad/q4-cadena': 1, 'actividad/q4-respuesta': 1,
  'actividad/q5-pregunta': 2, 'actividad/q5-cadena': 2, 'actividad/q5-respuesta': 2,
}

export function asignarReparto(scenes: SceneData[]): SceneData[] {
  return scenes.map((s) => ({
    ...s,
    beats: s.beats.map((b) => ({
      ...b,
      lines: b.lines.map((l) => ({ ...l, presenter: VOZ[l.speaker] ?? PASOS[`${s.id}/${b.id}`] ?? ESCENA[s.id] })),
    })),
  }))
}

/** Palabras que dice cada persona (para comprobar que el reparto es parejo). */
export function palabrasPorPersona(scenes: SceneData[]): Record<PresenterId, number> {
  const out: Record<PresenterId, number> = { 1: 0, 2: 0, 3: 0 }
  for (const s of scenes) for (const b of s.beats) for (const l of b.lines) {
    if (l.presenter) out[l.presenter] += l.text.split(/\s+/).filter(Boolean).length
  }
  return out
}
