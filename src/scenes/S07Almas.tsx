import { useMemo } from 'react'
import * as THREE from 'three'
import { Character } from '../components/three/Character'
import { Hermes } from '../components/three/Hermes'
import { GlowLine } from '../components/three/GlowLine'
import { ConnectionNetwork, OLYMPUS_NETWORK } from '../components/three/ConnectionNetwork'
import { useDamp } from '../components/three/useDamp'
import type { Vec3 } from '../data/types'
import type { SceneProps, Shot } from '../presentation/types'

// Ruta a lo largo de +x. Palacio en x=0, umbral en x=30, prado desde x=40.
// Pasos: 0 itaca, 1 almas-siguen, 2 ruta-hitos, 3 vacila, 4 asfodelos, 5 pausa, 6 palabras, 7 salida
export const shots: Shot[] = [
  { pos: [-4, 5, 24], look: [-3, 2.5, -2] },
  { pos: [4, 4.5, 19], look: [2, 2.2, -3] },
  { pos: [12, 5.5, 11], look: [16, 1.5, 0] },
  { pos: [14, 2.4, 1], look: [32, 1.7, 0] },
  { pos: [37, 3.5, 7.5], look: [41, 1.4, 0] },
  { pos: [20, 3, 12], look: [30, 1.8, 1] },
  { pos: [32, 2.2, 8.5], look: [27.5, 1.7, 4.8] },
  { pos: [18, 16, 20], look: [26, 0, -1] },
]

const HERMES_X = [-8, 4, 14, 32, 38, 26.5, 26.5, 32]
const HERMES_Z = [6, 0, 0, 0, 0, 4.8, 4.8, 0.8]
const SOUL_COLORS = ['#9aa5b5', '#a79db0', '#8fa3a0', '#b0a79a', '#98a0b8']
const NET_OFFSET: Vec3 = [31, 0, 0]
const ROUTE_GLOW: Vec3[] = [[-2, 0.12, 0], [8, 0.12, 0.6], [18, 0.12, -0.6], [31, 0.12, 0.2]]

const soulZ = (i: number) => (i % 2 === 0 ? -0.9 : 0.9) + (i === 4 ? 0.3 : 0)

function soulPos(i: number, beat: number): Vec3 {
  if (beat === 0) return [-4 + i * 2, 0, -4 + (i % 3) * 0.9]
  if (beat >= 5) return [44 + i * 1.5, 0, soulZ(i)]
  if (beat === 3) return i === 0 ? [29.2, 0, 0] : [26 - i * 1.2, 0, soulZ(i)]
  const L = HERMES_X[beat]
  return [L - 2.2 - i * 1.2, 0, soulZ(i)]
}

function Mat({ color, o = 1, emissive }: { color: string; o?: number; emissive?: string }) {
  return (
    <meshStandardMaterial
      color={color}
      flatShading
      transparent={o < 0.999}
      opacity={o}
      depthWrite={o > 0.98}
      emissive={emissive ?? '#000000'}
      emissiveIntensity={emissive ? 0.8 : 0}
    />
  )
}

function Palace({ dim, dissolve }: { dim: number; dissolve: number }) {
  const o = 1 - dissolve
  const stone = useMemo(() => '#' + new THREE.Color('#d9cdb4').lerp(new THREE.Color('#3b3a46'), dim).getHexString(), [dim])
  const roof = useMemo(() => '#' + new THREE.Color('#b5614a').lerp(new THREE.Color('#2e2a36'), dim).getHexString(), [dim])
  if (o < 0.02) return null
  return (
    <group position={[0, 0, -5]} scale={1.7}>
      <mesh position={[0, 0.15, 0]}><boxGeometry args={[9, 0.3, 5]} /><Mat color={stone} o={o} /></mesh>
      {[-3.6, -2.16, -0.72, 0.72, 2.16, 3.6].map((x) => (
        <mesh key={x} position={[x, 1.6, 2]}><cylinderGeometry args={[0.28, 0.32, 2.6, 8]} /><Mat color={stone} o={o} /></mesh>
      ))}
      <mesh position={[0, 3.1, 0.5]}><boxGeometry args={[9, 0.4, 4.4]} /><Mat color={stone} o={o} /></mesh>
      <mesh position={[0, 4.1, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.2, 2.2, 4.4, 3]} />
        <Mat color={roof} o={o} />
      </mesh>
      <mesh position={[0, 1.5, -1.8]}><boxGeometry args={[7, 3, 0.4]} /><Mat color={stone} o={o} /></mesh>
      <mesh position={[0, 1.0, -1.58]}><boxGeometry args={[1.4, 1.8, 0.1]} /><Mat color="#1c1a22" o={o} /></mesh>
    </group>
  )
}

