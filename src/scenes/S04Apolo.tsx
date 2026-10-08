import { useMemo } from 'react'
import { Color } from 'three'
import type { Vec3 } from '../data/types'
import { Character } from '../components/three/Character'
import { Hermes } from '../components/three/Hermes'
import { Footprints } from '../components/three/Footprints'
import { GlowLine } from '../components/three/GlowLine'
import { useDamp } from '../components/three/useDamp'
import type { SceneProps, Shot } from '../presentation/types'

/*
 * Coordenadas locales. Patio del Olimpo (presente) en el origen; pastos hacia -z;
 * cueva de Maia más allá; sala de Zeus a la izquierda de la cueva.
 * Pasos: 0 lira-suena, 1 entra-recuerdo, 2 robo, 3 robo-huellas, 4 investigacion,
 * 5 cuna-finge, 6 ante-zeus, 7 devolucion, 8 lira-acuerdo, 9 regreso-patio,
 * 10 pregunta-filosofica, 11 salida.
 */
export const shots: Shot[] = [
  { pos: [-6, 3, 12], look: [0, 1.2, 0] },       // 0 patio, Apolo toca
  { pos: [0.8, 1.4, 2.4], look: [2.6, 1.0, 0] },  // 1 acercamiento a las cuerdas
  { pos: [10, 1.0, -38], look: [-1, 1.2, -48] },  // 2 pastos, cámara baja
  { pos: [0, 42, -44], look: [0, 0, -56] },       // 3 cenital
  { pos: [-8, 3, -48], look: [5, 0.8, -58] },     // 4 Apolo investiga
  { pos: [4, 2, -72], look: [0, 0.6, -82] },      // 5 cueva, cuna
  { pos: [-34, 4, -62], look: [-34, 3, -80] },    // 6 sala de Zeus
  { pos: [8, 3, -52], look: [0, 1, -62] },        // 7 devolución del ganado
  { pos: [5, 2, -54], look: [-1, 1.3, -61] },     // 8 la lira
  { pos: [-4, 2.2, 9], look: [1, 1.2, 0] },       // 9 regreso al patio
  { pos: [5, 3, 9], look: [0, 1.5, 0] },          // 10 pregunta
  { pos: [14, 3, 12], look: [20, 2, 5] },         // 11 salida
]

const PATH: Vec3[] = [[3, 0.02, -46], [6, 0.02, -55], [2, 0.02, -64], [0, 0.02, -70]]
const COWS: Vec3[] = [[3, 0, -45], [6, 0, -47], [1, 0, -43], [8, 0, -44], [4, 0, -49]]
const COW_DELTA: Vec3 = [-3, 0, -20]

// luz por paso: [color, intensidad ambiente, intensidad direccional]
const LIGHT: [string, number, number][] = [
  ['#fff1d6', 0.7, 1.5], ['#fff1d6', 0.7, 1.5], ['#ff9a5a', 0.55, 1.4], ['#ff9a5a', 0.55, 1.4],
  ['#ffc8c0', 0.6, 1.3], ['#9fb0ff', 0.35, 0.8], ['#7a86ff', 0.3, 0.7], ['#ffb27a', 0.55, 1.2],
  ['#ffd27a', 0.8, 1.6], ['#fff1d6', 0.7, 1.5], ['#fff1d6', 0.7, 1.5], ['#fff1d6', 0.7, 1.5],
]

function Lyre({ position = [0, 0, 0], rotation = [0, 0, 0] as Vec3, s = 1 }: { position?: Vec3; rotation?: Vec3; s?: number }) {
  return (
    <group position={position} rotation={rotation} scale={s}>
      <mesh position={[0, 0.2, 0]}><boxGeometry args={[0.36, 0.34, 0.08]} /><meshStandardMaterial color="#8a5a2b" /></mesh>
      {[-0.17, 0.17].map((x) => (
        <mesh key={x} position={[x, 0.55, 0]}><boxGeometry args={[0.04, 0.45, 0.04]} /><meshStandardMaterial color="#e8c24a" /></mesh>
      ))}
      <mesh position={[0, 0.78, 0]}><boxGeometry args={[0.42, 0.04, 0.04]} /><meshStandardMaterial color="#e8c24a" /></mesh>
    </group>
  )
}

