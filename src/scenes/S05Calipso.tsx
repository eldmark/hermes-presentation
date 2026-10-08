import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Character } from '../components/three/Character'
import { Hermes } from '../components/three/Hermes'
import { GlowLine } from '../components/three/GlowLine'
import { useDamp } from '../components/three/useDamp'
import type { Vec3 } from '../data/types'
import type { SceneProps, Shot } from '../presentation/types'

// Un shot por paso: mar, isla, cueva, mensaje, respuesta, a-odiseo, ruta-itaca, cierre, pregunta.
export const shots: Shot[] = [
  { pos: [-18, 5, 14], look: [-12, 2.5, 6] },
  { pos: [-2, 9, 12], look: [1, 0.5, 1] },
  { pos: [-3, 2, 4.5], look: [-3, 1, -2] },
  { pos: [-1.5, 1.7, 2.2], look: [-3, 1.4, -1.5] },
  { pos: [-5, 2.2, 2.5], look: [5, 0.8, 3] },
  { pos: [1, 4, 10], look: [1, 0.5, 1.5] },
  { pos: [6, 7, 12], look: [10, 0, -4] },
  { pos: [0, 5, 14], look: [0, 4.5, 6] },
  { pos: [6, 5, 14], look: [8, 4, 3] },
]

const ISLA_Y = 0.4
const HERMES: Vec3[] = [
  [-14, 3, 8], [-6, 3.2, 4], [-2, ISLA_Y, -0.6], [-2, ISLA_Y, -0.6], [-2, ISLA_Y, -0.6],
  [-14, 4, 6], [-22, 5, 2], [0, 3, 6], [16, 4.5, 2],
]
const CALIPSO_CUEVA: Vec3 = [-3.4, ISLA_Y, -2]
const CALIPSO_COSTA: Vec3 = [4.6, ISLA_Y, 2.8]
const ODISEO_COSTA: Vec3 = [6.5, ISLA_Y, 3.6]

const RUTAS_ZEUS: Vec3[][] = [
  [[0, -0.2, 0], [-10, -0.2, 8], [-20, -0.2, 10]],
  [[0, -0.2, 0], [8, -0.2, -8], [20, -0.2, -14]],
  [[0, -0.2, 0], [12, -0.2, 8], [24, -0.2, 6]],
]
const RUTA_ITACA: Vec3[] = [
  [7.5, 0.1, 3.8], [11, 0.1, 8], [15, 0.1, 3], [13, 0.1, -3], [19, 0.1, -6], [17, 0.1, -11], [24, 0.1, -13],
]
const ARBOLES: [number, number, number][] = [
  [1, -3, 1.1], [3.5, -1, 1], [6, -2.5, 1.2], [0, 2.5, 0.9], [-1, 4, 1], [2.5, 4.5, 1.1], [-5.5, 2, 1], [5, -4.5, 1.3],
]

function Arbol({ x, z, s }: { x: number; z: number; s: number }) {
  return (
    <group position={[x, ISLA_Y, z]} scale={s}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 1, 5]} />
        <meshStandardMaterial color="#6b4a2b" flatShading />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <coneGeometry args={[0.8, 1.8, 6]} />
        <meshStandardMaterial color="#2f7d3a" flatShading />
      </mesh>
    </group>
  )
}

function Cueva() {
  const roca = <meshStandardMaterial color="#6e6a63" flatShading roughness={1} />
  return (
    <group position={[-3, ISLA_Y, -2]}>
      <mesh position={[-2.2, 1.5, 0]}><boxGeometry args={[1, 3, 4.4]} />{roca}</mesh>
      <mesh position={[2.2, 1.5, 0]}><boxGeometry args={[1, 3, 4.4]} />{roca}</mesh>
      <mesh position={[0, 3.2, 0]}><boxGeometry args={[5.4, 0.9, 4.6]} />{roca}</mesh>
      <mesh position={[0, 1.5, -2.2]}><boxGeometry args={[4.4, 3, 0.4]} /><meshStandardMaterial color="#3a342d" flatShading /></mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.4, 4.2]} />
        <meshStandardMaterial color="#8a6d4b" />
      </mesh>
    </group>
  )
}

