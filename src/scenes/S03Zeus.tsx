import type { Vec3 } from '../data/types'
import { GlowLine } from '../components/three/GlowLine'
import { Hermes } from '../components/three/Hermes'
import { useDamp } from '../components/three/useDamp'
import type { SceneProps, Shot } from '../presentation/types'

// Un shot por paso: mapa, orden, misión, ruta.
export const shots: Shot[] = [
  { pos: [-4, 3.5, 9], look: [-1, 1.2, 0] },
  { pos: [-5, 3, 6], look: [-1, 1.4, -1] },
  { pos: [-1, 5.5, 5.5], look: [0.5, 0.2, 0] },
  { pos: [2.5, 6.5, 6], look: [3, 0, -1] },
]

const SEA = '#0d2b4d'
const LAND = '#2f6b4a'
const CALIPSO: Vec3 = [4.2, 0.12, -0.9]
const OLIMPO: Vec3 = [-4.2, 0.12, 0.6]
const ROUTE: Vec3[] = [
  OLIMPO,
  [-2.6, 0.12, 1.4],
  [-0.6, 0.12, 0.9],
  [1.4, 0.12, -0.2],
  [3.0, 0.12, -0.5],
  CALIPSO,
]

const HERMES_POS: Vec3[] = [
  [-8, 0, 3.2],
  [-5.4, 0, 2.6],
  [-4.4, 0, 2.2],
  [4.2, 0, -2.2],
]

