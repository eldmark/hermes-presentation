/**
 * Poses procedurales de las figuras con articulaciones (sin three: se puede probar con bun test).
 *
 * Ejes (el modelo mira a +Z, brazos y piernas cuelgan hacia -Y local):
 *  - rotar sobre X balancea adelante/atrás: ángulo NEGATIVO lleva el brazo/pierna hacia delante (+Z),
 *    positivo hacia atrás. En la raíz (cuerpo entero) un X positivo inclina hacia delante;
 *    -π/2 acuesta la figura boca arriba (la cabeza queda hacia -Z).
 *  - rotar sobre Z abre hacia los lados: L es x positivo (Z positivo lo abre), R es x negativo
 *    (Z negativo lo abre). Z = ∓π levanta el brazo por encima de la cabeza.
 *  - rodilla: el pie va hacia atrás con X positivo en la espinilla; codo: el antebrazo se dobla
 *    hacia delante con X negativo.
 */
export type FigureAction = 'idle' | 'walk' | 'wave' | 'fly' | 'sleep' | 'point' | 'play'

/** Índices del arreglo de pose. Ángulos en radianes; rootY y rootZ en metros (sin escala). */
export const P = {
  rootY: 0,
  rootZ: 1,
  rootRx: 2,
  torsoRx: 3,
  headRx: 4,
  armLx: 5,
  armLz: 6,
  foreLx: 7,
  foreLz: 8,
  armRx: 9,
  armRz: 10,
  foreRx: 11,
  foreRz: 12,
  legLx: 13,
  legRx: 14,
  shinLx: 15,
  shinRx: 16,
  capeRx: 17,
} as const
export const POSE_SIZE = 18

export const WALK_SPEED = 8 // rad/s del ciclo de paso
const HALF_PI = Math.PI / 2

/** Escribe en `out` la pose objetivo. `walking` = la figura se desplaza (se mezcla con cualquier acción). `phase` desfasa el tiempo por instancia. */
export function computePose(out: ArrayLike<number> & { [i: number]: number }, action: FigureAction, time: number, walking: boolean, phase = 0): void {
  const t = time + phase
  for (let i = 0; i < POSE_SIZE; i++) out[i] = 0

  // Reposo: respiración leve.
  const breath = Math.sin(t * 1.6)
  out[P.torsoRx] = breath * 0.02
  out[P.headRx] = -breath * 0.015
  out[P.armLz] = 0.06 + breath * 0.015
  out[P.armRz] = -0.06 - breath * 0.015
  out[P.foreLx] = -0.12
  out[P.foreRx] = -0.12
  out[P.capeRx] = 0.04 + breath * 0.02

  if (walking || action === 'walk') {
    const s = Math.sin(t * WALK_SPEED)
    const c = Math.cos(t * WALK_SPEED)
    const swing = s * 0.6
    out[P.armLx] = swing
    out[P.armRx] = -swing
    out[P.foreLx] = -0.25 - Math.max(0, -s) * 0.3
    out[P.foreRx] = -0.25 - Math.max(0, s) * 0.3
    out[P.legLx] = -swing
    out[P.legRx] = swing
    // La rodilla se dobla mientras la pierna avanza (su ángulo X disminuye).
    out[P.shinLx] = Math.max(0, c) * 0.6
    out[P.shinRx] = Math.max(0, -c) * 0.6
    out[P.rootY] = Math.abs(s) * 0.04
    out[P.torsoRx] = 0.06
    out[P.capeRx] = 0.2 + Math.abs(s) * 0.12
    out[P.armLz] = 0.05
    out[P.armRz] = -0.05
  }

  switch (action) {
    case 'wave':
      out[P.armRx] = 0
      out[P.armRz] = -2.5
      out[P.foreRx] = 0
      out[P.foreRz] = -0.25 + Math.sin(t * 7) * 0.45
      break
    case 'fly': {
      const fl = Math.sin(t * 2)
      out[P.rootY] = 0.6 + fl * 0.12
      out[P.rootRx] = 1.0 + fl * 0.04
      out[P.torsoRx] = 0.1
      out[P.headRx] = -0.75
      out[P.armLx] = 0.55
      out[P.armRx] = 0.55
      out[P.armLz] = 0.5
      out[P.armRz] = -0.5
      out[P.foreLx] = -0.1
      out[P.foreRx] = -0.1
      out[P.legLx] = 0.35
      out[P.legRx] = 0.2
      out[P.shinLx] = 0.4 + Math.sin(t * 3) * 0.1
      out[P.shinRx] = 0.25 + Math.sin(t * 3 + 1) * 0.1
      out[P.capeRx] = 0.5 + Math.sin(t * 6) * 0.1
      break
    }
    case 'sleep':
      out[P.rootRx] = -HALF_PI
      out[P.rootY] = 0.18
      out[P.rootZ] = 0.9
      out[P.torsoRx] = breath * 0.015
      out[P.headRx] = 0
      out[P.armLx] = 0
      out[P.armRx] = 0
      out[P.armLz] = 0.18
      out[P.armRz] = -0.18
      out[P.foreLx] = -0.2
      out[P.foreRx] = -0.2
      out[P.capeRx] = 0
      break
    case 'point':
      out[P.armRx] = -HALF_PI + 0.05
      out[P.armRz] = -0.08
      out[P.foreRx] = 0
      break
    case 'play': {
      // Mano R sostiene la lira (queda casi vertical con el antebrazo hacia delante); la L rasga las cuerdas.
      out[P.armRx] = -0.7
      out[P.armRz] = -0.12
      out[P.foreRx] = -1.2
      out[P.armLx] = -0.75 + Math.sin(t * 9) * 0.08
      out[P.armLz] = 0.1
      out[P.foreLx] = -1.1 + Math.sin(t * 9 + 1) * 0.15
      out[P.torsoRx] = 0.04
      break
    }
    default:
      break
  }
}

/** Factor de suavizado independiente de los fps (1 - e^(-k·dt)). */
export function blendFactor(dt: number, rate = 12): number {
  return 1 - Math.exp(-rate * dt)
}
