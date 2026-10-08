import { useState } from 'react'
import * as THREE from 'three'
import type { Vec3 } from '../data/types'
import type { SceneProps, Shot } from '../presentation/types'
import { Character } from '../components/three/Character'
import { Model } from '../components/three/Model'
import { Hermes } from '../components/three/Hermes'
import { GlowLine } from '../components/three/GlowLine'
import { InfoCard3D } from '../components/three/InfoCard3D'
import { Clickable } from '../components/three/Clickable'
import { useDamp } from '../components/three/useDamp'

// Un paso por cada beat de scenes.ts (8): camino-griego, herma, mercado, ruta-mercado, roma, estatua, cierre, pregunta.
export const shots: Shot[] = [
  { pos: [-6.5, 2.6, 6], look: [-3.5, 1, 0] },
  { pos: [-2.2, 1.9, 2.6], look: [-3.2, 1.3, -1] },
  { pos: [6, 3, 6.5], look: [7, 0.8, -1] },
  { pos: [8.5, 5.5, 7.5], look: [10, 0, -5] },
  { pos: [12.5, 2.8, 6.5], look: [15, 1.5, 0] },
  { pos: [16.2, 1.7, 3.6], look: [17, 1.1, 1] },
  { pos: [9, 24, 14], look: [9, 0, -7] },
  { pos: [14, 4.5, 10], look: [21, 1, 0] },
]

const ROAD = '#b08a5a'
const GOLD = '#e8c24a'

const HERMA_X = -3.2
const MARKET_X = 7

const mix = (a: string, b: string, k: number) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), k).getHexString()

function Herma({ position }: { position: Vec3 }) {
  const placeholder = (
    <>
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.4, 1.4, 0.4]} />
        <meshStandardMaterial color="#c9c3b6" flatShading />
      </mesh>
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.28, 8, 6]} />
        <meshStandardMaterial color="#d8d2c4" flatShading />
      </mesh>
      <mesh position={[0, 1.9, 0]}>
        <sphereGeometry args={[0.2, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#b7b0a0" flatShading />
      </mesh>
      <mesh position={[0, 1.0, 0.22]}>
        <boxGeometry args={[0.1, 0.1, 0.06]} />
        <meshStandardMaterial color="#b7b0a0" />
      </mesh>
    </>
  )
  // herma.glb mide 1,5 m y mira a +Z; escala 1,35 -> ~2 m para leerse desde la cámara.
  return (
    <group position={position}>
      <Model name="herma" fallback={placeholder} scale={1.35} />
    </group>
  )
}

function Gate({ position, color }: { position: Vec3; color: string }) {
  return (
    <group position={position}>
      {[-1.1, 1.1].map((x) => (
        <mesh key={x} position={[x, 1.3, 0]}>
          <boxGeometry args={[0.5, 2.6, 0.7]} />
          <meshStandardMaterial color={color} flatShading />
        </mesh>
      ))}
      <mesh position={[0, 2.75, 0]}>
        <boxGeometry args={[3, 0.5, 0.8]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
    </group>
  )
}

function Stall({ position, color, goods }: { position: Vec3; color: string; goods: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.4, 0.8, 0.8]} />
        <meshStandardMaterial color="#7a5636" flatShading />
      </mesh>
      <mesh position={[0, 1.7, 0]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[1.7, 0.08, 1.2]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      {[-0.7, 0.7].map((x) => (
        <mesh key={x} position={[x, 0.95, -0.4]}>
          <cylinderGeometry args={[0.04, 0.04, 1.8, 5]} />
          <meshStandardMaterial color="#5a3d22" />
        </mesh>
      ))}
      {[-0.4, 0, 0.4].map((x) => (
        <mesh key={x} position={[x, 0.9, 0.05]}>
          <sphereGeometry args={[0.13, 6, 5]} />
          <meshStandardMaterial color={goods} flatShading />
        </mesh>
      ))}
    </group>
  )
}

