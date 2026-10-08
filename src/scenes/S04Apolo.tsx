import { useMemo } from 'react'
import { Color } from 'three'
import type { Vec3 } from '../data/types'
import { Character } from '../components/three/Character'
import { Hermes } from '../components/three/Hermes'
import { Model } from '../components/three/Model'
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
  { pos: [-7, 3.4, 14], look: [0, 2.0, 0] },     // 0 patio (losa a 0,5 m), Apolo toca
  { pos: [0.8, 1.9, 2.4], look: [2.6, 1.5, 0] },  // 1 acercamiento a las cuerdas
  { pos: [10, 1.0, -38], look: [-1, 1.2, -48] },  // 2 pastos, cámara baja
  { pos: [0, 42, -44], look: [0, 0, -56] },       // 3 cenital
  { pos: [-8, 3, -48], look: [5, 0.8, -58] },     // 4 Apolo investiga
  { pos: [2.5, 1.7, -76.5], look: [0, 0.5, -84] }, // 5 dentro de la boca de la cueva, cuna
  { pos: [-34, 10, -48], look: [-34, 8.5, -84] },  // 6 sala de Zeus, trono enorme y los dos pequeños delante
  { pos: [8, 3, -52], look: [0, 1, -62] },        // 7 devolución del ganado
  { pos: [5, 2, -54], look: [-1, 1.3, -61] },     // 8 la lira
  { pos: [-4, 2.7, 11], look: [1, 1.7, 0] },      // 9 regreso al patio
  { pos: [5, 3.4, 11], look: [0, 2.0, 0] },       // 10 pregunta
  { pos: [14, 3.5, 14], look: [20, 3, 5] },       // 11 salida
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

// Lira en la mano derecha del glb (misma calibración que Hermes holding="lira"): 0,3 m x 1,8 = 0,55 m.
function HandLyre() {
  return (
    <group rotation={[1.7, 0, 0]}>
      <Model name="lira" scale={1.8} fallback={<Lyre s={0.8} />} />
    </group>
  )
}

// Hermes bebé: humano genérico pequeño.
const BABY = 0.38

function CowPlaceholder() {
  return (
    <>
      <mesh position={[0, 0.75, 0]}><boxGeometry args={[0.6, 0.6, 1.3]} /><meshStandardMaterial color="#8a5a3a" flatShading /></mesh>
      <mesh position={[0, 0.95, -0.85]}><boxGeometry args={[0.4, 0.4, 0.45]} /><meshStandardMaterial color="#a06b45" flatShading /></mesh>
      {[-0.22, 0.22].map((x) => (
        <mesh key={x} position={[x, 1.2, -0.9]} rotation={[0, 0, x * -3]}><coneGeometry args={[0.04, 0.22, 4]} /><meshStandardMaterial color="#f2ead0" /></mesh>
      ))}
      {[[-0.2, -0.5], [0.2, -0.5], [-0.2, 0.5], [0.2, 0.5]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.22, z]}><cylinderGeometry args={[0.07, 0.07, 0.45, 5]} /><meshStandardMaterial color="#5a3a24" /></mesh>
      ))}
    </>
  )
}

// El modelo de Blender mira hacia +z y mide ~3,3 m de largo; el placeholder mira hacia -z y mide ~1,5 m.
const COW_MODEL_SCALE = 0.5