function Telar({ weaving }: { weaving: boolean }) {
  const lanzadera = useRef<THREE.Mesh>(null)
  useFrame((s) => {
    const m = lanzadera.current
    if (!m) return
    if (weaving) m.position.x = Math.sin(s.clock.elapsedTime * 3) * 0.45
  })
  const madera = '#8b5a2b'
  return (
    <group position={[-4.7, ISLA_Y, -3]} rotation={[0, 0.4, 0]}>
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.9, 0]}><boxGeometry args={[0.1, 1.8, 0.1]} /><meshStandardMaterial color={madera} /></mesh>
      ))}
      <mesh position={[0, 1.75, 0]}><boxGeometry args={[1.35, 0.1, 0.1]} /><meshStandardMaterial color={madera} /></mesh>
      <mesh position={[0, 0.2, 0]}><boxGeometry args={[1.35, 0.1, 0.1]} /><meshStandardMaterial color={madera} /></mesh>
      <mesh position={[0, 1, 0]}><boxGeometry args={[1.1, 1.4, 0.03]} /><meshStandardMaterial color="#d9b8e0" transparent opacity={0.6} /></mesh>
      <mesh ref={lanzadera} position={[0, 1, 0.08]}><boxGeometry args={[0.3, 0.07, 0.07]} /><meshStandardMaterial color="#f2d27a" /></mesh>
    </group>
  )
}

function Imagen({ x, color, s }: { x: number; color: string; s: number }) {
  if (s < 0.02) return null
  return (
    <group position={[x, 6.6, 6]} scale={s}>
      <mesh position={[0, 0.9, 0]}>
        <capsuleGeometry args={[0.45, 1.1, 4, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 2.0, 0]}>
        <sphereGeometry args={[0.35, 10, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <torusGeometry args={[1.5, 0.04, 6, 28]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

export default function S05Calipso({ beat }: SceneProps) {
  const b = Math.min(Math.max(beat, 0), HERMES.length - 1)
  const rutasZeus = useDamp(beat === 0 ? 1 : 0, 0.8)
  const itaca = useDamp(beat >= 6 ? 1 : 0, 1.4)
  const oscuro = useDamp(beat >= 6 ? 1 : 0, 1.2)
  const luzCueva = useDamp(beat >= 3 && beat <= 4 ? 0.25 : 1, 0.6)
  const imagenes = useDamp(beat === 7 ? 1 : 0, 0.8)
  const marColor = useMemo(() => new THREE.Color(), [])
  marColor.set('#2a7fb8').lerp(new THREE.Color('#10243a'), oscuro)

  const calipso = beat >= 5 ? CALIPSO_COSTA : CALIPSO_CUEVA
  const odiseoSentado = beat < 5
  const odiseoPos: Vec3 = odiseoSentado ? [ODISEO_COSTA[0], ISLA_Y - 0.3, ODISEO_COSTA[2]] : ODISEO_COSTA

  return (
    <group>
      <ambientLight intensity={0.7} />
      <directionalLight position={[8, 12, 6]} intensity={1.2} />
      <pointLight position={[-3, 2.6, -1.5]} color="#ffb35c" intensity={14 * luzCueva} distance={9} decay={2} />

      {/* Mar */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color={marColor} transparent opacity={0.8} roughness={0.5} />
      </mesh>
      {RUTAS_ZEUS.map((r, i) => (
        <GlowLine key={i} points={r} progress={rutasZeus} color="#ffd36b" width={3} opacity={0.8} />
      ))}

      {/* Isla */}
      <mesh position={[0, ISLA_Y / 2, 0]}>
        <cylinderGeometry args={[7.5, 8.5, ISLA_Y, 14]} />
        <meshStandardMaterial color="#4f9a45" flatShading />
      </mesh>
      <mesh position={[7.2, 0.1, 3.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.6, 10]} />
        <meshStandardMaterial color="#e3d29a" />
      </mesh>
      {ARBOLES.map(([x, z, s], i) => <Arbol key={i} x={x} z={z} s={s} />)}
      <Cueva />
      <Telar weaving={beat >= 1 && beat < 3} />

      {/* Ítaca lejana */}
      <mesh position={[24, 0.6, -13]}>
        <coneGeometry args={[3, 2.2, 7]} />
        <meshStandardMaterial color={beat >= 6 ? '#8fb86a' : '#5d7a56'} flatShading />
      </mesh>
      <GlowLine points={RUTA_ITACA} progress={itaca} color="#ffe08a" width={4} opacity={0.95} dashed />

      {/* Personajes */}
      <Hermes position={HERMES[b]} action={beat === 2 || beat === 3 || beat === 4 ? 'idle' : 'fly'}
        rotation={beat >= 5 && beat <= 6 ? -Math.PI / 2 : beat === 8 ? Math.PI / 2 : 0.3}
        holding={beat >= 1 && beat <= 4 ? 'carta' : undefined} />
      <Character kind="calipso" position={calipso} rotation={beat >= 5 ? Math.PI / 2 : 0.6}
        action={beat === 5 ? 'walk' : 'idle'} />
      <Character kind="odiseo" position={odiseoPos} rotation={Math.PI / 2} action="idle" />

      {/* Tres imágenes superpuestas */}
      <Imagen x={-3} color="#ffd34d" s={imagenes} />
      <Imagen x={0} color="#3ad1b0" s={imagenes} />
      <Imagen x={3} color="#e8644f" s={imagenes} />
    </group>
  )
}
