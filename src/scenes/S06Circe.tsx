import { Character } from '../components/three/Character'
import { Hermes } from '../components/three/Hermes'
import { useDamp } from '../components/three/useDamp'
import type { SceneProps, Shot } from '../presentation/types'

// Un shot por paso: recuerdo, cerdos, advertencia, umbral, salto.
export const shots: Shot[] = [
  { pos: [0, 6, 16], look: [0, 1, 0] },
  { pos: [5, 3.5, 9], look: [0, 1, -3] },
  { pos: [1.4, 1.7, 5.2], look: [0.9, 1.3, 3] },
  { pos: [0, 2.2, 6], look: [0, 1.2, -3] },
  { pos: [0, 7, 14], look: [0, 0, 0] },
]

const TREES: [number, number, number][] = [
  [-4, -1, 1.2], [-6, 3, 1.5], [-4.5, 7, 1], [-7, -4, 1.4], [-3.5, -7, 1.1], [-9, 1, 1.6],
  [4, 0, 1.3], [6, 4, 1.5], [4.5, 8, 1], [7.5, -3, 1.4], [3.8, -7, 1.2], [9, 2, 1.6],
  [-6.5, 10, 1.3], [6.5, 11, 1.2], [-2.8, 12, 1], [2.8, 13, 1.1],
]

function Tree({ x, z, s }: { x: number; z: number; s: number }) {
  return (
    <group position={[x, 0, z]} scale={s}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 1.2, 6]} />
        <meshStandardMaterial color="#5a3d26" flatShading />
      </mesh>
      <mesh position={[0, 1.9, 0]}>
        <coneGeometry args={[0.9, 1.8, 7]} />
        <meshStandardMaterial color="#2b6b3a" flatShading />
      </mesh>
      <mesh position={[0, 2.8, 0]}>
        <coneGeometry args={[0.6, 1.3, 7]} />
        <meshStandardMaterial color="#357a43" flatShading />
      </mesh>
    </group>
  )
}

function House() {
  return (
    <group position={[0, 0, -6]}>
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[4, 2.4, 3]} />
        <meshStandardMaterial color="#d8c7a3" flatShading />
      </mesh>
      <mesh position={[0, 3.1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[3.2, 1.8, 4]} />
        <meshStandardMaterial color="#8c3b2a" flatShading />
      </mesh>
      <mesh position={[0, 0.9, 1.51]}>
        <boxGeometry args={[1, 1.8, 0.05]} />
        <meshStandardMaterial color="#2a1a10" />
      </mesh>
      {[-1.4, 1.4].map((x) => (
        <mesh key={x} position={[x, 1.4, 1.51]}>
          <boxGeometry args={[0.6, 0.6, 0.05]} />
          <meshStandardMaterial color="#ffcf70" emissive="#ffb347" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function Pig({ position, scale }: { position: [number, number, number]; scale: number }) {
  const pink = '#f0a0b0'
  return (
    <group position={position} scale={Math.max(scale, 0.0001)} rotation={[0, 0.6, 0]}>
      <mesh position={[0, 0.45, 0]} scale={[1, 0.8, 1.5]}>
        <sphereGeometry args={[0.4, 10, 8]} />
        <meshStandardMaterial color={pink} flatShading />
      </mesh>
      <mesh position={[0, 0.55, 0.65]}>
        <sphereGeometry args={[0.25, 8, 6]} />
        <meshStandardMaterial color={pink} flatShading />
      </mesh>
      <mesh position={[0, 0.5, 0.88]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 8]} />
        <meshStandardMaterial color="#d97a8c" />
      </mesh>
      {[[-0.2, 0.4], [0.2, 0.4], [-0.2, -0.4], [0.2, -0.4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.12, z]}>
          <cylinderGeometry args={[0.06, 0.06, 0.25, 5]} />
          <meshStandardMaterial color="#d97a8c" />
        </mesh>
      ))}
    </group>
  )
}

/** Flor de moly agrandada: flor blanca, tallo verde y raíz oscura. */
function BigMoly({ scale }: { scale: number }) {
  return (
    <group position={[0.9, 1.0, 3.1]} scale={Math.max(scale, 0.0001) * 1.6}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 0.6, 6]} />
        <meshStandardMaterial color="#2f7d3a" />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.1, 10, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[Math.sin(i * 1.26) * 0.12, 0.62, Math.cos(i * 1.26) * 0.12]}>
          <sphereGeometry args={[0.06, 6, 5]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
        </mesh>
      ))}
      <mesh position={[0, -0.12, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.07, 0.25, 6]} />
        <meshStandardMaterial color="#1c120c" />
      </mesh>
    </group>
  )
}