function Cow({ position, rot = 0 }: { position: Vec3; rot?: number }) {
  return (
    <group position={position} rotation={[0, rot, 0]}>
      <Model name="ganado" scale={COW_MODEL_SCALE} yaw={Math.PI} fallback={<CowPlaceholder />} />
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

function TreePlaceholder() {
  return (
    <>
      <mesh position={[0, 0.8, 0]}><cylinderGeometry args={[0.15, 0.2, 1.6, 6]} /><meshStandardMaterial color="#6b4a2a" /></mesh>
      <mesh position={[0, 2.2, 0]}><coneGeometry args={[1.1, 2.2, 7]} /><meshStandardMaterial color="#3c7a3a" flatShading /></mesh>
    </>
  )
}

// Olivo (5 m) y ciprés (8 m) alternados; el giro varía por ejemplar.
function Tree({ position, i }: { position: Vec3; i: number }) {
  const cypress = i % 2 === 1
  return (
    <group position={position}>
      <Model name={cypress ? 'cipres' : 'arbol'} scale={cypress ? 0.8 : 1} yaw={i * 2.1 + 0.7} fallback={<TreePlaceholder />} />
    </group>
  )
}

// Altura de la losa del templo (el modelo la deja a ~0,5 m).
const SLAB = 0.5

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
      <Model name="olimpo_templo" fallback={
        <group position={[0, SLAB, 0]}>
          <mesh position={[0, -0.05, 0]}><boxGeometry args={[24, 0.1, 16]} /><meshStandardMaterial color="#e6dfcf" /></mesh>
          {[-10, -4, 4, 10].map((x) => <Column key={x} position={[x, 0, -7]} />)}
          <mesh position={[0, 4.4, -7]}><boxGeometry args={[22, 0.3, 1.2]} /><meshStandardMaterial color="#d8cfb6" /></mesh>
          <mesh position={[3, 0.25, -0.8]}><boxGeometry args={[1.4, 0.5, 1.4]} /><meshStandardMaterial color="#cfc6ae" /></mesh>
        </group>
      } />

      {/* hilos de las cuerdas hacia el paisaje del recuerdo */}
      {strings.map((x) => (
        <GlowLine key={x} points={[[2.5 + x, 1.1, 0.2], [1 + x * 6, 1.2, -12], [x * 10, 0.6, -30], [x * 8, 0.3, -44]]} progress={linesP} color="#ffd27a" width={2} opacity={0.9} />
      ))}

      {/* PASTOS DE APOLO */}
      <mesh position={[0, -0.06, -48]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[22, 24]} /><meshStandardMaterial color="#6fa24a" /></mesh>
      <mesh position={[-6, 0.5, -45]}><dodecahedronGeometry args={[1.3, 0]} /><meshStandardMaterial color="#8a8a86" flatShading /></mesh>
      {[[-14, -38], [12, -40], [-12, -58], [13, -56], [-16, -48]].map(([x, z], i) => <Tree key={`${x}${z}`} i={i} position={[x, 0, z]} />)}
      {cows.map((p, i) => <Cow key={i} position={p} rot={0} />)}
      <Footprints path={PATH} count={22} visible={printsV} reversed={beat >= 3} color="#3a2a1a" />

      {/* CUEVA DE MAIA */}
      {/* cueva.glb: entrada hacia +z, interior ~12 x 11 m; la entrada queda hacia z=-75 */}
      <group position={[0, 0, -84]}>
        <Model name="cueva" fallback={
          <>
            <mesh position={[0, -0.05, 0]}><boxGeometry args={[14, 0.1, 12]} /><meshStandardMaterial color="#6b5d4d" /></mesh>
            <mesh position={[0, 3, -3]}><sphereGeometry args={[7, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#5a4c40" flatShading side={2} /></mesh>
          </>
        } />
      </group>
      <group position={[0, 0, -84]} rotation={[0, Math.PI / 2, 0]}>
        <Model name="cuna" fallback={
          <>
            <mesh position={[0, 0.3, 0]}><boxGeometry args={[1.3, 0.3, 0.8]} /><meshStandardMaterial color="#8a5a2b" /></mesh>
            <mesh position={[0, 0.5, 0]}><boxGeometry args={[1.15, 0.12, 0.65]} /><meshStandardMaterial color="#f3ede0" /></mesh>
            {[-0.6, 0.6].map((x) => (
              <mesh key={x} position={[x, 0.1, 0]} rotation={[0, 0, x * 0.5]}><boxGeometry args={[0.08, 0.2, 0.9]} /><meshStandardMaterial color="#6b4220" /></mesh>
            ))}
          </>
        } />
      </group>
      {beat >= 5 && beat <= 7 && (
        <group position={[1.4, 0.02, -82]} rotation={[-1.4, 0.4, 0]}>
          <Model name="lira" scale={1.8} fallback={<Lyre s={0.9} />} />
        </group>
      )}

      {/* SALA DE ZEUS: trono al fondo (-z), mira hacia +z */}
      <mesh position={[-34, -0.05, -76]}><boxGeometry args={[30, 0.1, 32]} /><meshStandardMaterial color="#8c93a8" /></mesh>
      {[[-47, -68], [-21, -68], [-47, -82], [-21, -82]].map(([x, z]) => (
        <group key={`${x}${z}`} position={[x, 0, z]}>
          <Model name="olimpo_columna" scale={1.5} fallback={<Column position={[0, 0, 0]} h={9} />} />
        </group>
      ))}
      {/* halo detrás del trono: aparece en el paso 6 */}
      <mesh position={[-34, 11, -92]} scale={[0.4 + 0.6 * shadow, 0.4 + 0.6 * shadow, 1]}>
        <circleGeometry args={[15, 32]} />
        <meshBasicMaterial color="#ffe9a8" transparent opacity={0.35 * shadow} depthWrite={false} />
      </mesh>
      <group position={[-34, 0, -84]} scale={0.94 + 0.06 * shadow}>
        <Model name="zeus" fallback={
          <>
            <mesh position={[0, 0.6, 0]}><boxGeometry args={[3, 1.2, 2]} /><meshStandardMaterial color="#4a4f66" /></mesh>
            <mesh position={[0, 3.5, -2.5]}><planeGeometry args={[12, 7]} /><meshBasicMaterial color="#e8eaff" transparent opacity={0.25 + 0.5 * shadow} /></mesh>
            <group position={[0, 1.2, 0]} scale={[1, shadow, 1]}>
              <mesh position={[0, 2, 0]}><capsuleGeometry args={[1, 2.4, 4, 8]} /><meshBasicMaterial color="#05050f" transparent opacity={0.92} /></mesh>
              <mesh position={[0, 4.2, 0]}><sphereGeometry args={[0.75, 10, 8]} /><meshBasicMaterial color="#05050f" transparent opacity={0.92} /></mesh>
              <mesh position={[0, 5, 0]}><coneGeometry args={[0.8, 0.5, 8]} /><meshBasicMaterial color="#05050f" /></mesh>
            </group>
          </>
        } />
      </group>

      {/* PERSONAJES: presente (patio) */}
      {present && (
        <Character key="apolo-patio" kind="apolo" position={[3, SLAB, 0]} rotation={-Math.PI / 2} action="play"
          handItem={<Lyre position={[0, 0, 0.1]} s={0.8} />} glbHandItem={<HandLyre />} />
      )}
      {beat <= 1 && <Hermes key="h-patio-a" position={[-5, SLAB, 3]} rotation={Math.PI / 2} action="idle" />}
      {beat >= 9 && <Hermes key="h-patio-b" position={beat >= 11 ? [24, 3, 5] : [-1.5, SLAB, 2]} rotation={Math.PI / 2}
        action={beat >= 11 ? 'fly' : 'idle'} />}

      {/* recuerdo */}
      {beat === 2 && <Character key="h-roca" kind="humano" color="#3b82c4" position={[-6, 1.6, -45]} rotation={0.5} scale={BABY} action="idle" />}
      {beat === 3 && <Character key="h-roca" kind="humano" color="#3b82c4" position={[-6, 1.6, -45]} rotation={-0.5} scale={BABY} action="idle" />}
      {(beat === 4 || beat === 5) && <Character key="h-cuna" kind="humano" color="#3b82c4" position={[0, 0.32, -84]} rotation={Math.PI / 2} scale={BABY} action="sleep" />}
      {(beat === 4 || beat === 5) && <Character key="maia" kind="maia" position={[2.6, 0, -85]} rotation={-Math.PI / 2 - 0.4} action="idle" />}
      {beat >= 4 && beat <= 5 && (
        <Character key="apolo-a" kind="apolo" position={beat === 4 ? [5, 0, -58] : [-2.6, 0, -81]}
          rotation={beat === 4 ? 2.6 : Math.PI * 0.8} action={beat === 4 ? 'point' : 'idle'} />
      )}
      {beat === 6 && (
        <>
          <Character key="apolo-h" kind="apolo" position={[-37, 0, -68]} rotation={0} action="point" />
          <Character key="h-sala" kind="humano" color="#3b82c4" position={[-31, 0, -68]} rotation={0} scale={BABY} action="idle" />
        </>
      )}
      {(beat === 7 || beat === 8) && (
        <>
          <Character key="apolo-b" kind="apolo" position={[2, 0, -60]} rotation={Math.PI} action="idle" />
          <Character key="h-pasto" kind="humano" color="#3b82c4" position={[-3, 0, -60]} rotation={Math.PI} scale={BABY}
            handItem={beat === 8 ? <Lyre s={0.5} /> : undefined} glbHandItem={beat === 8 ? <HandLyre /> : undefined}
            action={beat === 8 ? 'play' : 'idle'} />
        </>
      )}
    </group>
  )
}
