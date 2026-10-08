import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { damp } from 'maath/easing'

/** Valor numérico amortiguado hacia `target` (smooth = tiempo de suavizado en s). */
export function useDamp(target: number, smooth = 0.6): number {
  const [value, setValue] = useState(target)
  const obj = useRef({ v: target })
  useFrame((_, dt) => {
    if (obj.current.v === target) return
    damp(obj.current, 'v', target, smooth, Math.min(dt, 0.1))
    if (Math.abs(obj.current.v - target) < 1e-3) obj.current.v = target
    setValue(obj.current.v)
  })
  return value
}
