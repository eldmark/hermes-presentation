import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Hermes } from '../components/three/Hermes'
import { GlowLine } from '../components/three/GlowLine'
import { ConnectionNetwork, OLYMPUS_NETWORK } from '../components/three/ConnectionNetwork'
import { InfoCard3D } from '../components/three/InfoCard3D'
import { Model } from '../components/three/Model'
import { useDamp } from '../components/three/useDamp'
import type { Vec3 } from '../data/types'
import type { SceneProps, Shot } from '../presentation/types'

// Estaciones al frente (z = 10); la red del Olimpo queda en el origen.
const PATH_Z = 10
const PATH: Vec3[] = [[-32, 0.05, PATH_Z], [-10, 0.05, PATH_Z]]
const ST = { cielo: -23, semana: -17, calle: -11 }
const HERMES_POS: Vec3[] = [
  [-28, 0, PATH_Z], [ST.cielo + 1.5, 0, PATH_Z], [ST.semana + 1.5, 0, PATH_Z], [ST.calle + 1.5, 0, PATH_Z],
  [0.5, 0, 0], [0.5, 0, 0], [0.5, 0, 0], [0.5, 0, 1.5],
]
const NET_LIT = [0, 0, 0, 0, 0, 5, 10, 10]

export const shots: Shot[] = [
  { pos: [-31, 4, PATH_Z + 13], look: [-26, 2.4, PATH_Z - 2] },
  { pos: [ST.cielo + 0.8, 4, PATH_Z + 13], look: [ST.cielo + 0.8, 2.6, PATH_Z - 3] },
  { pos: [ST.semana + 0.8, 4, PATH_Z + 13], look: [ST.semana + 0.8, 2.6, PATH_Z - 3] },
  { pos: [ST.calle - 3, 4.2, PATH_Z + 17], look: [ST.calle - 3, 2.4, PATH_Z - 3] },
  { pos: [0.5, 3, 14], look: [0.5, 1, 0] },
  { pos: [1, 4, 15], look: [1, 0.8, 0] },
  { pos: [1, 5, 18], look: [1, 0.8, -1] },
  { pos: [0.5, 2.4, 8], look: [0.5, 1.7, 1.5] },
]

const rnd = (i: number, k: number) => {
  const a = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453
  return a - Math.floor(a)
}

/** Alfa radial: el suelo de nubes se desvanece hacia el horizonte (disco de radio 110 m). */
function fadeTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  gr.addColorStop(0, '#fff'); gr.addColorStop(0.3, '#fff'); gr.addColorStop(0.65, '#555'); gr.addColorStop(1, '#000')
  g.fillStyle = gr
  g.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(c)
}
function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  gr.addColorStop(0, 'rgba(255,244,214,1)'); gr.addColorStop(0.25, 'rgba(255,232,170,0.55)'); gr.addColorStop(1, 'rgba(255,225,160,0)')
  g.fillStyle = gr
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

const CLOUDS = Array.from({ length: 22 }, (_, i) => {
  const side = i % 3
  const x = side === 0 ? -70 + rnd(i, 1) * 50 : side === 1 ? -30 + rnd(i, 1) * 60 : 10 + rnd(i, 1) * 40
  return { x, z: -6 - rnd(i, 2) * 70, y: -1.4 + rnd(i, 3) * 0.8, s: 2.2 + rnd(i, 4) * 1.6, yaw: rnd(i, 5) * 6.2 }
}).concat([{ x: -48, z: 4, y: -1.6, s: 3, yaw: 1 }])

