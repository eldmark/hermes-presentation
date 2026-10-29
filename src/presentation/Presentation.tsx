import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { Color, Fog, MathUtils } from 'three'
import type { PerspectiveCamera } from 'three'
import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { SCENES } from '../data/scenes'
import { Hud, plannedSeconds } from '../components/ui/Hud'
import { ATMOSPHERE } from './atmosphere'
import { CameraRig } from './CameraRig'
import { Stage } from './Stage'
import { formatHash, navigate, parseHash } from './navigation'
import type { NavAction, NavState } from './navigation'
import { Overlay } from './Overlay'
import { useKeyboard } from './useKeyboard'

const COUNTS = SCENES.map((s) => s.beats.length)
const reducer = (s: NavState, a: NavAction) => navigate(s, a, COUNTS)

const BASE_FOV = 50          // campo de visión vertical pensado para 16:9
const REF_ASPECT = 16 / 9
const MAX_FOV = 85

/** Mantiene el encuadre horizontal de un proyector 16:9 en pantallas más cuadradas (4:3, 16:10): amplía el campo vertical. */
function ProjectorFit() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const size = useThree((s) => s.size)
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height)
    if (aspect < REF_ASPECT) {
      const half = Math.atan(Math.tan(MathUtils.degToRad(BASE_FOV) / 2) * (REF_ASPECT / aspect))
      camera.fov = Math.min(MAX_FOV, MathUtils.radToDeg(half * 2))
    } else {
      camera.fov = BASE_FOV
    }
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height])
  return null
}

/** Cielo y niebla por escena, con transición suave al cambiar de escena. */
function SceneAtmosphere({ sceneIndex }: { sceneIndex: number }) {
  const scene = useThree((s) => s.scene)
  const target = ATMOSPHERE[SCENES[sceneIndex]!.id]
  const tc = useRef(new Color(target.sky))
  tc.current.set(target.sky)
  useEffect(() => {
    scene.background = new Color(target.sky)
    scene.fog = new Fog(target.sky, target.near, target.far)
    return () => { scene.background = null; scene.fog = null }
    // se crea una sola vez; los cambios los anima useFrame
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene])
  useFrame((_, dtRaw) => {
    const k = 1 - Math.exp(-3 * Math.min(dtRaw, 0.1))
    if (scene.background instanceof Color) scene.background.lerp(tc.current, k)
    const fog = scene.fog as Fog | null
    if (fog) {
      fog.color.lerp(tc.current, k)
      fog.near += (target.near - fog.near) * k
      fog.far += (target.far - fog.far) * k
    }
  })
  return null
}

/** Oculta el cursor tras unos segundos sin moverlo (se ve mejor proyectado). */
function useIdleCursor(ms = 2500) {
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    const root = document.documentElement
    const show = () => {
      root.style.cursor = ''
      clearTimeout(t)
      t = setTimeout(() => { root.style.cursor = 'none' }, ms)
    }
    show()
    window.addEventListener('mousemove', show)
    window.addEventListener('mousedown', show)
    return () => {
      clearTimeout(t)
      root.style.cursor = ''
      window.removeEventListener('mousemove', show)
      window.removeEventListener('mousedown', show)
    }
  }, [ms])
}

export default function Presentation() {
  const [nav, dispatch] = useReducer(reducer, undefined, () => parseHash(location.hash, COUNTS) ?? { scene: 0, beat: 0 })
  const [hud, setHud] = useState(false)
  const [black, setBlack] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [dpr, setDpr] = useState(1.5)
  useIdleCursor()

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
      <Canvas dpr={[1, dpr]} camera={{ fov: BASE_FOV, near: 0.1, far: 600 }}>
        <ProjectorFit />
        {/* Si el equipo va justo de fps, baja la resolución de render sola; si recupera, la sube. */}
        <PerformanceMonitor flipflops={3} onDecline={() => setDpr(1)} onFallback={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
        <SceneAtmosphere sceneIndex={nav.scene} />
        {/* Luz de base suave: cada escena añade la suya. */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={0.85} />
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