function Arch({ position, k, color }: { position: Vec3; k: number; color: string }) {
  if (k < 0.02) return null
  return (
    <group position={position} scale={[1, k, 1]}>
      <mesh position={[0, 1.5, 0]}>
        <torusGeometry args={[0.7, 0.14, 5, 12, Math.PI]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      {[-0.7, 0.7].map((x) => (
        <mesh key={x} position={[x, 0.75, 0]}>
          <boxGeometry args={[0.28, 1.5, 0.4]} />
          <meshStandardMaterial color={color} flatShading />
        </mesh>
      ))}
    </group>
  )
}

function Money({ position }: { position: Vec3 }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.12, 8, 6]} />
      <meshStandardMaterial color="#9a6a2a" emissive={GOLD} emissiveIntensity={0.45} flatShading />
    </mesh>
  )
}

function Mercury({ position, scale }: { position: Vec3; scale: number }) {
  if (scale < 0.02) return null
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.7, 0.4, 0.7]} />
        <meshStandardMaterial color="#e8e4da" flatShading />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.14, 0.18, 0.6, 6]} />
        <meshStandardMaterial color="#c9a45a" metalness={0.5} roughness={0.5} flatShading />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.12, 7, 5]} />
        <meshStandardMaterial color="#c9a45a" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 8]} />
        <meshStandardMaterial color="#c9a45a" />
      </mesh>
      {/* vara en la mano */}
      <mesh position={[0.22, 0.85, 0.05]}>
        <cylinderGeometry args={[0.012, 0.012, 0.8, 5]} />
        <meshStandardMaterial color={GOLD} />
      </mesh>
      {/* bolsa de dinero */}
      <group position={[-0.22, 0.55, 0.1]}>
        <mesh>
          <sphereGeometry args={[0.1, 8, 6]} />
          <meshStandardMaterial color="#8a5a24" emissive={GOLD} emissiveIntensity={0.5} flatShading />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.03, 0.05, 0.05, 6]} />
          <meshStandardMaterial color={GOLD} />
        </mesh>
      </group>
    </group>
  )
}

function Island({ position, k }: { position: Vec3; k: number }) {
  if (k < 0.02) return null
  return (
    <group position={position} scale={k}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[2.6, 3.2, 0.6, 8]} />
        <meshStandardMaterial color="#d8c48a" flatShading />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[1.5, 1.8, 7]} />
        <meshStandardMaterial color="#3f8f4a" flatShading />
      </mesh>
      <pointLight color="#7fe0c0" intensity={8} distance={8} position={[0, 2.5, 0]} />
    </group>
  )
}

function Underworld({ position, k }: { position: Vec3; k: number }) {
  if (k < 0.02) return null
  return (
    <group position={position} scale={k}>
      <mesh position={[0, 0.4, 0]}>
        <coneGeometry args={[2.8, 2.8, 6]} />
        <meshStandardMaterial color="#2a2438" flatShading />
      </mesh>
      <mesh position={[0, 0.9, 2.3]}>
        <boxGeometry args={[1.2, 1.6, 0.3]} />
        <meshStandardMaterial color="#0e0b16" />
      </mesh>
      <pointLight color="#9b8cff" intensity={8} distance={8} position={[0, 2.5, 1]} />
    </group>
  )
}

