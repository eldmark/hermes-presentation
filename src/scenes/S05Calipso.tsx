import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Character } from '../components/three/Character'
import { Hermes } from '../components/three/Hermes'
import { Model } from '../components/three/Model'
import { GlowLine } from '../components/three/GlowLine'
import { useDamp } from '../components/three/useDamp'
import type { Vec3 } from '../data/types'
import type { SceneProps, Shot } from '../presentation/types'

// Un shot por paso: mar, isla, cueva, mensaje, respuesta, a-odiseo, ruta-itaca, cierre, pregunta.
export const shots: Shot[] = [
  { pos: [-28, 6, 26], look: [-12, 3, 8] },
  { pos: [-4, 18, 30], look: [2, 0.5, -2] },
  { pos: [0, 1.7, -2.8], look: [-4, 1.3, -9] },
  { pos: [-1.5, 1.6, -5.2], look: [-4.5, 1.4, -9] },
  { pos: [-9, 1.7, -5.5], look: [-1, 1.2, -8.5] },
  { pos: [16, 4.5, 20], look: [10.5, 1.4, 7] },
  { pos: [18, 6, 20], look: [17, 0.5, -2] },
  { pos: [4, 8, 32], look: [4, 8.5, 6] },
  { pos: [12, 8, 30], look: [14, -1, 6] },
]

const ISLA_Y = 0.4
const HERMES: Vec3[] = [
  [-22, 4.5, 17], [-12, 5, 10], [-1.8, ISLA_Y, -8.6], [-1.8, ISLA_Y, -8.6], [-1.8, ISLA_Y, -8.6],
  [-22, 6, 14], [-36, 8, 6], [4, 5, 14], [26, 7, 8],
]
const CALIPSO_CUEVA: Vec3 = [-5.4, ISLA_Y, -9.6]
const CALIPSO_COSTA: Vec3 = [9.5, ISLA_Y, 6]
const ODISEO_COSTA: Vec3 = [11.8, ISLA_Y, 7.6]

const RUTAS_ZEUS: Vec3[][] = [
  [[0, -0.2, 0], [-16, -0.2, 14], [-34, -0.2, 18]],
  [[0, -0.2, 0], [14, -0.2, -14], [34, -0.2, -24]],
  [[0, -0.2, 0], [20, -0.2, 14], [40, -0.2, 10]],
]
const RUTA_ITACA: Vec3[] = [
  [13, 0.1, 8], [18, 0.1, 13], [24, 0.1, 6], [22, 0.1, -4], [30, 0.1, -10], [28, 0.1, -18], [38, 0.1, -22],
]
// [x, z, escala, giro, modelo]. Se apartan de la cueva (x -10..2, z -10..1), de Odiseo y de la línea de la cámara.
const ARBOLES: [number, number, number, number, 'arbol' | 'cipres'][] = [
  [5, -8, 1.0, 0.4, 'arbol'], [8, -3, 0.95, 2.1, 'arbol'], [11, -7, 1.05, 4.0, 'arbol'], [2, 9, 0.9, 1.2, 'arbol'],
  [-4, 10, 0.9, 5.0, 'cipres'], [6, 11, 1.0, 3.3, 'arbol'], [-11, 4, 1.0, 2.6, 'arbol'], [9, -11, 0.9, 0.9, 'cipres'],
  [-9, 9, 0.95, 1.7, 'arbol'], [-2, -13, 0.95, 3.9, 'cipres'],
]

