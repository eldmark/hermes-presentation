import type { Vec3 } from '../data/types'
import { GlowLine } from '../components/three/GlowLine'
import { Model } from '../components/three/Model'
import { Hermes } from '../components/three/Hermes'
import { useDamp } from '../components/three/useDamp'
import type { SceneProps, Shot } from '../presentation/types'

// Un shot por paso: mapa, orden, misión, ruta.
export const shots: Shot[] = [
  { pos: [-7, 4.5, 19], look: [-1, 7, -14] },
  { pos: [-5, 5, 14], look: [-4, 3.6, -10] },
  { pos: [-2, 8, 12], look: [-1.5, 0.2, 0.5] },
  { pos: [4, 10, 11], look: [5, 0, -1] },
]

const TS = 1.7 // escala del mapa-mesa
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

const COLUMNS: [number, number][] = [
  [-26, -30], [-18, -30], [18, -30], [26, -30],
  [-26, -12], [26, -12],
]

const HERMES_POS: Vec3[] = ([
  [-8, 0, 3.2],
  [-5.4, 0, -0.4],
  [-4.4, 0, 2.2],
  [4.2, 0, -2.2],
] as Vec3[]).map(([x, y, z]) => [x * TS, y, z * TS] as Vec3)

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
    <group position={[0, 0, -24]} scale={2.4}>
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
      <ambientLight intensity={0.4} />
      <directionalLight position={[-4, 12, 10]} intensity={0.7} color="#ffeccc" />
      <pointLight position={[0, 3, 0]} intensity={8 + 12 * calipsoLit} color="#7fd0ff" distance={14} />

      {/* sala monumental: suelo, pared de fondo, columnas */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -10]}>
        <planeGeometry args={[70, 50]} />
        <meshStandardMaterial color="#cfc6b4" />
      </mesh>
      <mesh position={[0, 13, -34]}>
        <planeGeometry args={[70, 26]} />
        <meshStandardMaterial color="#b8ad98" />
      </mesh>
      {COLUMNS.map(([x, z]) => (
        <group key={`${x}_${z}`} position={[x, 0, z]}>
          <Model
            name="olimpo_columna"
            scale={4}
            fallback={
              <mesh position={[0, 12, 0]}>
                <cylinderGeometry args={[1.3, 1.5, 24, 10]} />
                <meshStandardMaterial color="#efe8d8" />
              </mesh>
            }
          />
        </group>
      ))}

      {/* trono de Zeus al fondo, mirando hacia +z; se inclina y brilla cuando habla */}
      <group position={[0, 0, -23]} rotation={[0.04 * zeus, 0, 0]}>
        <Model name="zeus" fallback={<ZeusSombra intensity={zeus} />} />
      </group>
      <pointLight position={[0, 12, -17]} intensity={60 + 900 * zeus} color="#ffd98a" distance={60} />

      {/* mesa-mapa luminoso */}
      <group scale={[TS, TS, TS]}>
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
      </group>

      {/* luz que señala a Hermes en el paso 1 */}
      <mesh position={[pos[0], 10, pos[2]]} scale={[spot + 0.001, 1, spot + 0.001]}>
        <cylinderGeometry args={[0.8, 1.6, 20, 12, 1, true]} />
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
