import { Component, Suspense, useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react'
import { createPortal, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Color, Mesh, type Material, type Object3D } from 'three'
import { asset } from '../../lib/asset'
import { P, POSE_SIZE, blendFactor, computePose, type FigureAction } from './figureMotion'

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(e: unknown) {
    console.warn('Figure: falló la carga, se usa el placeholder', e)
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/** Nodo del glb y los índices de pose (eje X / eje Z) que lo mueven. */
const BINDINGS: { name: string; x?: number; z?: number }[] = [
  { name: 'torso', x: P.torsoRx },
  { name: 'head', x: P.headRx },
  { name: 'arm_L', x: P.armLx, z: P.armLz },
  { name: 'forearm_L', x: P.foreLx, z: P.foreLz },
  { name: 'arm_R', x: P.armRx, z: P.armRz },
  { name: 'forearm_R', x: P.foreRx, z: P.foreRz },
  { name: 'leg_L', x: P.legLx },
  { name: 'shin_L', x: P.shinLx },
  { name: 'leg_R', x: P.legRx },
  { name: 'shin_R', x: P.shinRx },
  { name: 'cape', x: P.capeRx },
]

interface Bound {
  obj: Object3D
  x: number
  z: number
  rx: number
  ry: number
  rz: number
}

const GHOST_TINT = new Color('#9fc0e8')

interface FigureProps {
  /** Archivo en public/models (p. ej. 'hermes.glb'). */
  file: string
  action: FigureAction
  /** La escribe Character cada frame: true si la figura se está desplazando. */
  movingRef: MutableRefObject<boolean>
  ghost?: boolean
  /** Se monta dentro del nodo hand_R (se mueve con el brazo). */
  handItem?: ReactNode
  /** Se dibuja en el espacio local del cuerpo, sin animar. */
  children?: ReactNode
}

function FigureLoaded({ file, action, movingRef, ghost, handItem, children }: FigureProps) {
  const gltf = useGLTF(asset(`models/${file}`))
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene])
  const phase = useMemo(() => Math.random() * 20, [])

  // Materiales propios solo si hay que volverlos fantasma (los demás se comparten).
  const ghostMats = useMemo<Material[]>(() => [], [])
  useMemo(() => {
    ghostMats.length = 0
    if (!ghost) return
    scene.traverse((o) => {
      const m = o as Mesh
      if (!m.isMesh) return
      const clone = (Array.isArray(m.material) ? m.material : [m.material]).map((mat) => {
        const c = mat.clone()
        c.transparent = true
        c.opacity = 0.55
        c.depthWrite = false
        if ('color' in c) (c as unknown as { color: Color }).color.lerp(GHOST_TINT, 0.4)
        ghostMats.push(c)
        return c
      })
      m.material = Array.isArray(m.material) ? clone : clone[0]
    })
  }, [scene, ghost, ghostMats])
  useEffect(() => () => ghostMats.forEach((m) => m.dispose()), [ghostMats, ghost])

  const rig = useMemo(() => {
    const byName = new Map<string, Object3D>()
    scene.traverse((o) => {
      if (o.name) byName.set(o.name, o)
    })
    const bound: Bound[] = []
    for (const b of BINDINGS) {
      const obj = byName.get(b.name)
      if (!obj) continue
      bound.push({ obj, x: b.x ?? -1, z: b.z ?? -1, rx: obj.rotation.x, ry: obj.rotation.y, rz: obj.rotation.z })
    }
    const root = byName.get('root') ?? scene
    return { bound, root, rootPos: root.position.clone(), rootRot: root.rotation.clone(), hand: byName.get('hand_R') ?? null }
  }, [scene])

  const cur = useRef(new Float64Array(POSE_SIZE))
  const target = useRef(new Float64Array(POSE_SIZE))
  const fresh = useRef(true)

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.1)
    const c = cur.current, tg = target.current
    computePose(tg, action, state.clock.elapsedTime, movingRef.current, phase)
    if (fresh.current) {
      c.set(tg)
      fresh.current = false
    } else {
      const k = blendFactor(dt)
      for (let i = 0; i < POSE_SIZE; i++) c[i] += (tg[i] - c[i]) * k
    }
    for (const b of rig.bound) {
      b.obj.rotation.set(b.rx + (b.x >= 0 ? c[b.x] : 0), b.ry, b.rz + (b.z >= 0 ? c[b.z] : 0))
    }
    const r = rig.root
    r.position.set(rig.rootPos.x, rig.rootPos.y + c[P.rootY], rig.rootPos.z + c[P.rootZ])
    r.rotation.set(rig.rootRot.x + c[P.rootRx], rig.rootRot.y, rig.rootRot.z)
  })

  return (
    <>
      <primitive object={scene} />
      {handItem && rig.hand ? createPortal(<>{handItem}</>, rig.hand) : null}
      {children}
    </>
  )
}

/** Personaje con articulaciones desde un glb; muestra `fallback` mientras carga o si falla. */
export function Figure({ fallback, ...props }: FigureProps & { fallback: ReactNode }) {
  return (
    <Boundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <FigureLoaded {...props} />
      </Suspense>
    </Boundary>
  )
}
export default Figure
