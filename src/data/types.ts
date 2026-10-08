export type SceneId = 'puertas'|'cueva'|'zeus'|'apolo'|'calipso'|'circe'|'almas'|'caminos'|'hoy'|'actividad'
export type Speaker = 'expositor'|'narrador'|'presentador'|'hermes'|'zeus'|'calipso'|'apolo'
export type PresenterId = 1 | 2 | 3
export type Vec3 = [number, number, number]

export interface Line { speaker: Speaker; text: string; presenter?: PresenterId }

export interface Beat {
  id: string                         // único dentro de la escena, ej. 'robo-huellas'
  stage?: string                     // acotación [ ... ]; se muestra en /script, no en el proyector
  lines: Line[]                      // lo que se dice en este paso
  onScreen?: string | string[]       // texto proyectado; array = palabras que aparecen una a una
  label?: { place?: string; time?: string } // rótulo; se hereda en los pasos siguientes hasta que otro lo cambie
  flashback?: boolean                // tinte de recuerdo
  interaction?: string               // instrucción para quien presenta ("El público señala; → revela")
  quiz?: { q: number; phase: 'shown'|'hidden'|'revealed' } // solo escena 10
}

export interface SceneData {
  id: SceneId; number: number; title: string
  minutes: [number, number]; place: string
  question?: string; sources?: string[]
  beats: Beat[]
}

export interface QuizQuestion { prompt: string; options: [string,string,string,string]; correct: 0|1|2|3; fromScene: number }
