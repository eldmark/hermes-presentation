import { PlaceholderScene } from '../components/three/PlaceholderScene'
import type { SceneProps, Shot } from '../presentation/types'

export const shots: Shot[] = [
  { pos: [0, 4, 12], look: [0, 1, 0] },
  { pos: [4, 3, 8], look: [0, 1, 0] },
]

export default function S10Actividad({ data, beat }: SceneProps) {
  return <PlaceholderScene color="#06d6a0" beat={beat} total={data.beats.length} />
}
