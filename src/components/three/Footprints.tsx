import { useMemo } from 'react'
import type { Vec3 } from '../../data/types'

export interface Print { pos: Vec3; yaw: number; side: 1 | -1 }

/** Reparte `count` huellas a lo largo del path (por longitud de arco), alternando izquierda/derecha. */
export function samplePrints(path: Vec3[], count: number, spread = 0.12): Print[] {
  if (path.length < 2 || count <= 0) return []
  const lens: number[] = [0]
  for (let i = 1; i < path.length; i++) {
    lens.push(lens[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][2] - path[i - 1][2]))
  }
  const total = lens[lens.length - 1]
  if (total === 0) return []
  const out: Print[] = []
  for (let k = 0; k < count; k++) {
    const d = count === 1 ? 0 : (k / (count - 1)) * total
    let i = 1
    while (i < lens.length - 1 && lens[i] < d) i++
    const seg = lens[i] - lens[i - 1] || 1
    const f = Math.min(1, Math.max(0, (d - lens[i - 1]) / seg))
    const a = path[i - 1], b = path[i]
    const dx = b[0] - a[0], dz = b[2] - a[2]
    const L = Math.hypot(dx, dz) || 1
    const side: 1 | -1 = k % 2 === 0 ? 1 : -1
    out.push({
      pos: [a[0] + dx * f + (-dz / L) * spread * side, a[1] + (b[1] - a[1]) * f + 0.02, a[2] + dz * f + (dx / L) * spread * side],
      yaw: Math.atan2(dx, dz),
      side,
    })
  }
  return out
}

interface FootprintsProps {
  path: Vec3[]
  count: number
  /** 0..1: fracción de huellas reveladas. */
  visible: number
  /** Huellas rotadas 180° (apuntan al revés). */
  reversed?: boolean
  color?: string
}

export function Footprints({ path, count, visible, reversed, color = '#4a3a2a' }: FootprintsProps) {
  const prints = useMemo(() => samplePrints(path, count), [path, count])
  const shown = Math.max(0, Math.min(1, visible)) * prints.length
  return (
    <group>
      {prints.map((p, i) => {
        const o = Math.max(0, Math.min(1, shown - i))
        if (o <= 0) return null
        return (
          <group key={i} position={p.pos} rotation={[0, p.yaw + (reversed ? Math.PI : 0), 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.06]} scale={[0.07, 0.11, 1]}>
              <circleGeometry args={[1, 12]} />
              <meshBasicMaterial color={color} transparent opacity={0.85 * o} depthWrite={false} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.08]} scale={[0.05, 0.06, 1]}>
              <circleGeometry args={[1, 10]} />
              <meshBasicMaterial color={color} transparent opacity={0.85 * o} depthWrite={false} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
export default Footprints
