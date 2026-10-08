import { useEffect, useState, type ReactNode } from 'react'
import { Html } from '@react-three/drei'

export interface ClickableProps { onSelect: () => void; children: ReactNode; hint?: string }

/** Hover con brillo y cursor pointer; restaura el cursor al salir o desmontar. */
export function Clickable({ onSelect, children, hint }: ClickableProps) {
  const [hover, setHover] = useState(false)
  useEffect(() => {
    if (!hover) return
    const prev = document.body.style.cursor
    document.body.style.cursor = 'pointer'
    return () => { document.body.style.cursor = prev }
  }, [hover])
  return (
    <group
      onPointerOver={(e) => { e.stopPropagation(); setHover(true) }}
      onPointerOut={() => setHover(false)}
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      scale={hover ? 1.06 : 1}
    >
      {children}
      {hover && (
        <pointLight color="#ffe9a8" intensity={6} distance={4} decay={2} position={[0, 0.5, 0.8]} />
      )}
      {hover && hint && (
        <Html center position={[0, 1.2, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            padding: '4px 10px', borderRadius: 8, background: 'rgba(0,0,0,.75)', color: '#fff',
            font: '600 20px/1.2 system-ui, sans-serif', whiteSpace: 'nowrap',
          }}>{hint}</div>
        </Html>
      )}
    </group>
  )
}