/** Suelo de nubes con sol y el Olimpo a lo lejos. `drop` baja el suelo cuando Hermes queda en medio de la red. */
function Ambiente({ drop }: { drop: number }) {
  const fade = useMemo(fadeTexture, [])
  const glow = useMemo(glowTexture, [])
  return (
    <group>
      <group position={[0, -drop, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-12, -0.14, 0]} renderOrder={-1}>
          <circleGeometry args={[110, 40]} />
          <meshStandardMaterial color="#f7f4ee" emissive="#e9e6e0" emissiveIntensity={0.6} alphaMap={fade} transparent depthWrite={false} />
        </mesh>
        {CLOUDS.map((c, i) => (
          <group key={i} position={[c.x, c.y, c.z]}>
            <Model name="nube" fallback={null} scale={c.s} yaw={c.yaw} />
          </group>
        ))}
      </group>
      {/* sol */}
      <sprite position={[-12, 15, -70]} scale={[36, 36, 1]}>
        <spriteMaterial map={glow} transparent depthWrite={false} fog={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <mesh position={[-12, 15, -70]}>
        <circleGeometry args={[3.2, 28]} />
        <meshBasicMaterial color="#fff6d8" fog={false} toneMapped={false} />
      </mesh>
      {/* el Olimpo, lejano */}
      <group position={[-40, 2, -62]} scale={1.5}><Model name="olimpo_templo" fallback={null} yaw={0.25} /></group>
      <group position={[18, 4, -78]} scale={2}><Model name="olimpo_templo" fallback={null} yaw={-0.3} /></group>
      <group position={[-12, 1, -58]} scale={1.8}><Model name="olimpo_columna" fallback={null} /></group>
      <group position={[-8, 1, -60]} scale={1.4}><Model name="olimpo_columna" fallback={null} /></group>
      <group position={[-17, 1, -57]} scale={1.5}><Model name="olimpo_columna" fallback={null} /></group>
    </group>
  )
}

function Planet({ on }: { on: number }) {
  return (
    <group position={[ST.cielo, 3, PATH_Z - 3]} scale={Math.max(0.001, on) * 2}>
      <mesh>
        <sphereGeometry args={[0.9, 20, 14]} />
        <meshStandardMaterial color="#b8a58c" roughness={0.9} />
      </mesh>
      <mesh rotation={[1.35, 0.3, 0]}>
        <torusGeometry args={[1.5, 0.04, 6, 36]} />
        <meshBasicMaterial color="#ffe9a8" transparent opacity={0.55} />
      </mesh>
    </group>
  )
}

function Calendar({ on }: { on: number }) {
  return (
    <group position={[ST.semana, 2.4, PATH_Z - 3]} scale={Math.max(0.001, on) * 2.2}>
      <mesh><boxGeometry args={[1.8, 1.8, 0.08]} /><meshStandardMaterial color="#f4f1ea" /></mesh>
      <mesh position={[0, 0.7, 0.05]}><boxGeometry args={[1.8, 0.4, 0.04]} /><meshStandardMaterial color="#c2403a" /></mesh>
      {[0, 1, 2, 3, 4, 5, 6].map((d) => (
        <mesh key={d} position={[-0.7 + d * 0.233, -0.1, 0.05]}>
          <boxGeometry args={[0.16, 0.16, 0.02]} />
          <meshStandardMaterial color={d === 2 ? '#e8c24a' : '#c9c4b8'} emissive={d === 2 ? '#e8c24a' : '#000'} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function CaduceoSymbol({ on }: { on: number }) {
  return (
    <group position={[ST.calle, 0, PATH_Z - 3]} scale={Math.max(0.001, on) * 1.7}>
      <mesh position={[0, 1.5, 0]}><cylinderGeometry args={[0.07, 0.07, 3, 8]} /><meshStandardMaterial color="#e8c24a" metalness={0.5} roughness={0.4} /></mesh>
      <mesh position={[0, 3.1, 0]}><sphereGeometry args={[0.16, 10, 8]} /><meshStandardMaterial color="#e8c24a" /></mesh>
      {[0, Math.PI].map((ph, i) => (
        <group key={i}>
          {Array.from({ length: 9 }, (_, j) => (
            <mesh key={j} position={[Math.sin(ph + j * 0.9) * 0.28, 1.0 + j * 0.2, Math.cos(ph + j * 0.9) * 0.1]}>
              <sphereGeometry args={[0.07, 6, 5]} />
              <meshStandardMaterial color={i ? '#2f7d3a' : '#4a9a4a'} />
            </mesh>
          ))}
        </group>
      ))}
      {[1, -1].map((s) => (
        <mesh key={s} position={[s * 0.45, 2.85, 0]} rotation={[0, 0, s * -0.4]} scale={[1, 0.35, 0.4]}>
          <coneGeometry args={[0.3, 0.9, 4]} />
          <meshStandardMaterial color="#fff" flatShading />
        </mesh>
      ))}
    </group>
  )
}

/** Carta de respaldo: hoja con sello cuyo color parpadea (la palabra cambia de letras). */
function CartaPlano() {
  const seal = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(({ clock }) => {
    const m = seal.current
    if (!m) return
    const t = Math.floor(clock.elapsedTime * 4) % 4
    m.color.set(['#b3202a', '#e8c24a', '#3a7bd5', '#4a9a4a'][t])
  })
  return (
    <>
      <mesh><boxGeometry args={[1.6, 1.1, 0.04]} /><meshStandardMaterial color="#fffaf0" /></mesh>
      <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.03, 14]} />
        <meshBasicMaterial ref={seal} color="#b3202a" />
      </mesh>
    </>
  )
}

/** El papiro sellado de Hermes, grande y flotando. */
function Carta({ on }: { on: number }) {
  const g = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const o = g.current
    if (!o) return
    o.rotation.y = Math.sin(clock.elapsedTime * 0.6) * 0.45
    o.position.y = 3.6 + Math.sin(clock.elapsedTime * 1.2) * 0.08
  })
  return (
    <group ref={g} position={[0.5, 3.6, 2.6]} scale={Math.max(0.001, on)}>
      <Model name="carta" scale={5} fallback={<CartaPlano />} />
    </group>
  )
}

export default function S09Hoy({ beat }: SceneProps) {
  const b = Math.min(beat, HERMES_POS.length - 1)
  const target = HERMES_POS[b]
  const sx = useDamp(target[0], 0.6)
  const walking = Math.abs(sx - target[0]) > 0.3
  const pathP = useDamp(beat >= 0 ? Math.min(1, 0.35 + beat * 0.25) : 0, 0.8)
  const pathFade = useDamp(beat <= 3 ? 1 : 0)
  const cielo = useDamp(beat >= 1 ? 1 : 0, 0.4)
  const semana = useDamp(beat >= 2 ? 1 : 0, 0.4)
  const calle = useDamp(beat >= 3 ? 1 : 0, 0.4)
  const lit = useDamp(NET_LIT[b], 1.2)
  const netOn = useDamp(beat >= 4 ? 1 : 0)
  const carta = useDamp(beat >= 7 ? 1 : 0)
  const drop = useDamp(beat >= 4 ? 6.5 : 0, 1.0)

  return (
    <group>
      <ambientLight intensity={0.6} />
      <directionalLight position={[6, 10, 8]} intensity={1.1} />
      <pointLight position={[0.5, 4, 3]} intensity={beat >= 6 ? 30 : 6} color="#ffd978" />

      <Ambiente drop={drop} />

      {/* camino de siglos */}
      {pathFade > 0.01 && (
        <group>
          <GlowLine points={PATH} progress={pathP} color="#ffd978" width={4} opacity={pathFade} />
          {[-30, -26, -22, -18, -14, -10].map((x) => (
            <group key={x} position={[x, 0, PATH_Z - 1.3]} scale={pathFade}>
              <mesh position={[0, 0.2, 0]}><boxGeometry args={[0.9, 0.4, 0.9]} /><meshStandardMaterial color="#d9d2c0" flatShading /></mesh>
              <mesh position={[0, 0.85, 0]}><boxGeometry args={[0.5, 0.9, 0.5]} /><meshStandardMaterial color="#efe9da" flatShading /></mesh>
              <mesh position={[0, 1.45, 0]}><boxGeometry args={[0.62, 0.3, 0.62]} /><meshStandardMaterial color="#e0b64a" emissive="#9a7418" emissiveIntensity={0.5} flatShading /></mesh>
            </group>
          ))}
        </group>
      )}

      {/* tres estaciones */}
      <Planet on={cielo} />
      <Calendar on={semana} />
      <CaduceoSymbol on={calle} />
      {cielo > 0.05 && <group position={[ST.cielo, 6.2, PATH_Z - 3]} scale={1.5}><InfoCard3D position={[0, 0, 0]} title="Mercurio" subtitle="el cielo" highlighted={beat === 1 || beat >= 3} /></group>}
      {semana > 0.05 && <group position={[ST.semana, 5.8, PATH_Z - 3]} scale={1.5}><InfoCard3D position={[0, 0, 0]} title="miércoles" subtitle="dies Mercurii" highlighted={beat === 2 || beat >= 3} /></group>}
      {calle > 0.05 && <group position={[ST.calle, 6.8, PATH_Z - 3]} scale={1.5}><InfoCard3D position={[0, 0, 0]} title="caduceo" subtitle="la calle" highlighted={beat >= 3} /></group>}

      {/* red del Olimpo (pareja de la portada) */}
      <group scale={Math.max(0.001, netOn) * 1.2}>
        {Object.entries(OLYMPUS_NETWORK.nodes).map(([id, p]) => (
          <mesh key={id} position={p}>
            <sphereGeometry args={[0.15, 10, 8]} />
            <meshBasicMaterial color="#4a4a6a" />
          </mesh>
        ))}
        <ConnectionNetwork nodes={OLYMPUS_NETWORK.nodes} links={OLYMPUS_NETWORK.links} lit={lit} color="#ffd978" arc={0.12} pulse={beat >= 6} />
      </group>

      <Hermes
        position={target}
        rotation={beat <= 3 ? Math.PI / 2 : 0}
        action={walking ? 'walk' : beat >= 6 ? 'wave' : beat >= 4 ? 'fly' : 'idle'}
        holding={beat >= 7 ? 'carta' : undefined}
      />
      <Carta on={carta} />
    </group>
  )
}
