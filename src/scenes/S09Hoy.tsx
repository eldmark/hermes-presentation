import { useRef } from 'react'
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
  { pos: [-31, 3.5, PATH_Z + 11], look: [-26, 0.8, PATH_Z - 2] },
  { pos: [ST.cielo + 0.8, 3.5, PATH_Z + 11], look: [ST.cielo + 0.8, 0.8, PATH_Z - 3] },
  { pos: [ST.semana + 0.8, 3.5, PATH_Z + 11], look: [ST.semana + 0.8, 0.8, PATH_Z - 3] },
  { pos: [ST.calle + 0.8, 3.5, PATH_Z + 11], look: [ST.calle + 0.8, 0.8, PATH_Z - 3] },
  { pos: [0.5, 3, 14], look: [0.5, 1, 0] },
  { pos: [1, 4, 15], look: [1, 0.8, 0] },
  { pos: [1, 5, 18], look: [1, 0.8, -1] },
  { pos: [0.5, 2.4, 8], look: [0.5, 1.7, 1.5] },
]

function Planet({ on }: { on: number }) {
  return (
    <group position={[ST.cielo, 3, PATH_Z - 3]} scale={Math.max(0.001, on) * 1.3}>
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
    <group position={[ST.semana, 2.4, PATH_Z - 3]} scale={Math.max(0.001, on) * 1.4}>
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
    <group position={[ST.calle, 0, PATH_Z - 3]} scale={Math.max(0.001, on) * 1.2}>
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

/** Carta grande con sello cuyo color parpadea (la palabra cambia de letras). */
function Carta({ on }: { on: number }) {
  const seal = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(({ clock }) => {
    const m = seal.current
    if (!m) return
    const t = Math.floor(clock.elapsedTime * 4) % 4
    m.color.set(['#b3202a', '#e8c24a', '#3a7bd5', '#4a9a4a'][t])
  })
  return (
    <group position={[0.5, 3.4, 2.6]} scale={Math.max(0.001, on)}>
      <mesh><boxGeometry args={[1.6, 1.1, 0.04]} /><meshStandardMaterial color="#fffaf0" /></mesh>
      <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.03, 14]} />
        <meshBasicMaterial ref={seal} color="#b3202a" />
      </mesh>
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

  return (
    <group>
      <ambientLight intensity={0.6} />
      <directionalLight position={[6, 10, 8]} intensity={1.1} />
      <pointLight position={[0.5, 4, 3]} intensity={beat >= 6 ? 30 : 6} color="#ffd978" />

      {/* nubes de fondo: cielo en los pasos 0 y 1 */}
      {beat <= 1 && (
        <group>
          <group position={[-34, 9, -6]}><Model name="nube" fallback={null} scale={2.2} yaw={0.6} /></group>
          <group position={[-22, 12, -10]}><Model name="nube" fallback={null} scale={2.8} yaw={2.2} /></group>
          <group position={[-12, 8, -4]}><Model name="nube" fallback={null} scale={1.8} yaw={4} /></group>
        </group>
      )}

      {/* camino de siglos */}
      {pathFade > 0.01 && (
        <group>
          <GlowLine points={PATH} progress={pathP} color="#ffd978" width={4} opacity={pathFade} />
          {[-30, -26, -22, -18, -14, -10].map((x) => (
            <mesh key={x} position={[x, 0.15, PATH_Z + 0.6]} scale={pathFade}>
              <boxGeometry args={[0.15, 0.3, 0.15]} />
              <meshStandardMaterial color="#6b5d86" />
            </mesh>
          ))}
        </group>
      )}

      {/* tres estaciones */}
      <Planet on={cielo} />
      <Calendar on={semana} />
      <CaduceoSymbol on={calle} />
      {cielo > 0.05 && <InfoCard3D position={[ST.cielo, 5.3, PATH_Z - 3]} title="Mercurio" subtitle="el cielo" highlighted={beat === 1 || beat >= 3} />}
      {semana > 0.05 && <InfoCard3D position={[ST.semana, 4.8, PATH_Z - 3]} title="miércoles" subtitle="dies Mercurii" highlighted={beat === 2 || beat >= 3} />}
      {calle > 0.05 && <InfoCard3D position={[ST.calle, 4.7, PATH_Z - 3]} title="caduceo" subtitle="la calle" highlighted={beat >= 3} />}

      {/* red del Olimpo (pareja de la portada) */}
      <group scale={Math.max(0.001, netOn) * 1.2}>
        {Object.entries(OLYMPUS_NETWORK.nodes).map(([id, p]) => (
          <mesh key={id} position={p}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#4a4a6a" />
          </mesh>
        ))}
        <ConnectionNetwork nodes={OLYMPUS_NETWORK.nodes} links={OLYMPUS_NETWORK.links} lit={lit} color="#ffd978" arc={0.12} pulse={beat >= 6} />
      </group>

      <Hermes
        position={target}
        rotation={beat <= 3 ? Math.PI / 2 : 0}
        action={walking ? 'walk' : beat >= 6 ? 'wave' : 'idle'}
        holding={beat >= 7 ? 'carta' : undefined}
      />
      <Carta on={carta} />
    </group>
  )
}
