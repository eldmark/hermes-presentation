import { useMemo } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import { Hermes } from '../components/three/Hermes'
import { Model } from '../components/three/Model'
import { Footprints } from '../components/three/Footprints'
import { GlowLine } from '../components/three/GlowLine'
import { useDamp } from '../components/three/useDamp'
import type { Vec3 } from '../data/types'
import type { SceneProps, Shot } from '../presentation/types'

/**
 * El salón de las ideas: seis pedestales en arco (abierto hacia +Z, donde mira la cámara).
 * Paso k (1..6) enciende el pedestal k-1; el paso 7 los enciende todos. Todo deriva de `beat`.
 */
const MARBLE = '#ece7dc'
const GOLD = '#d4af37'
const CENTER: Vec3 = [0, 0, 3]
const RADIUS = 9
const ANGLES = [-1, -0.6, -0.2, 0.2, 0.6, 1]
const COLORS = ['#ffd98a', '#9fd0ff', '#9fe8c8', '#ffe27a', '#ffb3a0', '#c9f08a']

interface Slot { p: Vec3; n: Vec3; right: Vec3; hermes: Vec3; yaw: number }

const SLOTS: Slot[] = ANGLES.map((a) => {
  const p: Vec3 = [CENTER[0] + RADIUS * Math.sin(a), 0, CENTER[2] - RADIUS * Math.cos(a)]
  const n: Vec3 = [-Math.sin(a), 0, Math.cos(a)] // hacia el centro del arco
  const right: Vec3 = [Math.cos(a), 0, Math.sin(a)] // derecha vista desde la cámara
  const hermes: Vec3 = [p[0] + n[0] * 1.9 - right[0] * 2.4, 0, p[2] + n[2] * 1.9 - right[2] * 2.4]
  return { p, n, right, hermes, yaw: Math.atan2(p[0] - hermes[0], p[2] - hermes[2]) }
})

const GENERAL: Shot = { pos: [0, 5.5, 20], look: [0, 2, -6] }
const FINAL: Shot = { pos: [0, 3.4, 15], look: [0, 1.6, -10] }

export const shots: Shot[] = [
  GENERAL,
  ...SLOTS.map((s): Shot => {
    // Cámara en la normal del pedestal, desplazada y mirando a la derecha de él: Hermes queda
    // a la izquierda y el pedestal en ~40 % del ancho (la tarjeta cubre el ~42 % derecho).
    const cam: Vec3 = [s.p[0] + s.n[0] * 8.5 + s.right[0] * 1.3, 2.7, s.p[2] + s.n[2] * 8.5 + s.right[2] * 1.3]
    const look: Vec3 = [s.p[0] + s.right[0] * 1.3, 1.5, s.p[2] + s.right[2] * 1.3]
    return { pos: cam, look }
  }),
  FINAL,
]

function Cloud({ position, s = 1, yaw = 0 }: { position: Vec3; s?: number; yaw?: number }) {
  return (
    <group position={position}>
      <Model
        name="nube"
        scale={s}
        yaw={yaw}
        fallback={
          <group scale={s}>
            {[[0, 0, 0, 2.4], [2, -0.2, 0.3, 1.8], [-2, -0.2, 0.2, 1.7]].map(([x, y, z, r], i) => (
              <mesh key={i} position={[x, y, z]} scale={[1, 0.5, 1]}>
                <sphereGeometry args={[r, 8, 6]} />
                <meshStandardMaterial color="#fff" emissive="#ffffff" emissiveIntensity={0.25} />
              </mesh>
            ))}
          </group>
        }
      />
    </group>
  )
}

function Column({ position, s = 1.5 }: { position: Vec3; s?: number }) {
  return (
    <group position={position} scale={s}>
      <Model
        name="olimpo_columna"
        fallback={
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.5, 0.6, 6, 10]} />
            <meshStandardMaterial color={MARBLE} />
          </mesh>
        }
      />
    </group>
  )
}

function Scale({ level }: { level: number }) {
  const tilt = (1 - level) * 0.2
  const gold = <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.4} />
  return (
    <group scale={1.6}>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.025, 0.04, 0.6, 8]} />{gold}</mesh>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.14, 0.17, 0.04, 12]} />{gold}</mesh>
      <group position={[0, 0.6, 0]} rotation={[0, 0, tilt]}>
        <mesh><boxGeometry args={[0.7, 0.03, 0.03]} />{gold}</mesh>
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.34, 0, 0]} rotation={[0, 0, -tilt]}>
            {[-1, 1].map((c) => (
              <mesh key={c} position={[c * 0.07, -0.14, 0]} rotation={[0, 0, c * -0.5]}>
                <cylinderGeometry args={[0.004, 0.004, 0.3, 4]} />
                <meshBasicMaterial color="#fff6cf" />
              </mesh>
            ))}
            <mesh position={[0, -0.29, 0]}><cylinderGeometry args={[0.13, 0.02, 0.04, 14]} />{gold}</mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