function SmallMoly() {
  return (
    <group>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.012, 0.015, 0.24, 5]} />
        <meshStandardMaterial color="#2f7d3a" />
      </mesh>
      <mesh position={[0, 0.26, 0]}>
        <sphereGeometry args={[0.05, 8, 6]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

const COMP_X = [-1.5, -0.5, 0.5, 1.5]
const COMP_COLORS = ['#8a6a4a', '#6a7a8a', '#7a5a6a', '#6a8a5a']

export default function S06Circe({ beat }: SceneProps) {
  const sea = useDamp(beat >= 4 ? 1 : 0, 0.8) // el bosque se funde con el mar
  const pigs = useDamp(beat >= 1 ? 1 : 0, 0.5)
  const hermesIn = useDamp(beat >= 2 && beat < 4 ? 1 : 0, 0.4)
  const molyBig = useDamp(beat === 2 ? 1 : 0, 0.4)
  const forest = Math.max(1 - sea, 0.0001)

  const odiseoZ = beat === 0 ? 10 : beat === 1 ? 4 : beat === 2 ? 3 : -2.5
  const compZ = beat === 0 ? -1 : -3.6
  const flash = beat <= 3

  return (
    <group>
      <ambientLight intensity={flash ? 0.7 : 0.9} color={flash ? '#ffd9a0' : '#cfe4ff'} />
      <directionalLight position={[5, 8, 6]} intensity={flash ? 1.0 : 1.3} color={flash ? '#ffc480' : '#ffffff'} />
      <pointLight position={[0, 3, -4]} intensity={beat >= 1 && beat <= 3 ? 8 : 0} color="#ffb347" distance={9} />

      {/* mar (paso 4) y suelo del bosque */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <circleGeometry args={[30, 24]} />
        <meshStandardMaterial color="#2a6fa8" />
      </mesh>
      <group scale={[forest, 1, forest]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[18, 24]} />
          <meshStandardMaterial color="#4a7a3a" flatShading />
        </mesh>
        {/* sendero */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 3]}>
          <planeGeometry args={[1.6, 18]} />
          <meshStandardMaterial color="#b49a6a" />
        </mesh>
      </group>
      <group scale={forest}>
        <House />
        {TREES.map(([x, z, s]) => <Tree key={`${x}${z}`} x={x} z={z} s={s} />)}
      </group>

      {/* compañeros: humanos que se encogen mientras aparecen los cerdos */}
      {COMP_X.map((x, i) => (
        <group key={x}>
          <Character kind="humano" color={COMP_COLORS[i]} position={[x, 0, compZ]} rotation={Math.PI} scale={Math.max(1 - pigs, 0.0001) * forest} />
          <Pig position={[x * 1.3, 0, -3.4 + (i % 2) * 0.6]} scale={pigs * forest} />
        </group>
      ))}

      {/* Odiseo avanza solo; la planta aparece en su mano tras recibirla */}
      <Character
        kind="odiseo"
        position={[0, 0, odiseoZ]}
        rotation={beat === 2 ? Math.PI / 2 : Math.PI}
        handItem={beat >= 3 ? <SmallMoly /> : null}
      />

      {/* Hermes joven: sin protagonismo, algo menor, entrega la moly */}
      <group scale={Math.max(hermesIn, 0.0001)}>
        <Hermes position={[1.7, 0, 3]} rotation={-Math.PI / 2} scale={0.85} holding={beat === 2 ? 'moly' : undefined} />
      </group>
      <BigMoly scale={molyBig} />
    </group>
  )
}
