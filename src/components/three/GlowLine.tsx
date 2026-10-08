import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import type { Vec3 } from '../../data/types'
import { slicePolyline } from './polyline'

export { slicePolyline } from './polyline'

export interface GlowLineProps {
  points: Vec3[]
  /** 0..1, ya amortiguado por quien la usa */
  progress: number
  color: string
  width?: number
  opacity?: number
  dashed?: boolean
}

/** Línea aditiva que se «dibuja» según `progress`. Sin postprocesado. */
export function GlowLine({ points, progress, color, width = 2, opacity = 0.9, dashed = false }: GlowLineProps) {
  const shown = useMemo(() => slicePolyline(points, progress), [points, progress])
  if (progress <= 0.001 || shown.length < 2) return null
  return (
    <Line
      points={shown}
      color={color}
      lineWidth={width}
      transparent
      opacity={opacity}
      depthWrite={false}
      blending={THREE.AdditiveBlending}
      dashed={dashed}
      dashSize={0.25}
      gapSize={0.18}
    />
  )
}

export default GlowLine
