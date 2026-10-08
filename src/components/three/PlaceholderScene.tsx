import { useDamp } from './useDamp'

/** Placeholder: caja de color que sube con el paso, más un cubo por paso. Se reemplaza al hacer cada escena. */
export function PlaceholderScene({ color, beat, total }: { color: string; beat: number; total: number }) {
  const lift = useDamp(beat * 0.6)
  return (
    <group>
      <mesh position={[0, 1 + lift, 0]}>
        <boxGeometry args={[3, 2, 3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {Array.from({ length: total }, (_, i) => (
        <mesh key={i} position={[(i - (total - 1) / 2) * 1.2, 0.2, 3]}>
          <boxGeometry args={[0.6, 0.4, 0.6]} />
          <meshStandardMaterial color={i <= beat ? '#ffd166' : '#555'} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[12, 32]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
    </group>
  )
}
