import type { ReactNode } from 'react'
import { Character, Mat, type CharacterProps } from './Character'

const GOLD = '#e8c24a'

function Wing({ side }: { side: 1 | -1 }) {
  return (
    <mesh position={[side * 0.24, 0, 0]} rotation={[0, 0, side * -0.5]} scale={[1, 0.35, 0.6]}>
      <coneGeometry args={[0.1, 0.3, 4]} />
      <meshStandardMaterial color="#ffffff" flatShading />
    </mesh>
  )
}

function Carta() {
  return (
    <group rotation={[0.3, 0, 0]}>
      <mesh>
        <boxGeometry args={[0.28, 0.2, 0.015]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0, 0.012]}>
        <cylinderGeometry args={[0.035, 0.035, 0.01, 10]} />
        <meshStandardMaterial color="#b3202a" />
      </mesh>
    </group>
  )
}

function Lira() {
  return (
    <group>
      <mesh rotation={[Math.PI, 0, 0]} position={[0, 0.1, 0]}>
        <torusGeometry args={[0.12, 0.018, 6, 14, Math.PI]} />
        <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.28, 0.02, 0.02]} />
        <meshStandardMaterial color={GOLD} />
      </mesh>
      {[-0.06, 0, 0.06].map((x) => (
        <mesh key={x} position={[x, 0.12, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.2, 4]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      ))}
    </group>
  )
}

function Moly() {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.012, 0.015, 0.3, 5]} />
        <meshStandardMaterial color="#2f7d3a" />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

function Caduceo() {
  return (
    <group position={[-0.5, 0.2, 0.12]}>
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.7, 6]} />
        <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.72, 0]}>
        <sphereGeometry args={[0.045, 8, 6]} />
        <meshStandardMaterial color={GOLD} />
      </mesh>
      {[0, Math.PI].map((ph, i) => (
        <group key={i}>
          {[0.9, 1.05, 1.2, 1.35, 1.5].map((y, j) => (
            <mesh key={j} position={[Math.sin(ph + j * 1.6) * 0.05, y, Math.cos(ph + j * 1.6) * 0.05]}>
              <sphereGeometry args={[0.025, 6, 5]} />
              <meshStandardMaterial color={i ? '#2f7d3a' : '#4a9a4a'} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

export type HermesHolding = 'carta' | 'lira' | 'moly'

export function Hermes({ holding, ghost, ...rest }: Omit<CharacterProps, 'kind' | 'children' | 'handItem'> & { holding?: HermesHolding }) {
  const item: ReactNode = holding === 'carta' ? <Carta /> : holding === 'lira' ? <Lira /> : holding === 'moly' ? <Moly /> : null
  return (
    <Character kind="hermes" ghost={ghost} handItem={item} {...rest}>
      {/* petaso con alas */}
      <group position={[0, 1.8, 0]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.025, 14]} />
          <Mat color="#d9a441" ghost={ghost} />
        </mesh>
        <mesh position={[0, 0.07, 0]}>
          <sphereGeometry args={[0.16, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <Mat color="#d9a441" ghost={ghost} />
        </mesh>
        <group position={[0, 0.06, 0]}>
          <Wing side={1} />
          <Wing side={-1} />
        </group>
      </group>
      {/* sandalias aladas */}
      {[-0.12, 0.12].map((x) => (
        <group key={x} position={[x, 0.05, 0.05]}>
          <mesh>
            <boxGeometry args={[0.14, 0.06, 0.28]} />
            <Mat color="#7a4a2a" ghost={ghost} />
          </mesh>
          <mesh position={[Math.sign(x) * 0.1, 0.1, -0.08]} rotation={[0.3, 0, Math.sign(x) * -0.6]} scale={[1, 0.4, 0.8]}>
            <coneGeometry args={[0.07, 0.22, 4]} />
            <meshStandardMaterial color="#fff" flatShading />
          </mesh>
        </group>
      ))}
      <Caduceo />
    </Character>
  )
}
export default Hermes