const ISLE_ROUTE: Vec3[] = [[-0.2, 0.55, 0], [-0.8, 0.9, 0.1], [-1.5, 1.2, 0.2], [-2.2, 1.7, 0.1]]
const BOLT: Vec3[] = [[0.1, 2.0, 0], [-0.25, 1.55, 0], [0.15, 1.35, 0], [-0.2, 0.9, 0], [0.1, 0.72, 0], [-0.1, 0.3, 0]]
const PRINTS: Vec3[] = [[-0.5, 0.0, 0.35], [0, 0.0, -0.35], [0.5, 0.0, 0.35]]

/** Trazo sólido (no aditivo) para que se lea sobre el fondo claro. */
function SolidRoute({ points, lit, color, width = 4 }: { points: Vec3[]; lit: number; color: string; width?: number }) {
  return <Line visible={lit >= 0.05} points={points} color={color} lineWidth={width} transparent opacity={Math.min(1, lit)} />
}

function Island() {
  return (
    <group>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.5, 0.35, 0.2, 10]} />
        <meshStandardMaterial color="#4f8fc4" flatShading />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.38, 0.45, 0.14, 10]} />
        <meshStandardMaterial color="#c9b78a" flatShading />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <coneGeometry args={[0.3, 0.2, 8]} />
        <meshStandardMaterial color="#6f9a4a" flatShading />
      </mesh>
      <mesh position={[0.05, 0.65, 0]}>
        <coneGeometry args={[0.12, 0.45, 7]} />
        <meshStandardMaterial color="#3f7a3a" flatShading />
      </mesh>
    </group>
  )
}

