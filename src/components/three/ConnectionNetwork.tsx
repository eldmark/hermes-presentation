import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Vec3 } from '../../data/types'
import { GlowLine } from './GlowLine'
import { arcPoints, pointAt } from './polyline'

export { OLYMPUS_NETWORK } from './olympusNetwork'
export type { NetworkData } from './olympusNetwork'

export interface ConnectionNetworkProps {
  nodes: Record<string, Vec3>
  links: [string, string][]
  /** 0..links.length (fraccional): cuántas líneas están encendidas */
  lit: number
  color: string
  /** curvatura hacia arriba (fracción de la longitud), ej. 0.15 */
  arc?: number
  /** un destello viaja por las líneas encendidas */
  pulse?: boolean
}

function Pulse({ path, color }: { path: Vec3[]; color: string }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const m = ref.current
    if (!m) return
    const p = pointAt(path, (clock.elapsedTime * 0.4) % 1)
    m.position.set(p[0], p[1], p[2])
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.12, 12, 12]} />
      <meshBasicMaterial color={color} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  )
}

export function ConnectionNetwork({ nodes, links, lit, color, arc = 0, pulse = false }: ConnectionNetworkProps) {
  const paths = useMemo(
    () => links.map(([a, b]) => arcPoints(nodes[a], nodes[b], arc)),
    [nodes, links, arc],
  )
  const litNodes = new Set<string>()
  links.forEach(([a, b], i) => {
    if (lit > i) { litNodes.add(a); if (lit >= i + 1) litNodes.add(b) }
  })
  return (
    <group>
      {paths.map((path, i) => {
        const progress = Math.min(1, Math.max(0, lit - i))
        if (progress <= 0) return null
        return (
          <group key={links[i].join('>')}>
            <GlowLine points={path} progress={progress} color={color} />
            {pulse && progress >= 1 && <Pulse path={path} color={color} />}
          </group>
        )
      })}
      {[...litNodes].map((id) => (
        <mesh key={id} position={nodes[id]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  )
}

export default ConnectionNetwork
