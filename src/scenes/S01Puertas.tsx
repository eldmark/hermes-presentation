import { Hermes } from '../components/three/Hermes'
import { ConnectionNetwork, OLYMPUS_NETWORK } from '../components/three/ConnectionNetwork'
import { Model } from '../components/three/Model'
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

function FramePlaceholder() {
  return (
    <group>
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
    </group>
  )
}

/** Hoja en coordenadas canónicas (igual que el glb): bisagra en x=0, se extiende hacia +x. */
function LeafPlaceholder() {
  return (
    <group>
      <mesh position={[2.1, 3.8, 0]}>
        <boxGeometry args={[4.2, 7.6, 0.3]} />
        <meshStandardMaterial color="#c9a24a" metalness={0.5} roughness={0.45} />
      </mesh>
      <mesh position={[2.1, 3.8, 0.2]}>
        <boxGeometry args={[3.4, 6.8, 0.1]} />
        <meshStandardMaterial color="#e6c35c" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.4, 3.6, 0.3]}>
        <sphereGeometry args={[0.18, 8, 6]} />
        <meshStandardMaterial color="#8a5a1a" />
      </mesh>
    </group>
  )
}

function Leaf({ side, open }: { side: 1 | -1; open: number }) {
  // Bisagra en el pilar. La hoja canónica se extiende hacia +x; la derecha (side=1) se
  // refleja con scale x=-1. Rotar +θ en Y lleva (r,0,0) a z=-r·sinθ (hacia -z) y el espejo
  // en x no cambia z: con θ>0 ambas hojas giran hacia el fondo.
  return (
    <group position={[side * 4.2, 0, 0]} scale={[-side, 1, 1]}>
      <group rotation={[0, open * 1.7, 0]}>
        <Model name="olimpo_hoja" fallback={<LeafPlaceholder />} />
      </group>
    </group>
  )
}

function CloudFallback() {
  return (
    <group>
      {[[0, 0, 0, 2.4], [2, -0.2, 0.3, 1.8], [-2, -0.2, 0.2, 1.7]].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} scale={[1, 0.5, 1]}>
          <sphereGeometry args={[r, 8, 6]} />
          <meshStandardMaterial color="#fff" emissive="#ffffff" emissiveIntensity={0.25} />
        </mesh>
      ))}
    </group>
  )
}

type V3 = [number, number, number]

function Cloud({ position, s = 1, yaw = 0 }: { position: V3; s?: number; yaw?: number }) {
  return (
    <group position={position}>
      <Model name="nube" fallback={<group scale={s}><CloudFallback /></group>} scale={s} yaw={yaw} />
    </group>
  )
}

function TemplePlaceholder() {
  return (
    <mesh position={[0, 5, 0]}>
      <boxGeometry args={[24, 10, 16]} />
      <meshStandardMaterial color={STONE} />
    </mesh>
  )
}

function ColumnPlaceholder() {
  return (
    <mesh position={[0, 3, 0]}>
      <cylinderGeometry args={[0.5, 0.6, 6, 8]} />
      <meshStandardMaterial color={STONE} />
    </mesh>
  )
}

/** Ciudad de los dioses a lo lejos (7 + 5 instancias en total, sin luces propias). */
function FarOlympus() {
  return (
    <group>
      {/* banco de nubes bajo la ciudad */}
      <Cloud position={[-30, 4, -78]} s={3} yaw={0.4} />
      <Cloud position={[26, 8, -92]} s={3} yaw={2.1} />
      <Cloud position={[-2, 1, -70]} s={3} yaw={1.2} />
      {/* templos y columnas */}
      <group position={[-30, 8, -80]} scale={1.3}>
        <Model name="olimpo_templo" fallback={<TemplePlaceholder />} yaw={0.15} />
      </group>
      <group position={[28, 14, -95]} scale={1.8}>
        <Model name="olimpo_templo" fallback={<TemplePlaceholder />} yaw={-0.2} />
      </group>
      <group position={[-4, 3, -72]} scale={1.6}><Model name="olimpo_columna" fallback={<ColumnPlaceholder />} /></group>
      <group position={[3, 3, -74]} scale={1.2}><Model name="olimpo_columna" fallback={<ColumnPlaceholder />} /></group>
      <group position={[8, 6, -88]} scale={2}><Model name="olimpo_columna" fallback={<ColumnPlaceholder />} /></group>
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
      <mesh position={[0, 30, -130]}>
        <planeGeometry args={[400, 200]} />
        <meshBasicMaterial color="#9fc8ee" />
      </mesh>
      <Cloud position={[-14, 3, -20]} s={1.6} yaw={0.5} />
      <Cloud position={[12, 7, -24]} s={2.2} yaw={2.4} />
      <Cloud position={[-8, 14, -30]} s={1.4} yaw={1.1} />
      <Cloud position={[18, 1, -10]} s={1.2} yaw={4} />
      <Cloud position={[-20, 6, 4]} s={1.3} yaw={3} />
      <FarOlympus />

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
      <Model name="olimpo_marco" fallback={<FramePlaceholder />} />
      <Leaf side={1} open={open} />
      <Leaf side={-1} open={open} />
      {/* luz tras las puertas */}
      <mesh position={[0, 3.8, -2]} scale={[1, 1, 1]}>
        <planeGeometry args={[8.4, 7.6]} />
        <meshBasicMaterial color="#fff6cf" transparent opacity={1 - 0.85 * open} depthWrite={false} />
      </mesh>

      <Hermes position={pos} action={action} holding={beat >= 2 ? 'carta' : undefined} rotation={beat >= 3 ? Math.PI / 2 : 0} />
    </group>
  )
}
