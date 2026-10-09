import { useMemo } from 'react'
import * as THREE from 'three'
import { Hermes } from '../components/three/Hermes'
import { Character } from '../components/three/Character'
import { Model } from '../components/three/Model'
import { Footprints } from '../components/three/Footprints'
import { GlowLine } from '../components/three/GlowLine'
import { useDamp } from '../components/three/useDamp'
import type { Vec3 } from '../data/types'
import type { SceneProps, Shot } from '../presentation/types'

export const shots: Shot[] = [
  { pos: [4, 2.6, 17], look: [0, 1.3, 5] },
  { pos: [3.6, 1.7, 2.6], look: [-2, 0.8, -2.2] },
  { pos: [-3.2, 1.8, -0.4], look: [3, 0.3, 3.5] },
  { pos: [-3, 3, 17], look: [5.5, 1, 11] },
]

const CRIB: Vec3 = [-2, 0, -2.2]
const MAIA: Vec3 = [-1.2, 0, -1.2]
const TURTLE: Vec3 = [2.6, 0, -1.8]
const LYRE: Vec3 = [2.2, 0, -0.3]
const PRINTS: Vec3[] = [[1.2, 0, 3], [2.5, 0, 5.5], [4.5, 0, 9], [6.5, 0, 13]]
const BEAM: Vec3[] = [[1, 0.15, 3], [3, 0.15, 7.5], [6.5, 0.15, 13]]
const WARM = new THREE.Color('#ffb066')
const MEMORY = new THREE.Color('#9fc4ff')

function CribBoxes({ baby }: { baby: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.5, 0.12, 0.9]} />
        <meshStandardMaterial color="#8a5a32" flatShading />
      </mesh>
      {[[-0.7, -0.4], [0.7, -0.4], [-0.7, 0.4], [0.7, 0.4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.25, z]}>
          <boxGeometry args={[0.08, 0.5, 0.08]} />
          <meshStandardMaterial color="#6b4423" />
        </mesh>
      ))}
      {[-0.4, 0.4].map((z) => (
        <mesh key={z} position={[0, 0.75, z]}>
          <boxGeometry args={[1.5, 0.4, 0.06]} />
          <meshStandardMaterial color="#8a5a32" flatShading />
        </mesh>
      ))}
      <mesh position={[0, 0.58, 0]}>
        <boxGeometry args={[1.3, 0.12, 0.7]} />
        <meshStandardMaterial color="#f1e6d0" />
      </mesh>
      {baby && (
        <mesh position={[0, 0.72, 0]}>
          <sphereGeometry args={[0.2, 8, 6]} />
          <meshStandardMaterial color="#e8b98f" />
        </mesh>
      )}
    </group>
  )
}

function Turtle() {
  return (
    <group>
      <mesh position={[0, 0.2, 0]} scale={[1, 0.6, 1.2]}>
        <sphereGeometry args={[0.4, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#5b7a3a" flatShading />
      </mesh>
      <mesh position={[0, 0.1, 0.5]}>
        <sphereGeometry args={[0.12, 8, 6]} />
        <meshStandardMaterial color="#7a9a55" />
      </mesh>
      {[[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.04, z]}>
          <boxGeometry args={[0.15, 0.08, 0.15]} />
          <meshStandardMaterial color="#7a9a55" />
        </mesh>
      ))}
    </group>
  )
}

function Lyre() {
  return (
    <group position={[0, 0.35, 0]}>
      <mesh position={[0, 0.2, 0]} scale={[1, 0.7, 0.8]}>
        <sphereGeometry args={[0.3, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#6f8f45" flatShading />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.22, 0.7, 0]} rotation={[0, 0, s * -0.15]}>
          <cylinderGeometry args={[0.025, 0.025, 0.8, 6]} />
          <meshStandardMaterial color="#e8c24a" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.04]} />
        <meshStandardMaterial color="#e8c24a" metalness={0.5} roughness={0.4} />
      </mesh>
      {[-0.12, 0, 0.12].map((x) => (
        <mesh key={x} position={[x, 0.7, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.8, 4]} />
          <meshBasicMaterial color="#fff" />
        </mesh>
      ))}
    </group>
  )
}

function Crib() {
  return (
    <group position={CRIB} rotation={[0, 0.5, 0]}>
      <Model name="cuna" fallback={<CribBoxes baby={false} />} />
    </group>
  )
}

export default function S02Cueva({ beat }: SceneProps) {
  const memory = useDamp(beat === 1 ? 1 : 0, 0.5)
  const lyre = useDamp(beat >= 2 ? 1 : 0)
  const prints = useDamp(beat >= 2 ? 1 : 0, 1.2)
  const beam = useDamp(beat >= 3 ? 1 : 0, 1)
  const babyOn = beat === 1
  const babyS = useDamp(babyOn ? 1 : 0, 0.5)
  const lightColor = useMemo(() => WARM.clone().lerp(MEMORY, memory), [memory])
  const wallColor = useMemo(() => new THREE.Color('#5a4636').lerp(new THREE.Color('#3a4a66'), memory), [memory])

  const herPos: Vec3 = beat === 0 ? [0.5, 0, 7] : beat === 1 ? [1.8, 0, 0.3] : beat === 2 ? [0.3, 0, 1.8] : [7, 0, 14]
  const herRot = beat === 1 ? Math.atan2(CRIB[0] - 1.8, CRIB[2] - 0.3) : beat === 2 ? Math.atan2(1.5, 2) : 0.6
  const babyPos: Vec3 = [-0.4, 0, -0.9]
  const maiaRot = Math.atan2(CRIB[0] - MAIA[0], CRIB[2] - MAIA[2])

  return (
    <group>
      <ambientLight intensity={0.35 + memory * 0.1} color={lightColor} />
      <directionalLight position={[3, 8, 6]} intensity={0.5} color={lightColor} />
      <pointLight position={[-1, 3, 0]} intensity={18} distance={12} color={lightColor} />

      {/* cueva: entrada hacia +Z; el fallback es el domo hueco de antes */}
      <Model
        name="cueva"
        fallback={
          <group>
            <mesh position={[0, 0, -1]} scale={[1, 0.7, 1]}>
              <sphereGeometry args={[10, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={wallColor} side={THREE.BackSide} flatShading />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 3]}>
              <circleGeometry args={[14, 20]} />
              <meshStandardMaterial color="#7a6347" />
            </mesh>
          </group>
        }
      />

      <Crib />
      <Character kind="maia" position={MAIA} rotation={maiaRot} action="idle" />

      <group position={TURTLE} rotation={[0, -0.6, 0]}>
        <Model name="tortuga" fallback={<Turtle />} />
      </group>
      <group position={LYRE} scale={Math.max(0.001, lyre)} visible={lyre > 0.01}>
        <Model name="lira" fallback={<group scale={0.5}><Lyre /></group>} scale={1} />
      </group>

      <group visible={babyS > 0.01}>
        <Character kind="humano" position={babyPos} scale={0.35 * Math.max(0.001, babyS)} color="#f1e6d0" ghost={false} rotation={0.5} />
      </group>

      <Hermes position={herPos} rotation={herRot} action={beat === 0 || beat === 3 ? 'walk' : 'idle'} />

      <Footprints path={PRINTS} count={8} visible={prints} />
      <GlowLine points={BEAM} progress={beam} color="#ffe9a8" width={4} />
      <pointLight position={[6.5, 2, 13]} intensity={20 * beam} distance={10} color="#ffe9a8" />
    </group>
  )
}
