import { Hermes } from '../components/three/Hermes'
import { ConnectionNetwork, OLYMPUS_NETWORK } from '../components/three/ConnectionNetwork'
import { useDamp } from '../components/three/useDamp'
import type { SceneProps, Shot } from '../presentation/types'

export const shots: Shot[] = [
  { pos: [0, 2.8, 16], look: [0, 3, 0] },
  { pos: [0, 4.5, 15], look: [0, 6, -8] },
  { pos: [3, 2.2, 11], look: [-0.5, 1.8, 4] },
  { pos: [0, 3, 6], look: [1, 2.5, -6] },
]

const STONE = '#e9e2d3'
const GOLD = '#d4af37'

function Pillar({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.8, 0.6, 1.8]} />
        <meshStandardMaterial color={STONE} />
      </mesh>
      <mesh position={[0, 4.3, 0]}>
        <cylinderGeometry args={[0.7, 0.8, 7.4, 10]} />
        <meshStandardMaterial color={STONE} flatShading />
      </mesh>
      <mesh position={[0, 8.2, 0]}>
        <boxGeometry args={[1.8, 0.5, 1.8]} />
        <meshStandardMaterial color={GOLD} metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  )
}

function Leaf({ side, open }: { side: 1 | -1; open: number }) {
  // bisagra en el pilar; al abrir, la hoja gira hacia el fondo (-z)
  return (
    <group position={[side * 4.2, 0, 0]} rotation={[0, side * open * 1.7, 0]}>
      <mesh position={[-side * 2.1, 3.8, 0]}>
        <boxGeometry args={[4.2, 7.6, 0.3]} />
        <meshStandardMaterial color="#c9a24a" metalness={0.5} roughness={0.45} />
      </mesh>
      <mesh position={[-side * 2.1, 3.8, 0.2]}>
        <boxGeometry args={[3.4, 6.8, 0.1]} />
        <meshStandardMaterial color="#e6c35c" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[-side * 0.4, 3.6, 0.3]}>
        <sphereGeometry args={[0.18, 8, 6]} />
        <meshStandardMaterial color="#8a5a1a" />
      </mesh>
    </group>
  )
}

function Cloud({ position, s = 1 }: { position: [number, number, number]; s?: number }) {
  return (
    <group position={position} scale={s}>
      {[[0, 0, 0, 2.4], [2, -0.2, 0.3, 1.8], [-2, -0.2, 0.2, 1.7]].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} scale={[1, 0.5, 1]}>
          <sphereGeometry args={[r, 8, 6]} />
          <meshStandardMaterial color="#fff" emissive="#ffffff" emissiveIntensity={0.25} />
        </mesh>
      ))}
    </group>
  )
}

export default function S01Puertas({ beat }: SceneProps) {
  const open = useDamp(beat >= 3 ? 1 : 0, 0.9)
  const lit = useDamp(beat <= 1 ? 10 : beat === 2 ? 0 : 4, 0.8)
  const glow = useDamp(beat === 1 ? 1 : 0)

  const pos: [number, number, number] =
    beat === 0 ? [-2, 0, 9] : beat === 1 ? [-1.5, 0, 8] : beat === 2 ? [-1, 0, 7] : [9, 0, -7]
  const action = beat === 0 ? 'wave' : 'idle'

  return (
    <group>
      <ambientLight intensity={0.8} />
      <directionalLight position={[6, 14, 12]} intensity={1.6} color="#fff1d0" />
      <pointLight position={[0, 5, 2]} intensity={open * 60} color="#ffe9a8" distance={25} />

      {/* cielo y nubes */}
      <mesh position={[0, 8, -40]}>
        <planeGeometry args={[120, 60]} />
        <meshBasicMaterial color="#9fc8ee" />
      </mesh>
      <Cloud position={[-14, 3, -20]} s={1.4} />
      <Cloud position={[12, 7, -24]} s={1.8} />
      <Cloud position={[-8, 14, -30]} s={1.2} />
      <Cloud position={[16, 1, -12]} />

      {/* suelo de nubes */}
      <mesh position={[0, -0.05, 4]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[26, 24]} />
        <meshStandardMaterial color="#f4f1ea" />
      </mesh>
      <mesh position={[0, 0.01, 8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 20]} />
        <meshStandardMaterial color="#d9cfae" />
      </mesh>

      {/* red al fondo */}
      <group position={[0, 8, -16]} scale={1.8}>
        <ConnectionNetwork
          nodes={OLYMPUS_NETWORK.nodes}
          links={OLYMPUS_NETWORK.links}
          lit={lit}
          color={glow > 0.5 ? '#ffe27a' : '#ffd24d'}
          arc={0.15}
          pulse
        />
      </group>

      {/* puertas */}
      <Pillar x={-4.2} />
      <Pillar x={4.2} />
      <mesh position={[0, 8.9, 0]}>
        <boxGeometry args={[10.6, 0.9, 2]} />
        <meshStandardMaterial color={STONE} />
      </mesh>
      <mesh position={[0, 10.1, 0]} rotation={[Math.PI / 2, Math.PI / 4, 0]} scale={[1, 1, 0.6]}>
        <coneGeometry args={[5.4, 1.6, 3]} />
        <meshStandardMaterial color={STONE} flatShading />
      </mesh>
      <Leaf side={1} open={open} />
      <Leaf side={-1} open={open} />
      {/* luz tras las puertas */}
      <mesh position={[0, 3.8, -2]} scale={[1, 1, 1]}>
        <planeGeometry args={[8.4, 7.6]} />
        <meshBasicMaterial color="#fff6cf" />
      </mesh>

      <Hermes position={pos} action={action} holding={beat >= 2 ? 'carta' : undefined} rotation={beat >= 3 ? Math.PI / 2 : 0} />
    </group>
  )
}
