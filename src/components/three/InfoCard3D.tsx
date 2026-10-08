import { useMemo, type ReactNode } from 'react'
import { Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'
import { asset } from '../../lib/asset'
import type { Vec3 } from '../../data/types'
import { useDamp } from './useDamp'

export const FONT_REGULAR = asset('fonts/inter-latin-400-normal.woff')
export const FONT_BOLD = asset('fonts/inter-latin-700-normal.woff')

export interface InfoCard3DProps {
  title: string; subtitle?: string; icon?: ReactNode; position: Vec3; highlighted?: boolean
}

const W = 2.4
function roundedShape(w: number, h: number, r: number) {
  const s = new THREE.Shape()
  const x = -w / 2, y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y)
  return s
}

/** Tarjeta que siempre mira a la cámara; brilla y crece de forma amortiguada al resaltarse. */
export function InfoCard3D({ title, subtitle, icon, position, highlighted = false }: InfoCard3DProps) {
  const k = useDamp(highlighted ? 1 : 0, 0.35)
  const h = subtitle ? 1.1 : 0.75
  const geo = useMemo(() => new THREE.ShapeGeometry(roundedShape(W, h, 0.14), 8), [h])
  const border = useMemo(() => new THREE.ShapeGeometry(roundedShape(W + 0.08, h + 0.08, 0.17), 8), [h])
  const bg = useMemo(() => new THREE.Color('#1b1b2f').lerp(new THREE.Color('#3a3358'), k), [k])
  const edge = useMemo(() => new THREE.Color('#5b5b86').lerp(new THREE.Color('#ffd978'), k), [k])
  const ty = subtitle ? 0.2 : 0
  return (
    <group position={position}>
      <Billboard scale={1 + 0.15 * k}>
        <mesh geometry={border} position={[0, 0, -0.01]}>
          <meshBasicMaterial color={edge} toneMapped={false} />
        </mesh>
        <mesh geometry={geo}>
          <meshBasicMaterial color={bg} toneMapped={false} />
        </mesh>
        {icon && <group position={[-W / 2 + 0.4, 0, 0.02]}>{icon}</group>}
        <Text
          font={FONT_BOLD} fontSize={0.26} color="#ffffff" anchorX="center" anchorY="middle"
          maxWidth={icon ? W - 0.95 : W - 0.3} textAlign="center"
          position={[icon ? 0.3 : 0, ty, 0.03]}
        >{title}</Text>
        {subtitle && (
          <Text
            font={FONT_REGULAR} fontSize={0.17} color="#c9c9e4" anchorX="center" anchorY="middle"
            maxWidth={icon ? W - 0.95 : W - 0.3} textAlign="center"
            position={[icon ? 0.3 : 0, -0.22, 0.03]}
          >{subtitle}</Text>
        )}
      </Billboard>
    </group>
  )
}