function Cow({ position, rot = 0 }: { position: Vec3; rot?: number }) {
  return (
    <group position={position} rotation={[0, rot, 0]}>
      <mesh position={[0, 0.75, 0]}><boxGeometry args={[0.6, 0.6, 1.3]} /><meshStandardMaterial color="#8a5a3a" flatShading /></mesh>
      <mesh position={[0, 0.95, -0.85]}><boxGeometry args={[0.4, 0.4, 0.45]} /><meshStandardMaterial color="#a06b45" flatShading /></mesh>
      {[-0.22, 0.22].map((x) => (
        <mesh key={x} position={[x, 1.2, -0.9]} rotation={[0, 0, x * -3]}><coneGeometry args={[0.04, 0.22, 4]} /><meshStandardMaterial color="#f2ead0" /></mesh>
      ))}
      {[[-0.2, -0.5], [0.2, -0.5], [-0.2, 0.5], [0.2, 0.5]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.22, z]}><cylinderGeometry args={[0.07, 0.07, 0.45, 5]} /><meshStandardMaterial color="#5a3a24" /></mesh>
      ))}
    </group>
  )
}

function Column({ position, h = 4 }: { position: Vec3; h?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]}><cylinderGeometry args={[0.35, 0.4, h, 10]} /><meshStandardMaterial color="#efe8d8" flatShading /></mesh>
      <mesh position={[0, h + 0.1, 0]}><boxGeometry args={[1, 0.2, 1]} /><meshStandardMaterial color="#e2d9c2" /></mesh>
    </group>
  )
}

function Tree({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.8, 0]}><cylinderGeometry args={[0.15, 0.2, 1.6, 6]} /><meshStandardMaterial color="#6b4a2a" /></mesh>
      <mesh position={[0, 2.2, 0]}><coneGeometry args={[1.1, 2.2, 7]} /><meshStandardMaterial color="#3c7a3a" flatShading /></mesh>
    </group>
  )
}

