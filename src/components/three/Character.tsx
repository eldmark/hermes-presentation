import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { damp3, dampAngle } from 'maath/easing'
import type { Group } from 'three'
import type { Vec3 } from '../../data/types'
import { Model } from './Model'

export type CharacterKind = 'hermes' | 'apolo' | 'calipso' | 'odiseo' | 'humano' | 'alma'
export type CharacterAction = 'idle' | 'walk' | 'wave' | 'fly' | 'sleep' | 'point' | 'play'

export interface CharacterProps {
  kind: CharacterKind
  position: Vec3
  rotation?: number
  action?: CharacterAction
  scale?: number
  ghost?: boolean
  color?: string
  /** Se dibuja en el espacio local del cuerpo (sombrero, vara...). */
  children?: ReactNode
  /** Objeto en la mano derecha (el brazo derecho lo mueve). */
  handItem?: ReactNode
}

const KIND_COLOR: Record<CharacterKind, string> = {
  hermes: '#3b82c4',
  apolo: '#f2b632',
  calipso: '#2fa38a',
  odiseo: '#b5483a',
  humano: '#8a7a6a',
  alma: '#bfe6ff',
}
const SKIN = '#e8b98f'

export function Mat({ color, ghost }: { color: string; ghost?: boolean }) {
  return ghost ? (
    <meshStandardMaterial color={color} transparent opacity={0.4} depthWrite={false} emissive={color} emissiveIntensity={0.4} />
  ) : (
    <meshStandardMaterial color={color} flatShading roughness={0.8} />
  )
}

export function Character({
  kind, position, rotation = 0, action = 'idle', scale = 1, ghost, color, children, handItem,
}: CharacterProps) {
  const root = useRef<Group>(null)
  const body = useRef<Group>(null)
  const armL = useRef<Group>(null)
  const armR = useRef<Group>(null)
  const legL = useRef<Group>(null)
  const legR = useRef<Group>(null)
  const init = useRef(false)
  const yaw = useRef({ v: rotation })
  const cloth = color ?? KIND_COLOR[kind]
  const isGhost = ghost ?? kind === 'alma'

  useFrame((state, dtRaw) => {
    const g = root.current
    if (!g) return
    const dt = Math.min(dtRaw, 0.1)
    const t = state.clock.elapsedTime
    if (!init.current) {
      g.position.set(...position)
      init.current = true
    }
    const dx = position[0] - g.position.x
    const dz = position[2] - g.position.z
    const dist = Math.hypot(dx, dz)
    const moving = dist > 0.05
    damp3(g.position, position, 0.35, dt)
    if (moving) {
      dampAngle(yaw.current, "v", Math.atan2(dx, dz), 0.2, dt)
    } else {
      dampAngle(yaw.current, "v", rotation, 0.3, dt)
    }
    g.rotation.y = yaw.current.v

    const b = body.current, aL = armL.current, aR = armR.current, lL = legL.current, lR = legR.current
    if (!b || !aL || !aR || !lL || !lR) return
    const walking = action === 'walk' || moving
    const swing = walking ? Math.sin(t * 8) * 0.6 : 0
    let by = 0, bx = 0, bz = 0
    let aLx = swing, aRx = -swing, aRz = 0, aLz = 0
    if (walking) by = Math.abs(Math.sin(t * 8)) * 0.05
    if (action === 'idle' && !moving) by = Math.sin(t * 1.5) * 0.015
    if (action === 'wave') { aRz = -2.6; aRx = 0; aRz += Math.sin(t * 7) * 0.35 }
    if (action === 'fly') { by = 0.5 + Math.sin(t * 2) * 0.12; bx = 0.5; aLz = 0.9; aRz = -0.9; aLx = 0; aRx = 0 }
    if (action === 'sleep') { bz = 1.35; by = -0.5; aLx = 0; aRx = 0 }
    if (action === 'point') { aRx = -Math.PI / 2; aLx = 0 }
    if (action === 'play') { aRx = -1.1 + Math.sin(t * 9) * 0.15; aLx = -0.9 }
    b.position.y = by
    b.rotation.x = bx
    b.rotation.z = bz
    aL.rotation.set(aLx, 0, aLz)
    aR.rotation.set(aRx, 0, aRz)
    lL.rotation.x = -swing
    lR.rotation.x = swing
  })

  const mat = (c: string) => <Mat color={c} ghost={isGhost} />
  const placeholder = (
    <group>
      <group ref={body}>
        <mesh position={[0, 1.0, 0]}>
          <capsuleGeometry args={[0.25, 0.55, 4, 8]} />
          {mat(cloth)}
        </mesh>
        <mesh position={[0, 1.65, 0]}>
          <sphereGeometry args={[0.2, 12, 10]} />
          {mat(SKIN)}
        </mesh>
        <group ref={armL} position={[-0.34, 1.3, 0]}>
          <mesh position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.56, 6]} />
            {mat(cloth)}
          </mesh>
        </group>
        <group ref={armR} position={[0.34, 1.3, 0]}>
          <mesh position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.56, 6]} />
            {mat(cloth)}
          </mesh>
          <group position={[0, -0.58, 0.05]}>{handItem}</group>
        </group>
        <group ref={legL} position={[-0.12, 0.65, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.08, 0.07, 0.6, 6]} />
            {mat('#5a4a3a')}
          </mesh>
        </group>
        <group ref={legR} position={[0.12, 0.65, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.08, 0.07, 0.6, 6]} />
            {mat('#5a4a3a')}
          </mesh>
        </group>
        {children}
      </group>
    </group>
  )

  return (
    <group ref={root} position={position} scale={scale}>
      <Model name={kind} fallback={placeholder} />
    </group>
  )
}
export default Character