function Emblem({ i, level }: { i: number; level: number }) {
  const lit = Math.max(0, Math.min(1, level))
  switch (i) {
    case 0:
      return (
        <group>
          <group position={[0.02, 0, 0]} scale={2.2} rotation={[0, 0.5, 0]}>
            <Model name="tortuga" fallback={<mesh position={[0, 0.2, 0]} scale={[1, 0.6, 1.2]}><sphereGeometry args={[0.4, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#5b7a3a" flatShading /></mesh>} />
          </group>
          <group scale={1.4} position={[0, 0.02, 0.05]}>
            <Footprints path={PRINTS.map((q): Vec3 => [q[0] * 0.6, q[1], q[2] * 0.6])} count={4} visible={lit} color="#3a2c1c" />
          </group>
        </group>
      )
    case 1:
      return <Model name="lira" scale={2.4} fallback={<Scale level={lit} />} />
    case 2:
      return (
        <group>
          <Island />
          <GlowLine points={ISLE_ROUTE} progress={lit} color="#bff3ff" width={3} />
          <SolidRoute points={ISLE_ROUTE} lit={lit} color="#2a7fb8" width={3} />
        </group>
      )
    case 3:
      return (
        <group>
          <mesh position={[0, 1.1, 0]}>
            <sphereGeometry args={[0.7, 14, 10]} />
            <meshBasicMaterial color="#ffd24d" transparent opacity={0.05 * lit} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
          <SolidRoute points={BOLT} lit={lit} color="#e8a317" width={5} />
          <GlowLine points={BOLT} progress={lit} color="#ffe27a" width={5} />
          <GlowLine points={BOLT.map((q): Vec3 => [q[0] * 1.15, q[1], q[2] + 0.02])} progress={lit} color="#fff6cf" width={2} />
        </group>
      )
    case 4:
      return (
        <group position={[0, 0.12, 0]} rotation={[0, 0.4, 0.2]}>
          <Model name="carta" scale={2.8} fallback={<mesh><boxGeometry args={[0.6, 0.12, 0.12]} /><meshStandardMaterial color="#f1e6d0" /></mesh>} />
        </group>
      )
    default:
      return (
        <group position={[0, 0, 0]}>
          <Model name="moly" scale={2.6} fallback={<mesh position={[0, 0.4, 0]}><sphereGeometry args={[0.12, 8, 6]} /><meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.3} /></mesh>} />
        </group>
      )
  }
}

/** Pedestal de mármol con anillos dorados y su emblema; `on` 0..1 lo enciende. */
function Pedestal({ i, slot, on }: { i: number; slot: Slot; on: number }) {
  const level = useDamp(on, 0.6)
  const color = COLORS[i]
  const gold = useMemo(() => new THREE.Color(GOLD), [])
  return (
    <group position={slot.p} rotation={[0, Math.atan2(slot.n[0], slot.n[2]), 0]}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.25, 1.4, 0.4, 16]} />
        <meshStandardMaterial color={MARBLE} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.85, 0.95, 0.76, 16]} />
        <meshStandardMaterial color={MARBLE} />
      </mesh>
      {[0.42, 1.2].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[y > 1 ? 1.0 : 1.0, y > 1 ? 1.0 : 0.98, 0.07, 16]} />
          <meshStandardMaterial color={gold} emissive={color} emissiveIntensity={0.15 + level * 0.9} metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
      {/* disco de luz en la cara superior */}
      <mesh position={[0, 1.245, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.95, 20]} />
        <meshBasicMaterial color={color} transparent opacity={0.35 * level} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* emblema: pequeño y tenue hasta que se enciende */}
      <group position={[0, 1.25, 0]} scale={Math.max(0.001, 0.45 + 0.55 * level)}>
        <Emblem i={i} level={level} />
      </group>
      {/* haz suave */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.8, 1.0, 3.6, 16, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.04 * level} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export default function S10Conceptos({ beat }: SceneProps) {
  const all = beat === 7
  const cols = useMemo(
    () => [-1.3, -0.9, -0.5, -0.1, 0.1, 0.5, 0.9, 1.3].map((b): Vec3 => [CENTER[0] + 15 * Math.sin(b), 0, CENTER[2] - 15 * Math.cos(b)]),
    [],
  )

  const idx = beat - 1
  const herPos: Vec3 = beat >= 1 && beat <= 6 ? SLOTS[idx].hermes : beat === 7 ? [0, 0, 1.5] : [0, 0, 9]
  const herRot = beat >= 1 && beat <= 6 ? SLOTS[idx].yaw : beat === 7 ? Math.PI : 0
  const actions = ['wave', 'point', 'point', 'point', 'point', 'idle', 'point', 'idle'] as const
  const action = actions[beat] ?? 'idle'

  return (
    <group>
      <ambientLight intensity={0.95} />
      <directionalLight position={[8, 16, 12]} intensity={1.3} color="#fff4dc" />

      {/* cielo claro y nubes */}
      <mesh>
        <sphereGeometry args={[400, 16, 10]} />
        <meshBasicMaterial color="#b9d8f2" side={THREE.BackSide} fog={false} depthWrite={false} />
      </mesh>
      <Cloud position={[-30, -2, -50]} s={3} yaw={0.4} />
      <Cloud position={[24, 1, -56]} s={3.4} yaw={2} />
      <Cloud position={[0, -3, -70]} s={4} yaw={1.2} />
      <Cloud position={[-46, 6, -20]} s={2.6} yaw={3} />
      <Cloud position={[46, 4, -16]} s={2.6} yaw={5} />
      <Cloud position={[-20, 12, -40]} s={2} yaw={4} />

      {/* suelo de mármol con anillo dorado */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[24, 48]} />
        <meshStandardMaterial color={MARBLE} />
      </mesh>
      <mesh position={[0, -0.02, CENTER[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[RADIUS + 2.6, RADIUS + 2.8, 64]} />
        <meshStandardMaterial color={GOLD} metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.02, CENTER[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[RADIUS - 2.9, RADIUS - 2.75, 64]} />
        <meshStandardMaterial color={GOLD} metalness={0.4} roughness={0.5} />
      </mesh>

      {cols.map((c, k) => <Column key={k} position={c} />)}

      {/* puertas del salón, al fondo */}
      <group position={[0, 0, -30]} scale={1.3}>
        <Model
          name="olimpo_marco"
          fallback={
            <mesh position={[0, 4, 0]}>
              <boxGeometry args={[11, 8, 1]} />
              <meshStandardMaterial color={MARBLE} />
            </mesh>
          }
        />
        <mesh position={[0, 3.8, -0.4]}>
          <planeGeometry args={[8.4, 7.6]} />
          <meshBasicMaterial color="#fff6cf" />
        </mesh>
      </group>

      {SLOTS.map((s, i) => (
        <Pedestal key={i} i={i} slot={s} on={all || beat === i + 1 ? 1 : beat > i + 1 && beat < 7 ? 0.3 : 0} />
      ))}

      <Hermes position={herPos} rotation={herRot} action={action} />
    </group>
  )
}