export default function S04Apolo({ beat }: SceneProps) {
  const present = beat <= 1 || beat >= 9
  const cattleT = useDamp(beat >= 3 ? 1 : 0, 1.2)
  const printsV = useDamp(beat >= 3 ? 1 : beat === 2 ? 0.45 : 0, 0.8)
  const linesP = useDamp(beat >= 1 && beat <= 2 ? 1 : 0, 1.0)
  const shadow = useDamp(beat === 6 ? 1 : 0, 0.8)
  const li = LIGHT[Math.min(beat, LIGHT.length - 1)]
  const target = useMemo(() => new Color(li[0]), [li])
  const r = useDamp(target.r), g = useDamp(target.g), b = useDamp(target.b)
  const amb = useDamp(li[1]), dir = useDamp(li[2])
  const lightColor = useMemo(() => new Color(r, g, b), [r, g, b])

  const cows = COWS.map((c): Vec3 => [c[0] + COW_DELTA[0] * cattleT, 0, c[2] + COW_DELTA[2] * cattleT])
  const strings = [-0.16, -0.08, 0, 0.08, 0.16]

  return (
    <group>
      <ambientLight intensity={amb} color={lightColor} />
      <directionalLight position={[8, 14, 6]} intensity={dir} color={lightColor} />
      {beat >= 5 && beat <= 6 && <pointLight position={[0, 3, -80]} intensity={20} distance={14} color="#ffb060" />}

      {/* PATIO DEL OLIMPO */}
      <mesh position={[0, -0.05, 0]}><boxGeometry args={[24, 0.1, 16]} /><meshStandardMaterial color="#e6dfcf" /></mesh>
      {[-10, -4, 4, 10].map((x) => <Column key={x} position={[x, 0, -7]} />)}
      <mesh position={[0, 4.4, -7]}><boxGeometry args={[22, 0.3, 1.2]} /><meshStandardMaterial color="#d8cfb6" /></mesh>
      <mesh position={[3, 0.25, -0.8]}><boxGeometry args={[1.4, 0.5, 1.4]} /><meshStandardMaterial color="#cfc6ae" /></mesh>

      {/* hilos de las cuerdas hacia el paisaje del recuerdo */}
      {strings.map((x) => (
        <GlowLine key={x} points={[[2.5 + x, 1.1, 0.2], [1 + x * 6, 1.2, -12], [x * 10, 0.6, -30], [x * 8, 0.3, -44]]} progress={linesP} color="#ffd27a" width={2} opacity={0.9} />
      ))}

      {/* PASTOS DE APOLO */}
      <mesh position={[0, -0.06, -48]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[22, 24]} /><meshStandardMaterial color="#6fa24a" /></mesh>
      <mesh position={[-6, 0.5, -45]}><dodecahedronGeometry args={[1.3, 0]} /><meshStandardMaterial color="#8a8a86" flatShading /></mesh>
      {[[-14, -38], [12, -40], [-12, -58], [13, -56], [-16, -48]].map(([x, z]) => <Tree key={`${x}${z}`} position={[x, 0, z]} />)}
      {cows.map((p, i) => <Cow key={i} position={p} rot={0} />)}
      <Footprints path={PATH} count={22} visible={printsV} reversed={beat >= 3} color="#3a2a1a" />

      {/* CUEVA DE MAIA */}
      <mesh position={[0, -0.05, -80]}><boxGeometry args={[14, 0.1, 12]} /><meshStandardMaterial color="#6b5d4d" /></mesh>
      <mesh position={[0, 3, -87]}><sphereGeometry args={[7, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#5a4c40" flatShading side={2} /></mesh>
      <group position={[0, 0, -83]}>
        <mesh position={[0, 0.3, 0]}><boxGeometry args={[1.3, 0.3, 0.8]} /><meshStandardMaterial color="#8a5a2b" /></mesh>
        <mesh position={[0, 0.5, 0]}><boxGeometry args={[1.15, 0.12, 0.65]} /><meshStandardMaterial color="#f3ede0" /></mesh>
        {[-0.6, 0.6].map((x) => (
          <mesh key={x} position={[x, 0.1, 0]} rotation={[0, 0, x * 0.5]}><boxGeometry args={[0.08, 0.2, 0.9]} /><meshStandardMaterial color="#6b4220" /></mesh>
        ))}
      </group>
      {beat >= 5 && beat <= 7 && <Lyre position={[1.2, 0.01, -82]} rotation={[-1.4, 0.4, 0]} s={0.9} />}

      {/* SALA DE ZEUS (sombra) */}
      <mesh position={[-34, -0.05, -76]}><boxGeometry args={[16, 0.1, 18]} /><meshStandardMaterial color="#8c93a8" /></mesh>
      {[[-41, -68], [-27, -68], [-41, -82], [-27, -82]].map(([x, z]) => <Column key={`${x}${z}`} position={[x, 0, z]} h={6} />)}
      <mesh position={[-34, 3.5, -85.5]}><planeGeometry args={[12, 7]} /><meshBasicMaterial color="#e8eaff" transparent opacity={0.25 + 0.5 * shadow} /></mesh>
      <mesh position={[-34, 0.6, -83]}><boxGeometry args={[3, 1.2, 2]} /><meshStandardMaterial color="#4a4f66" /></mesh>
      <group position={[-34, 1.2, -83]} scale={[1, shadow, 1]}>
        <mesh position={[0, 2, 0]}><capsuleGeometry args={[1, 2.4, 4, 8]} /><meshBasicMaterial color="#05050f" transparent opacity={0.92} /></mesh>
        <mesh position={[0, 4.2, 0]}><sphereGeometry args={[0.75, 10, 8]} /><meshBasicMaterial color="#05050f" transparent opacity={0.92} /></mesh>
        <mesh position={[0, 5, 0]}><coneGeometry args={[0.8, 0.5, 8]} /><meshBasicMaterial color="#05050f" /></mesh>
      </group>

      {/* PERSONAJES: presente (patio) */}
      {present && (
        <Character key="apolo-patio" kind="apolo" position={[3, 0.5, 0]} rotation={-Math.PI / 2} action="play"
          handItem={<Lyre position={[0, 0, 0.1]} s={0.8} />} />
      )}
      {beat <= 1 && <Hermes key="h-patio-a" position={[-5, 0, 3]} rotation={Math.PI / 2} action="idle" />}
      {beat >= 9 && <Hermes key="h-patio-b" position={beat >= 11 ? [24, 2.5, 5] : [-1.5, 0, 2]} rotation={Math.PI / 2}
        action={beat >= 11 ? 'fly' : 'idle'} />}

      {/* recuerdo */}
      {beat === 2 && <Hermes key="h-roca" position={[-6, 1.6, -45]} rotation={0.5} scale={0.5} action="idle" />}
      {beat === 3 && <Hermes key="h-roca" position={[-6, 1.6, -45]} rotation={-0.5} scale={0.5} action="idle" />}
      {(beat === 4 || beat === 5) && <Hermes key="h-cuna" position={[0, 0.7, -83]} rotation={0} scale={0.4} action="sleep" />}
      {beat >= 4 && beat <= 5 && (
        <Character key="apolo-a" kind="apolo" position={beat === 4 ? [5, 0, -58] : [-1.5, 0, -77]}
          rotation={beat === 4 ? 2.6 : Math.PI} action={beat === 4 ? 'point' : 'idle'} />
      )}
      {beat === 6 && (
        <>
          <Character key="apolo-h" kind="apolo" position={[-36.5, 0, -72]} rotation={0} action="point" />
          <Hermes key="h-sala" position={[-31.5, 0, -72]} rotation={0} scale={0.5} action="idle" />
        </>
      )}
      {(beat === 7 || beat === 8) && (
        <>
          <Character key="apolo-b" kind="apolo" position={[2, 0, -60]} rotation={Math.PI} action="idle" />
          <Hermes key="h-pasto" position={[-3, 0, -60]} rotation={Math.PI} scale={0.5}
            holding={beat === 8 ? 'lira' : undefined} action={beat === 8 ? 'play' : 'idle'} />
        </>
      )}
    </group>
  )
}