function Raft({ o }: { o: number }) {
  if (o < 0.02) return null
  return (
    <group position={[-5, 0.12, 7]} rotation={[0, 0.3, 0]}>
      {[-0.6, -0.3, 0, 0.3, 0.6].map((z) => (
        <mesh key={z} position={[0, 0, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 2.2, 6]} /><Mat color="#8a5f3a" o={o} />
        </mesh>
      ))}
      <mesh position={[0, 1.2, 0]}><cylinderGeometry args={[0.04, 0.04, 2.2, 5]} /><Mat color="#6b4a2a" o={o} /></mesh>
      <mesh position={[0, 1.5, 0.35]}><boxGeometry args={[0.04, 1.2, 0.7]} /><Mat color="#efe6d2" o={o} /></mesh>
    </group>
  )
}

function Asfodelos({ s }: { s: number }) {
  const spots = useMemo(() => {
    const out: Vec3[] = []
    for (let i = 0; i < 44; i++) {
      const a = Math.sin(i * 12.9898) * 43758.5453
      const b = Math.sin(i * 78.233) * 12345.678
      out.push([40.5 + (a - Math.floor(a)) * 18, 0, (b - Math.floor(b) - 0.5) * 12])
    }
    return out
  }, [])
  if (s < 0.01) return null
  return (
    <group scale={[1, s, 1]}>
      <mesh position={[49.5, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 16]} /><meshStandardMaterial color="#5c6458" />
      </mesh>
      {spots.map((p, i) => (
        <group key={i} position={p} scale={1.8}>
          <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.02, 0.025, 0.8, 4]} /><meshStandardMaterial color="#7d8a6c" /></mesh>
          <mesh position={[0, 0.85, 0]}><coneGeometry args={[0.07, 0.3, 5]} /><meshStandardMaterial color="#e9e4d2" emissive="#e9e4d2" emissiveIntensity={0.25} /></mesh>
        </group>
      ))}
    </group>
  )
}

