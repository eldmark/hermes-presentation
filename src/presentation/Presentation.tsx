import { Canvas } from '@react-three/fiber'
import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { SCENES } from '../data/scenes'
import { Hud, plannedSeconds } from '../components/ui/Hud'
import { CameraRig } from './CameraRig'
import { Stage } from './Stage'
import { formatHash, navigate, parseHash } from './navigation'
import type { NavAction, NavState } from './navigation'
import { Overlay } from './Overlay'
import { useKeyboard } from './useKeyboard'

const COUNTS = SCENES.map((s) => s.beats.length)
const reducer = (s: NavState, a: NavAction) => navigate(s, a, COUNTS)

export default function Presentation() {
  const [nav, dispatch] = useReducer(reducer, undefined, () => parseHash(location.hash, COUNTS) ?? { scene: 0, beat: 0 })
  const [hud, setHud] = useState(false)
  const [black, setBlack] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  // Estado -> hash (sin llenar el historial).
  useEffect(() => {
    const h = formatHash(nav)
    if (location.hash !== h) history.replaceState(null, '', h)
  }, [nav])

  // Hash editado a mano -> estado.
  useEffect(() => {
    const onHash = () => {
      const p = parseHash(location.hash, COUNTS)
      if (p) dispatch({ type: 'goto', ...p })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Cronómetro (desde que se abre la presentación).
  const t0 = useRef(Date.now())
  useEffect(() => {
    const id = setInterval(() => setElapsed((Date.now() - t0.current) / 1000), 500)
    return () => clearInterval(id)
  }, [])

  useKeyboard({
    next: useCallback(() => dispatch({ type: 'next' }), []),
    prev: useCallback(() => dispatch({ type: 'prev' }), []),
    home: useCallback(() => dispatch({ type: 'home' }), []),
    toggleHud: useCallback(() => setHud((v) => !v), []),
    toggleBlack: useCallback(() => setBlack((v) => !v), []),
  })

  return (
    <div className={`stage-root${SCENES[nav.scene].beats[nav.beat].flashback ? ' flashback' : ''}`} style={{ position: 'fixed', inset: 0 }}>
      <Canvas dpr={[1, 1.5]} camera={{ fov: 50, near: 0.1, far: 600 }}>
        <color attach="background" args={['#0b0b14']} />
        <fog attach="fog" args={['#0b0b14', 60, 260]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} />
        <Stage scene={nav.scene} beat={nav.beat} />
        <CameraRig scene={nav.scene} beat={nav.beat} />
      </Canvas>
      <Overlay scene={nav.scene} beat={nav.beat} />
      {hud && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 8, pointerEvents: 'none' }}>
          <Hud scene={nav.scene} beat={nav.beat} elapsed={elapsed} planned={plannedSeconds(nav.scene)} />
        </div>
      )}
      {black && <div style={{ position: 'fixed', inset: 0, zIndex: 10, background: '#000' }} />}
    </div>
  )
}
