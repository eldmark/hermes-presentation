import { Component, Suspense, type ReactNode } from 'react'
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
  return <primitive object={gltf.scene.clone()} />
}

/** Muestra el glb de ASSETS[name]; si es null o falla la carga, muestra `fallback`. */
export function Model({ name, fallback }: { name: keyof typeof ASSETS; fallback: ReactNode }) {
  const path: string | null = ASSETS[name]
  if (!path) return <>{fallback}</>
  return (
    <Boundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <Loaded path={path} />
      </Suspense>
    </Boundary>
  )
}
export default Model
