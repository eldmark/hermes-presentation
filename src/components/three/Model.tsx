import { Component, Suspense, useMemo, type ReactNode } from 'react'
import { useGLTF } from '@react-three/drei'
import { asset } from '../../lib/asset'
import { ASSETS } from './assets'

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(e: unknown) {
    console.warn('Model: falló la carga, se usa el placeholder', e)
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function Loaded({ path }: { path: string }) {
  const gltf = useGLTF(asset(`models/${path}`))
  // Una sola copia por instancia: las escenas se re-renderizan en cada frame mientras animan.
  const object = useMemo(() => gltf.scene.clone(), [gltf.scene])
  return <primitive object={object} />
}

/** Muestra el glb de ASSETS[name]; si es null o falla la carga, muestra `fallback`. */
export function Model({
  name,
  fallback,
  scale = 1,
  yaw = 0,
}: {
  name: keyof typeof ASSETS
  fallback: ReactNode
  /** Escala y giro (rad, eje Y) solo del modelo cargado; el fallback se dibuja tal cual. */
  scale?: number
  yaw?: number
}) {
  const path: string | null = ASSETS[name]
  if (!path) return <>{fallback}</>
  return (
    <Boundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <group scale={scale} rotation={[0, yaw, 0]}>
          <Loaded path={path} />
        </group>
      </Suspense>
    </Boundary>
  )
}
export default Model