export default function S08Caminos({ beat }: SceneProps) {
  const [touched, setTouched] = useState(false)

  const kCards = useDamp(beat === 1 ? 1 : 0, 0.3)
  const kRoute = useDamp(beat >= 3 ? 1 : 0, 0.9)
  const kRome = useDamp(beat >= 4 ? 1 : 0, 1.0)
  const kStatue = useDamp(beat >= 4 ? 1 : 0, 0.7)
  const kBag = useDamp(beat >= 5 ? 1 : 0, 0.5)
  const kFar = useDamp(beat >= 6 ? 1 : 0, 0.9)
  const kRoads = useDamp(beat >= 6 ? 1 : 0, 1.2)

  // Hermes camina por el camino según el paso.
  const hx = [-4.6, -3.9, 5.2, 8.6, 13.2, 16, 12.5, 14][Math.min(beat, 7)]
  const hz = beat === 3 ? -0.2 : beat === 5 ? 1.4 : 0.9
  const heading = beat === 5 ? -0.9 : Math.PI / 2
  const hAction = beat === 1 || beat === 3 || beat === 5 || beat === 6 ? 'idle' : 'walk'

  // Viajeros: pasan por el camino en el paso 0, luego se quedan en el mercado.
  const tx = [-1.2, -0.5, 6.2, 6.2, 6.2, 6.2, 6.2, 6.2][Math.min(beat, 7)]

  const groundColor = mix('#7d6a45', '#9b9788', kRome * 0.6)
  const buildCol = mix('#d9b98a', '#f1ece0', kRome)
  const roofCol = mix('#b5603f', '#e3dccb', kRome)

  const marketRoute: Vec3[] = [[MARKET_X + 1.2, 0.08, -1], [9, 0.08, -3.5], [11, 0.08, -6.5], [13.5, 0.08, -9.5]]
  const mainRoad: Vec3[] = [[-8, 0.1, 0], [3, 0.1, 0], [MARKET_X, 0.1, 0], [12, 0.1, 0], [20, 0.1, 0]]
  const toIsland: Vec3[] = [[3, 0.2, -1], [2, 0.4, -9], [0, 0.6, -17]]
  const toDead: Vec3[] = [[17, 0.2, -1], [21, 0.4, -9], [24, 0.6, -17]]

  return (
    <group>
      <ambientLight intensity={0.8} />
      <directionalLight position={[8, 14, 8]} intensity={1.6} />
      <pointLight position={[-3, 3, 2]} intensity={3} distance={9} color="#ffe2b0" />

      {/* suelo y camino de tierra */}
      <mesh position={[6, -0.05, -2]}>
        <boxGeometry args={[34, 0.1, 22]} />
        <meshStandardMaterial color={groundColor} flatShading />
      </mesh>
      <mesh position={[6, 0.01, 0]}>
        <boxGeometry args={[30, 0.04, 2.2]} />
        <meshStandardMaterial color={mix(ROAD, '#a39e92', kRome)} flatShading />
      </mesh>

      {/* Grecia: herma, puerta, mercado */}
      <Clickable onSelect={() => setTouched((t) => !t)} hint="Tocar la herma">
        <Herma position={[HERMA_X, 0, -1.3]} />
      </Clickable>
      <Gate position={[3, 0, 0]} color={mix('#d9b98a', '#f1ece0', 0)} />
      {[[3.5, -4], [10.5, -3.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 1, z]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#d9b98a" flatShading />
        </mesh>
      ))}
      <Stall position={[MARKET_X - 1.6, 0, -1.9]} color="#c0452f" goods="#e0a23a" />
      <Stall position={[MARKET_X + 0.4, 0, -2.1]} color="#2f6fb0" goods="#8a4a8a" />
      <Stall position={[MARKET_X + 2.4, 0, -1.9]} color="#3f9a55" goods="#d9d23a" />
      {/* comprador, vendedor, viajero que parte */}
      <Character kind="humano" position={[MARKET_X - 1.6, 0, -1.0]} rotation={0} action={beat === 2 ? 'wave' : 'idle'} color="#b5483a" />
      <Character kind="humano" position={[MARKET_X - 0.6, 0, -0.9]} rotation={Math.PI} action="idle" color="#4a7aa8" />
      <Character kind="humano" position={[beat >= 3 ? MARKET_X + 1.6 : MARKET_X + 2.4, 0, beat >= 3 ? -1.4 : -0.9]} rotation={-0.6} action={beat >= 3 ? 'walk' : 'idle'} color="#6a8a4a" />
      {beat === 2 && <Money position={[MARKET_X - 1.1, 1.0, -0.95]} />}
      {/* viajeros que pasan junto a la herma */}
      <Character kind="humano" position={[tx, 0, 0.1]} rotation={Math.PI / 2} action={beat <= 1 ? 'walk' : 'idle'} color="#8a6a9a" />

      {/* Roma: la arquitectura cambia de color y forma */}
      <Gate position={[12, 0, 0]} color={buildCol} />
      {[[14.5, -3.2, 2.6], [17.5, -3.4, 3.2], [20.5, -3, 2.4]].map(([x, z, h], i) => (
        <group key={i}>
          <mesh position={[x, (h * (1 + 0.3 * kRome)) / 2, z]} scale={[1, 1 + 0.3 * kRome, 1]}>
            <boxGeometry args={[2.4, h, 2.2]} />
            <meshStandardMaterial color={buildCol} flatShading />
          </mesh>
          <mesh position={[x, h * (1 + 0.3 * kRome) + 0.2, z]}>
            <boxGeometry args={[2.6, 0.4, 2.4]} />
            <meshStandardMaterial color={roofCol} flatShading />
          </mesh>
        </group>
      ))}
      <Arch position={[12, 0, 0]} k={kRome} color={buildCol} />
      <Arch position={[15.5, 0, -1.6]} k={kRome} color={buildCol} />
      <Arch position={[18.5, 0, -1.6]} k={kRome} color={buildCol} />
      {/* columnas romanas */}
      {[14, 15, 16].map((x) => (
        <mesh key={x} position={[x + 3, 0.9 * kRome, 2.6]} scale={[1, Math.max(kRome, 0.001), 1]}>
          <cylinderGeometry args={[0.18, 0.2, 1.8, 7]} />
          <meshStandardMaterial color="#f3efe4" flatShading />
        </mesh>
      ))}

      {/* estatuilla de Mercurio con bolsa */}
      <Mercury position={[17.2, 0, 1.2]} scale={kStatue} />
      {kBag > 0.02 && (
        <group position={[17.2, 0, 1.2]} scale={1 + 0.15 * kBag}>
          <pointLight color={GOLD} intensity={4 * kBag} distance={3} position={[-0.2, 0.8, 0.5]} />
        </group>
      )}
      {beat === 5 && <InfoCard3D title="Bolsa" subtitle="comercio" position={[16.4, 2.2, 1.2]} highlighted />}

      {/* cartas de la herma */}
      {kCards > 0.02 && (
        <group scale={kCards}>
          <InfoCard3D title="Puerta" position={[HERMA_X - 1.8, 2.5, -1.3]} highlighted={touched} />
          <InfoCard3D title="Cruce" position={[HERMA_X, 3.2, -1.3]} highlighted={touched} />
          <InfoCard3D title="Límite" position={[HERMA_X + 1.8, 2.5, -1.3]} highlighted={touched} />
        </group>
      )}

      {/* ruta luminosa del mercado a otra ciudad */}
      <GlowLine points={marketRoute} progress={kRoute} color="#ffd978" width={3} />
      {kRoute > 0.02 && (
        <group position={[13.8, 0, -10.2]} scale={kRoute}>
          {[[-1, 0, 1.2], [0.6, 0.4, 1.8], [1.6, -0.5, 1.0]].map(([x, z, h], i) => (
            <mesh key={i} position={[x, h / 2, z]}>
              <boxGeometry args={[1.1, h, 1.1]} />
              <meshStandardMaterial color="#d9b98a" flatShading />
            </mesh>
          ))}
        </group>
      )}

      {/* vista elevada: caminos iluminados y rutas imposibles */}
      <GlowLine points={mainRoad} progress={kRoads} color="#ffe9a8" width={4} />
      <GlowLine points={toIsland} progress={kRoads} color="#7fe0c0" width={3} dashed />
      <GlowLine points={toDead} progress={kRoads} color="#9b8cff" width={3} dashed />
      <Island position={[0, 0, -18.5]} k={kFar} />
      <Underworld position={[24, 0, -18.5]} k={kFar} />

      <Hermes position={[hx, 0, hz]} rotation={heading} action={hAction} />
    </group>
  )
}