function Arbol({ x, z, s, yaw, kind }: { x: number; z: number; s: number; yaw: number; kind: 'arbol' | 'cipres' }) {
  const placeholder = (
    <group scale={s}>
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
  return (
    <group position={[x, ISLA_Y, z]}>
      <Model name={kind} fallback={placeholder} scale={s} yaw={yaw} />
    </group>
  )
}

const CUEVA_POS: Vec3 = [-4, ISLA_Y, -6]
const TELAR_POS: Vec3 = [-5.4, ISLA_Y, -11]

function Cueva() {
  const roca = <meshStandardMaterial color="#6e6a63" flatShading roughness={1} />
  const cajas = (
    <group position={[0, 0, 1.5]}>
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
  // cueva.glb: ~19 x 17 m, entrada hacia +Z; a 0,6 queda con interior ~7 x 6,6 m y ~2,2 m de alto.
  return (
    <group position={CUEVA_POS}>
      <Model name="cueva" fallback={cajas} scale={1.2} />
    </group>
  )
}

function Telar({ weaving }: { weaving: boolean }) {
  const lanzadera = useRef<THREE.Mesh>(null)
  useFrame((s) => {
    const m = lanzadera.current
    if (!m) return
    if (weaving) m.position.x = Math.sin(s.clock.elapsedTime * 3) * 0.4
  })
  const madera = '#8b5a2b'
  const cajas = (
    <group>
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.95, 0]}><boxGeometry args={[0.1, 1.9, 0.1]} /><meshStandardMaterial color={madera} /></mesh>
      ))}
      <mesh position={[0, 1.8, 0]}><boxGeometry args={[1.3, 0.1, 0.1]} /><meshStandardMaterial color={madera} /></mesh>
      <mesh position={[0, 0.2, 0]}><boxGeometry args={[1.3, 0.1, 0.1]} /><meshStandardMaterial color={madera} /></mesh>
      <mesh position={[0, 1, 0]}><boxGeometry args={[1.1, 1.4, 0.03]} /><meshStandardMaterial color="#d9b8e0" transparent opacity={0.6} /></mesh>
    </group>
  )
  return (
    <group position={TELAR_POS}>
      <Model name="telar" fallback={cajas} />
      {/* lanzadera delante del telar (cara +Z) */}
      <mesh ref={lanzadera} position={[0, 1, 0.3]}><boxGeometry args={[0.3, 0.07, 0.07]} /><meshStandardMaterial color="#f2d27a" /></mesh>
    </group>
  )
}

function Imagen({ x, color, s }: { x: number; color: string; s: number }) {
  if (s < 0.02) return null
  return (
    <group position={[x * 2, 11, 10]} scale={s * 1.8}>
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
      <pointLight position={[-4, 2.8, -8]} color="#ffb35c" intensity={24 * luzCueva} distance={14} decay={2} />

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
        <cylinderGeometry args={[15, 17, ISLA_Y, 18]} />
        <meshStandardMaterial color="#4f9a45" flatShading />
      </mesh>
      <mesh position={[12.5, 0.1, 7.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.2, 14]} />
        <meshStandardMaterial color="#e3d29a" />
      </mesh>
      {ARBOLES.map(([x, z, s, yaw, kind], i) => <Arbol key={i} x={x} z={z} s={s} yaw={yaw} kind={kind} />)}
      <Cueva />
      <Telar weaving={beat >= 1 && beat < 3} />

      {/* Ítaca lejana */}
      <mesh position={[38, 1.2, -22]}>
        <coneGeometry args={[6, 4.4, 7]} />
        <meshStandardMaterial color={beat >= 6 ? '#8fb86a' : '#5d7a56'} flatShading />
      </mesh>
      <GlowLine points={RUTA_ITACA} progress={itaca} color="#ffe08a" width={4} opacity={0.95} dashed />

      {/* Personajes */}
      <Hermes position={HERMES[b]} action={beat === 2 || beat === 3 || beat === 4 ? 'idle' : 'fly'}
        rotation={beat >= 2 && beat <= 4 ? 2.6 : beat >= 5 && beat <= 6 ? -Math.PI / 2 : beat === 8 ? Math.PI / 2 : 0.3}
        holding={beat >= 1 && beat <= 4 ? 'carta' : undefined} />
      <Character kind="calipso" position={calipso} rotation={beat >= 5 ? Math.PI / 2 : beat >= 2 ? -2.7 : 0.6}
        action={beat === 5 ? 'walk' : 'idle'} />
      <Character kind="odiseo" position={odiseoPos} rotation={Math.PI / 2} action="idle" />

      {/* Tres imágenes superpuestas */}
      <Imagen x={-3} color="#ffd34d" s={imagenes} />
      <Imagen x={0} color="#3ad1b0" s={imagenes} />
      <Imagen x={3} color="#e8644f" s={imagenes} />
    </group>
  )
}