function Landmarks({ s }: { s: number }) {
  if (s < 0.01) return null
  const dreams: Vec3[] = [[0, 1.4, -3], [0.8, 2.4, 3], [-0.6, 3, -2], [0.4, 1.0, 3.4], [-0.5, 2.0, 2], [0.3, 3.2, 0]]
  return (
    <group scale={[1, s, 1]}>
      {/* agua de Océano */}
      <mesh position={[10, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[3.2, 16]} /><meshStandardMaterial color="#3a6fa0" emissive="#1d3a5a" emissiveIntensity={0.5} /></mesh>
      {/* roca blanca */}
      <mesh position={[15, 1.8, -4]} scale={[2.4, 2.8, 2]}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#f1f1ec" flatShading /></mesh>
      <mesh position={[17.4, 0.7, -3]} scale={1.6}><dodecahedronGeometry args={[0.5, 0]} /><meshStandardMaterial color="#e6e6df" flatShading /></mesh>
      {/* puertas del Sol */}
      <group position={[20, 0, 0]} scale={1.6}>
      {[-2.2, 2.2].map((z) => (
        <mesh key={z} position={[0, 1.6, z]}><cylinderGeometry args={[0.22, 0.26, 3.2, 8]} /><meshStandardMaterial color="#d9a441" emissive="#8a6a1c" emissiveIntensity={0.6} /></mesh>
      ))}
      <mesh position={[0, 3.3, 0]}><boxGeometry args={[0.5, 0.3, 5.2]} /><meshStandardMaterial color="#d9a441" emissive="#8a6a1c" emissiveIntensity={0.6} /></mesh>
      <mesh position={[0, 4.1, 0]}><sphereGeometry args={[0.5, 12, 10]} /><meshBasicMaterial color="#ffd36b" /></mesh>
      </group>
      {/* región de los Sueños */}
      <group position={[25, 0, 0]}>
        {dreams.map((p, i) => (
          <mesh key={i} position={p} scale={0.5 + (i % 3) * 0.25}>
            <sphereGeometry args={[0.5, 10, 8]} />
            <meshStandardMaterial color="#6c5b9a" emissive="#4b3d7a" emissiveIntensity={0.7} transparent opacity={0.55} depthWrite={false} />
          </mesh>
        ))}
      </group>
      {/* umbral */}
      <group position={[30, 0, 0]} scale={1.7}>
        {[-1.6, 1.6].map((z) => (
          <mesh key={z} position={[0, 1.4, z]}><boxGeometry args={[0.6, 2.8, 0.6]} /><meshStandardMaterial color="#8a8d96" flatShading /></mesh>
        ))}
        <mesh position={[0, 2.95, 0]}><boxGeometry args={[0.7, 0.4, 4.2]} /><meshStandardMaterial color="#8a8d96" flatShading /></mesh>
      </group>
    </group>
  )
}

function LivingGlimpse({ s }: { s: number }) {
  if (s < 0.01) return null
  return (
    <group position={[29, 0, -11]} scale={[1.8, 1.8 * s, 1.8]}>
      <mesh position={[0, 0.9, 0]}><boxGeometry args={[2.4, 1.8, 1.8]} /><meshStandardMaterial color="#d9b88a" flatShading /></mesh>
      <mesh position={[0, 2.2, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[1.9, 0.9, 4]} /><meshStandardMaterial color="#b5614a" flatShading /></mesh>
      <mesh position={[0, 0.9, 0.92]}><boxGeometry args={[0.7, 0.7, 0.05]} /><meshBasicMaterial color="#ffc46b" /></mesh>
      <pointLight position={[0, 1.2, 2]} color="#ffb869" intensity={8} distance={9} />
    </group>
  )
}

export default function S07Almas({ beat }: SceneProps) {
  const dim = useDamp(beat >= 1 ? 1 : 0, 0.9)
  const dissolve = useDamp(beat >= 2 ? 1 : 0, 1.0)
  const seaO = 1 - dissolve
  const routeO = useDamp(beat >= 7 ? 0.25 : beat >= 2 ? 1 : 0, 0.8)
  const landmarks = useDamp(beat >= 2 ? 1 : 0, 0.8)
  const meadow = useDamp(beat >= 4 ? 1 : 0, 1.0)
  const living = useDamp(beat >= 5 && beat < 7 ? 1 : 0, 0.8)
  const glow = useDamp(beat >= 7 ? 1 : 0, 1.4)
  const lit = useDamp(beat >= 7 ? OLYMPUS_NETWORK.links.length : 0, 1.6)

  const hx = HERMES_X[Math.min(beat, 7)]
  const hz = HERMES_Z[Math.min(beat, 7)]
  const hRot = beat === 3 ? -Math.PI / 2 : beat >= 5 && beat <= 6 ? Math.PI / 2 : 0
  const b = Math.min(beat, 7)

  return (
    <group>
      <ambientLight intensity={0.75 - 0.4 * dim} color="#b9c2d8" />
      <directionalLight position={[8, 14, 10]} intensity={1.4 - 0.7 * dim} color="#e6e9f5" />

      {/* mar, costa y balsa */}
      {seaO > 0.02 && (
        <>
          <mesh position={[-4, -0.05, 10]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[26, 14]} /><Mat color="#3f78b0" o={seaO} />
          </mesh>
          <mesh position={[-4, -0.02, 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[26, 3.4]} /><Mat color="#d8c79a" o={seaO} />
          </mesh>
        </>
      )}
      <Raft o={seaO} />

      <Palace dim={dim} dissolve={dissolve} />

      {/* ruta oscura */}
      {routeO > 0.02 && (
        <mesh position={[22, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[48, 7]} />
          <meshStandardMaterial color="#3a3f52" transparent opacity={routeO} depthWrite={false} />
        </mesh>
      )}
      <Landmarks s={landmarks} />
      <Asfodelos s={meadow} />
      <LivingGlimpse s={living} />

      {/* ruta que se vuelve línea luminosa y red de la portada */}
      <GlowLine points={ROUTE_GLOW} progress={glow} color="#ffd36b" width={3} />
      <group position={NET_OFFSET}>
        <ConnectionNetwork nodes={OLYMPUS_NETWORK.nodes} links={OLYMPUS_NETWORK.links} lit={lit} color="#ffd36b" arc={0.12} />
      </group>

      <Hermes position={[hx, 0, hz]} rotation={hRot} scale={1.1} />
      {SOUL_COLORS.map((c, i) => (
        <Character
          key={i}
          kind="alma"
          color={beat === 0 ? '#6b6272' : c}
          ghost={beat !== 0}
          position={soulPos(i, b)}
          rotation={beat === 0 ? 0 : Math.PI / 2}
        />
      ))}
    </group>
  )
}