function Isla({ position, scale = 1, color = LAND }: { position: Vec3; scale?: number; color?: string }) {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <cylinderGeometry args={[1, 1.15, 0.12, 9]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      <mesh position={[0.5, 0.02, 0.3]} scale={[0.6, 1, 0.5]}>
        <cylinderGeometry args={[0.8, 0.9, 0.1, 7]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
    </group>
  )
}

function ZeusSombra({ intensity }: { intensity: number }) {
  // silueta oscura sobre un resplandor en la pared
  return (
    <group position={[0, 0, -6.4]}>
      <mesh position={[0, 4.2, 0]}>
        <planeGeometry args={[7, 8]} />
        <meshBasicMaterial color="#ffd98a" transparent opacity={0.1 + 0.3 * intensity} />
      </mesh>
      <group position={[0, 0, 0.05]} scale={[1, 1 + 0.05 * intensity, 1]}>
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry args={[1.5, 1.9, 4.4, 8]} />
          <meshBasicMaterial color="#05060d" transparent opacity={0.55 + 0.4 * intensity} />
        </mesh>
        <mesh position={[0, 5, 0]}>
          <sphereGeometry args={[0.8, 10, 8]} />
          <meshBasicMaterial color="#05060d" transparent opacity={0.55 + 0.4 * intensity} />
        </mesh>
        <mesh position={[0, 4.3, 0]} scale={[1, 0.7, 0.5]}>
          <coneGeometry args={[1.0, 1.8, 6]} />
          <meshBasicMaterial color="#05060d" transparent opacity={0.55 + 0.4 * intensity} />
        </mesh>
        {/* cetro y rayo */}
        <mesh position={[2.1, 3, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 6, 5]} />
          <meshBasicMaterial color="#05060d" transparent opacity={0.55 + 0.4 * intensity} />
        </mesh>
      </group>
    </group>
  )
}

export default function S03Zeus({ beat }: SceneProps) {
  const calipsoLit = useDamp(beat >= 1 ? 1 : 0)
  const spot = useDamp(beat === 1 ? 1 : 0)
  const route = useDamp(beat >= 3 ? 1 : 0, 1.2)
  const zeus = useDamp(beat >= 1 ? 1 : 0)
  const pos = HERMES_POS[Math.min(beat, HERMES_POS.length - 1)]

  return (
    <group>
      <ambientLight intensity={0.45} />
      <directionalLight position={[-4, 8, 6]} intensity={0.8} color="#ffeccc" />
      <pointLight position={[0, 3, 0]} intensity={8 + 12 * calipsoLit} color="#7fd0ff" distance={14} />

      {/* sala: suelo, pared, columnas */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[22, 16]} />
        <meshStandardMaterial color="#cfc6b4" />
      </mesh>
      <mesh position={[0, 5, -6.5]}>
        <planeGeometry args={[22, 10]} />
        <meshStandardMaterial color="#b8ad98" />
      </mesh>
      {[-8, -4.5, 4.5, 8].map((x) => (
        <mesh key={x} position={[x, 3.5, -6]}>
          <cylinderGeometry args={[0.45, 0.5, 7, 8]} />
          <meshStandardMaterial color="#efe8d8" />
        </mesh>
      ))}

      <ZeusSombra intensity={zeus} />

      {/* mesa-mapa luminoso */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[11, 0.2, 5.6]} />
        <meshStandardMaterial color="#5a3d22" />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[10.4, 0.04, 5]} />
        <meshStandardMaterial color={SEA} emissive="#0a3a7a" emissiveIntensity={0.6} />
      </mesh>
      {/* tierras */}
      <Isla position={[-4.2, 0.1, 0.6]} scale={0.9} color="#d9a441" />
      <Isla position={[-1.6, 0.1, -1.4]} scale={0.8} />
      <Isla position={[0.2, 0.1, 1.5]} scale={0.55} />
      <Isla position={[1.6, 0.1, -1.7]} scale={0.7} />
      <Isla position={[2.2, 0.1, 1.2]} scale={0.6} />
      {/* isla de Calipso: se ilumina */}
      <group position={[CALIPSO[0], 0.1, CALIPSO[2]]}>
        <mesh>
          <cylinderGeometry args={[0.95, 1.05, 0.14, 9]} />
          <meshStandardMaterial color="#58c97a" emissive="#58ff9a" emissiveIntensity={0.1 + 1.2 * calipsoLit} flatShading />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <coneGeometry args={[0.25, 0.4, 6]} />
          <meshStandardMaterial color="#1f5a2c" flatShading />
        </mesh>
        <mesh position={[0, 0.9 * calipsoLit + 0.05, 0]} scale={calipsoLit + 0.001}>
          <cylinderGeometry args={[0.04, 0.04, 1.8, 6]} />
          <meshBasicMaterial color="#8fffc0" transparent opacity={0.45} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} scale={1 + 0.5 * calipsoLit}>
          <ringGeometry args={[1.1, 1.25, 24]} />
          <meshBasicMaterial color="#8fffc0" transparent opacity={0.8 * calipsoLit} />
        </mesh>
      </group>
      {/* Olimpo: marcador de partida */}
      <mesh position={[OLIMPO[0], 0.45, OLIMPO[2]]}>
        <coneGeometry args={[0.25, 0.7, 4]} />
        <meshStandardMaterial color="#fff2b0" emissive="#ffd34a" emissiveIntensity={0.6} flatShading />
      </mesh>

      <GlowLine points={ROUTE} progress={route} color="#ffd34a" width={4} />
      <GlowLine points={ROUTE} progress={1} color="#ffd34a" width={1} opacity={0.15} dashed />

      {/* luz que señala a Hermes en el paso 1 */}
      <mesh position={[pos[0], 4, pos[2]]} scale={[spot + 0.001, 1, spot + 0.001]}>
        <cylinderGeometry args={[0.5, 1.2, 8, 12, 1, true]} />
        <meshBasicMaterial color="#fff2b0" transparent opacity={0.22 * spot} depthWrite={false} />
      </mesh>

      <Hermes
        position={pos}
        rotation={beat >= 3 ? 1.2 : 0.5}
        action={beat === 0 || beat === 3 ? 'walk' : 'idle'}
        holding={beat >= 2 ? 'carta' : undefined}
      />
    </group>
  )
}
