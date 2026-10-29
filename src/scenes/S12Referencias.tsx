import * as THREE from 'three'
import { Hermes } from '../components/three/Hermes'
import { Model } from '../components/three/Model'
import type { Vec3 } from '../data/types'
import type { SceneProps, Shot } from '../presentation/types'

/**
 * Despedida: Hermes saluda frente a las puertas del Olimpo ya abiertas, con luz de atardecer.
 * Paso 0: plano frontal; pasos 1-4: la cámara se aleja despacio (el panel cubre el centro).
 */
export const shots: Shot[] = [
  { pos: [0, 3.6, 30], look: [0, 0.4, 0] },
  { pos: [0, 4.4, 34], look: [0, 1.2, 0] },
  { pos: [0, 5.2, 38], look: [0, 2, -2] },
  { pos: [0, 6, 42], look: [0, 2.8, -3] },
  { pos: [0, 6.8, 47], look: [0, 3.6, -4] },
  { pos: [0, 7.4, 51], look: [0, 4.2, -4] },
  { pos: [0, 8, 55], look: [0, 4.8, -5] },
]

const STONE = '#e9e2d3'
const GOLD = '#d4af37'

function FramePlaceholder() {
  return (
    <group>
      {[-4.2, 4.2].map((x) => (
        <mesh key={x} position={[x, 4.1, 0]}>
          <cylinderGeometry args={[0.8, 0.9, 8.2, 10]} />
          <meshStandardMaterial color={STONE} flatShading />
        </mesh>
      ))}
      <mesh position={[0, 8.9, 0]}>
        <boxGeometry args={[10.6, 0.9, 2]} />
        <meshStandardMaterial color={STONE} />
      </mesh>
      <mesh position={[0, 10.1, 0]} rotation={[Math.PI / 2, Math.PI / 4, 0]} scale={[1, 1, 0.6]}>
        <coneGeometry args={[5.4, 1.6, 3]} />
        <meshStandardMaterial color={STONE} flatShading />
      </mesh>
      <mesh position={[0, 10, 0.8]}>
        <sphereGeometry args={[0.6, 12, 8]} />
        <meshStandardMaterial color={GOLD} metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  )
}

function LeafPlaceholder() {
  return (
    <mesh position={[2.1, 3.8, 0]}>
      <boxGeometry args={[4.2, 7.6, 0.3]} />
      <meshStandardMaterial color="#c9a24a" metalness={0.5} roughness={0.45} />
    </mesh>
  )
}

/** Hoja abierta (misma convención que la escena 1: bisagra en el pilar, abre hacia el fondo). */
function Leaf({ side }: { side: 1 | -1 }) {
  return (
    <group position={[side * 4.2, 0, 0]} scale={[-side, 1, 1]}>
      <group rotation={[0, 1.7, 0]}>
        <Model name="olimpo_hoja" fallback={<LeafPlaceholder />} />
      </group>
    </group>
  )
}

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
                <meshStandardMaterial color="#fff2e0" emissive="#ffd9a8" emissiveIntensity={0.25} />
              </mesh>
            ))}
          </group>
        }
      />
    </group>
  )
}

const temple = <mesh position={[0, 5, 0]}><boxGeometry args={[24, 10, 16]} /><meshStandardMaterial color={STONE} /></mesh>
const column = <mesh position={[0, 3, 0]}><cylinderGeometry args={[0.5, 0.6, 6, 8]} /><meshStandardMaterial color={STONE} /></mesh>

function FarOlympus() {
  return (
    <group>
      <Cloud position={[-30, 4, -78]} s={3} yaw={0.4} />
      <Cloud position={[26, 8, -92]} s={3} yaw={2.1} />
      <Cloud position={[-2, 1, -70]} s={3} yaw={1.2} />
      <group position={[-30, 8, -80]} scale={1.3}><Model name="olimpo_templo" fallback={temple} yaw={0.15} /></group>
      <group position={[28, 14, -95]} scale={1.8}><Model name="olimpo_templo" fallback={temple} yaw={-0.2} /></group>
      <group position={[-4, 3, -72]} scale={1.6}><Model name="olimpo_columna" fallback={column} /></group>
      <group position={[3, 3, -74]} scale={1.2}><Model name="olimpo_columna" fallback={column} /></group>
      <group position={[8, 6, -88]} scale={2}><Model name="olimpo_columna" fallback={column} /></group>
    </group>
  )
}

export default function S12Referencias({ beat }: SceneProps) {
  return (
    <group>
      {/* luz cálida de atardecer, sin quemar */}
      <ambientLight intensity={0.7} color="#ffe6cc" />
      <directionalLight position={[-10, 9, 14]} intensity={1.1} color="#ffc48a" />

      {/* cielo de atardecer y nubes */}
      <mesh>
        <sphereGeometry args={[400, 16, 10]} />
        <meshBasicMaterial color="#f7d9b0" side={THREE.BackSide} fog={false} depthWrite={false} />
      </mesh>
      <Cloud position={[-14, 3, -20]} s={1.6} yaw={0.5} />
      <Cloud position={[12, 7, -24]} s={2.2} yaw={2.4} />
      <Cloud position={[-8, 14, -30]} s={1.4} yaw={1.1} />
      <Cloud position={[18, 1, -10]} s={1.2} yaw={4} />
      <Cloud position={[-20, 6, 4]} s={1.3} yaw={3} />
      <FarOlympus />

      {/* suelo de nubes y camino */}
      <mesh position={[0, -0.05, 4]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[200, 48]} />
        <meshStandardMaterial color="#f6e9d6" />
      </mesh>
      <mesh position={[0, 0.01, 8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 20]} />
        <meshStandardMaterial color="#d9c7a0" />
      </mesh>

      {/* puertas abiertas y luz dorada al fondo */}
      <Model name="olimpo_marco" fallback={<FramePlaceholder />} />
      <Leaf side={1} />
      <Leaf side={-1} />
      <mesh position={[0, 3.8, -4]}>
        <planeGeometry args={[8.4, 7.6]} />
        <meshBasicMaterial color="#ffe3a8" />
      </mesh>

      <Hermes position={[0, 0, 11]} rotation={0} action="wave" />
      {/* beat solo se usa para la cámara (shots); la escena es la misma en todos los pasos */}
      <group visible={beat < 0} />
    </group>
  )
}
