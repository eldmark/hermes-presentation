import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3 } from 'three'
import { damp3 } from 'maath/easing'
import { SCENES } from '../data/scenes'
import { REGISTRY, useShots } from './registry'
import type { Shot } from './types'

const FALLBACK: Shot = { pos: [0, 4, 12], look: [0, 1, 0] }
const SMOOTH_BEAT = 0.25   // dentro de una escena: asienta en ~0,8 s
const SMOOTH_FLIGHT = 0.5  // al cambiar de escena: dos tramos, ~1,8 s en total
const FLIGHT_LEG = 0.9     // s en el punto intermedio antes de ir al destino
const LIFT = 30            // elevación del punto intermedio

export function CameraRig({ scene, beat }: { scene: number; beat: number }) {
  const camera = useThree((s) => s.camera)
  const id = SCENES[scene].id
  const shots = useShots(id)
  const shot = (shots && (shots[beat] ?? shots[shots.length - 1])) ?? FALLBACK
  const off = REGISTRY[id].offset

  const dest = useRef({ pos: new Vector3(), look: new Vector3() })
  dest.current.pos.set(shot.pos[0] + off[0], shot.pos[1] + off[1], shot.pos[2] + off[2])
  dest.current.look.set(shot.look[0] + off[0], shot.look[1] + off[1], shot.look[2] + off[2])

  const look = useRef(new Vector3())
  const mid = useRef<{ pos: Vector3; look: Vector3; t: number } | null>(null)
  const prevScene = useRef<number | null>(null)
  const ready = useRef(false)

  if (prevScene.current !== scene) {
    if (prevScene.current !== null && ready.current) {
      const p = camera.position.clone().lerp(dest.current.pos, 0.5)
      p.y = Math.max(p.y, dest.current.pos.y) + LIFT
      const l = look.current.clone().lerp(dest.current.look, 0.5)
      mid.current = { pos: p, look: l, t: 0 }
    }
    prevScene.current = scene
  }

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.1)
    if (!ready.current) {
      camera.position.copy(dest.current.pos)
      look.current.copy(dest.current.look)
      camera.lookAt(look.current)
      ready.current = true
      return
    }
    let tp = dest.current.pos, tl = dest.current.look, smooth = SMOOTH_BEAT
    const m = mid.current
    if (m) {
      m.t += dt
      if (m.t < FLIGHT_LEG) { tp = m.pos; tl = m.look } else mid.current = null
      smooth = SMOOTH_FLIGHT
    }
    damp3(camera.position, tp, smooth, dt)
    damp3(look.current, tl, smooth, dt)
    camera.lookAt(look.current)
  })
  return null
}
