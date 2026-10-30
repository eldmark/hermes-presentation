import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { Character } from '../components/three/Character'
import { Model } from '../components/three/Model'
import { Hermes } from '../components/three/Hermes'
import { GlowLine } from '../components/three/GlowLine'
import { ConnectionNetwork, OLYMPUS_NETWORK } from '../components/three/ConnectionNetwork'
import { useDamp } from '../components/three/useDamp'
import type { Vec3 } from '../data/types'
import type { SceneProps, Shot } from '../presentation/types'

// Ruta a lo largo de +x. Palacio en x=0, umbral en x=30, prado desde x=40.
// Pasos: 0 itaca, 1 almas-siguen, 2 ruta-hitos, 3 vacila, 4 asfodelos, 5 pausa, 6 palabras, 7 salida
export const shots: Shot[] = [
  { pos: [-2, 6, 24], look: [0, 3.2, -7] },
  { pos: [5, 4.5, 19], look: [2, 2.6, -5] },
  { pos: [12, 5.5, 11], look: [16, 1.5, 0] },
  { pos: [10, 2.5, 0.6], look: [32, 1.7, 0] },
  { pos: [37, 3.5, 7.5], look: [41, 1.4, 0] },
  { pos: [20, 3, 12], look: [30, 1.8, 1] },
  { pos: [34, 2.4, 9.5], look: [27.5, 1.7, 4.8] },
  { pos: [18, 16, 20], look: [26, 0, -1] },
]

const HERMES_X = [-8, 4, 14, 32, 38, 26.5, 26.5, 32]
const HERMES_Z = [6, 0, 0, 0, 0, 4.8, 4.8, 0.8]
const SOUL_COLORS = ['#9aa5b5', '#a79db0', '#8fa3a0', '#b0a79a', '#98a0b8']
const NET_OFFSET: Vec3 = [31, 0, 0]
const ROUTE_GLOW: Vec3[] = [[-2, 0.12, 0], [8, 0.12, 0.6], [18, 0.12, -0.6], [31, 0.12, 0.2]]

const soulZ = (i: number) => (i % 2 === 0 ? -0.9 : 0.9) + (i === 4 ? 0.3 : 0)

function soulPos(i: number, beat: number): Vec3 {
  if (beat === 0) return [-4 + i * 2, 0.6, -7.6 + (i % 3) * 0.9]
  if (beat >= 5) return [44 + i * 1.5, 0, soulZ(i)]
  if (beat === 3) return i === 0 ? [29.2, 0, 0] : [26 - i * 1.2, 0, soulZ(i)]
  const L = HERMES_X[beat]
  return [L - 2.2 - i * 1.2, 0, soulZ(i)]
}


// ---------- utilidades ----------

/** Textura de mancha suave (alfa radial) para neblina y resplandores. */
let softCache: { map: THREE.CanvasTexture; gray: THREE.CanvasTexture } | null = null
function soft() {
  if (softCache) return softCache
  const mk = (rgba: (a: number) => string) => {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const g = c.getContext('2d')!
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64)
    gr.addColorStop(0, rgba(1)); gr.addColorStop(0.35, rgba(0.6)); gr.addColorStop(0.7, rgba(0.15)); gr.addColorStop(1, rgba(0))
    g.fillStyle = gr
    g.fillRect(0, 0, 128, 128)
    return new THREE.CanvasTexture(c)
  }
  softCache = { map: mk((a) => `rgba(255,255,255,${a})`), gray: mk((a) => `rgb(${Math.round(255 * a)},${Math.round(255 * a)},${Math.round(255 * a)})`) }
  return softCache
}

const rnd = (i: number, k: number) => {
  const a = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453
  return a - Math.floor(a)
}
const mixc = (a: string, b: string, t: number) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), t).getHexString()

interface Item { p: Vec3; s?: Vec3 | number; ry?: number; r?: Vec3; c?: string }

/** Malla instanciada: muchas piezas iguales en una sola llamada de dibujo. */
function Inst({ items, children }: { items: Item[]; children: ReactNode }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    const m = ref.current
    if (!m) return
    const o = new THREE.Object3D()
    const col = new THREE.Color()
    items.forEach((it, i) => {
      o.position.set(...it.p)
      if (it.r) o.rotation.set(...it.r)
      else o.rotation.set(0, it.ry ?? 0, 0)
      const sc = it.s ?? 1
      if (typeof sc === 'number') o.scale.setScalar(sc)
      else o.scale.set(...sc)
      o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
      if (it.c) m.setColorAt(i, col.set(it.c))
    })
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [items])
  return <instancedMesh ref={ref} args={[undefined, undefined, items.length]} frustumCulled={false}>{children}</instancedMesh>
}

function Mat({ color, o = 1, emissive }: { color: string; o?: number; emissive?: string }) {
  return (
    <meshStandardMaterial
      color={color}
      flatShading
      transparent={o < 0.999}
      opacity={o}
      depthWrite={o > 0.98}
      emissive={emissive ?? '#000000'}
      emissiveIntensity={emissive ? 0.8 : 0}
    />
  )
}

/** Plano facetado con ondulación suave (mar y río). */
function Wavy({ w, h, seg, amp, color, emissive, o = 1, phase = 0 }: {
  w: number; h: number; seg: number; amp: number; color: string; emissive: string; o?: number; phase?: number
}) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(w, h, Math.round(seg * w / h), seg)
    const pos = g.attributes.position!
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i)
      pos.setZ(i, amp * (Math.sin(x * 0.55 + phase) * 0.6 + Math.sin(y * 0.8 + x * 0.25 + phase * 2) * 0.4))
    }
    g.computeVertexNormals()
    return g
  }, [w, h, seg, amp, phase])
  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.55} flatShading roughness={0.35} metalness={0.15} transparent={o < 0.999} opacity={o} depthWrite={o > 0.98} />
    </mesh>
  )
}

function Halo({ position, size, color, opacity = 0.5 }: { position: Vec3; size: number; color: string; opacity?: number }) {
  return (
    <sprite position={position} scale={[size, size, 1]}>
      <spriteMaterial map={soft().map} color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  )
}

function Torch({ position, on = 1 }: { position: Vec3; on?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.7, 0]}><cylinderGeometry args={[0.05, 0.07, 1.4, 6]} /><meshStandardMaterial color="#3b2a1e" flatShading /></mesh>
      <mesh position={[0, 1.45, 0]}><cylinderGeometry args={[0.18, 0.09, 0.22, 8]} /><meshStandardMaterial color="#6b5a3a" flatShading metalness={0.4} /></mesh>
      <mesh position={[0, 1.8, 0]}><coneGeometry args={[0.13, 0.5, 6]} /><meshBasicMaterial color="#ffb45c" /></mesh>
      <mesh position={[0, 1.72, 0]}><coneGeometry args={[0.07, 0.3, 6]} /><meshBasicMaterial color="#fff0b0" /></mesh>
      <Halo position={[0, 1.8, 0]} size={1.8} color="#ff9a40" opacity={0.45 * on} />
      <pointLight position={[0, 1.9, 0.3]} color="#ffb06a" intensity={7 * on} distance={11} decay={2} />
    </group>
  )
}

// ---------- palacio de Ítaca ----------

const ROOF_GEO = (() => {
  const sh = new THREE.Shape()
  sh.moveTo(-8.2, 0); sh.lineTo(8.2, 0); sh.lineTo(0, 2.8); sh.closePath()
  const g = new THREE.ExtrudeGeometry(sh, { depth: 10, bevelEnabled: false })
  g.translate(0, 0, -5.2)
  return g
})()
const TYMPANUM_GEO = (() => {
  const sh = new THREE.Shape()
  sh.moveTo(-7.4, 0); sh.lineTo(7.4, 0); sh.lineTo(0, 2.3); sh.closePath()
  return new THREE.ShapeGeometry(sh)
})()

function Palace({ dim, dissolve }: { dim: number; dissolve: number }) {
  const stone = mixc('#d9cdb4', '#6d6d80', dim)
  const stoneDk = mixc('#bfb398', '#58586a', dim)
  const roof = mixc('#b5614a', '#6a4656', dim)
  const wall = mixc('#e6dcc6', '#62637a', dim)
  const colsX = [-6, -3.6, -1.2, 1.2, 3.6, 6]
  return (
    <group visible={!(dissolve > 0.98)} position={[0, -dissolve * 12, -8]}>
      {/* escalinata y plataforma */}
      <mesh position={[0, 0.1, 0.9]}><boxGeometry args={[18, 0.2, 11.6]} /><Mat color={stoneDk} /></mesh>
      <mesh position={[0, 0.3, 0.4]}><boxGeometry args={[17, 0.2, 10.4]} /><Mat color={stone} /></mesh>
      <mesh position={[0, 0.5, -0.1]}><boxGeometry args={[16, 0.2, 9.2]} /><Mat color={stoneDk} /></mesh>
      {/* cella y puerta */}
      <mesh position={[0, 2.85, -3.2]}><boxGeometry args={[12.6, 4.5, 2]} /><Mat color={wall} /></mesh>
      <mesh position={[0, 2.3, -2.18]}><boxGeometry args={[2.2, 3.4, 0.1]} /><meshStandardMaterial color="#0f0d14" /></mesh>
      <mesh position={[0, 4.15, -2.12]}><boxGeometry args={[3, 0.3, 0.22]} /><Mat color={stone} /></mesh>
      {[-1.4, 1.4].map((x) => (
        <mesh key={x} position={[x, 2.3, -2.12]}><boxGeometry args={[0.28, 3.5, 0.22]} /><Mat color={stone} /></mesh>
      ))}
      {[-4.6, -2.8, 2.8, 4.6].map((x) => (
        <mesh key={x} position={[x, 3.3, -2.18]}><boxGeometry args={[0.5, 1.1, 0.1]} /><meshStandardMaterial color="#1a1822" /></mesh>
      ))}
      {/* pórtico */}
      {colsX.map((x) => (
        <group key={x} position={[x, 0.6, 3.4]}>
          <Model
            name="olimpo_columna"
            scale={0.75}
            fallback={<mesh position={[0, 2.25, 0]}><cylinderGeometry args={[0.45, 0.55, 4.5, 10]} /><Mat color={stone} /></mesh>}
          />
        </group>
      ))}
      {/* arquitrabe, techo y frontón */}
      <mesh position={[0, 5.35, -0.2]}><boxGeometry args={[15.6, 0.5, 9.2]} /><Mat color={stone} /></mesh>
      <mesh position={[0, 5.62, -0.2]}><boxGeometry args={[16.6, 0.12, 10.2]} /><Mat color={stoneDk} /></mesh>
      <mesh geometry={ROOF_GEO} position={[0, 5.68, 0]}><Mat color={roof} /></mesh>
      <mesh geometry={TYMPANUM_GEO} position={[0, 5.78, 4.84]}><meshStandardMaterial color={mixc('#cfc3a8', '#3c3c4c', dim)} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 6.8, 4.87]}><circleGeometry args={[0.55, 16]} /><meshStandardMaterial color="#d9a441" emissive="#8a6a1c" emissiveIntensity={0.7} /></mesh>
      <mesh position={[0, 8.55, 4.6]}><coneGeometry args={[0.28, 0.7, 5]} /><meshStandardMaterial color="#d9a441" emissive="#8a6a1c" emissiveIntensity={0.6} flatShading /></mesh>
      {/* antorchas del pórtico */}
      {[-2.4, 2.4].map((x) => (
        <Torch key={x} position={[x, 0.6, 2.6]} on={1 - dissolve} />
      ))}
    </group>
  )
}

function Beach({ o }: { o: number }) {
  const pebbles = useMemo<Item[]>(() => Array.from({ length: 26 }, (_, i) => ({
    p: [-30 + rnd(i, 1) * 36, 0.04, 1.0 + rnd(i, 2) * 2.4] as Vec3,
    s: [0.12 + rnd(i, 3) * 0.14, 0.07 + rnd(i, 4) * 0.06, 0.12 + rnd(i, 5) * 0.12] as Vec3,
    ry: rnd(i, 6) * 3,
    c: ['#b8aa86', '#9c9078', '#cbbd96'][i % 3],
  })), [])
  return (
    <group visible={!(o < 0.02)}>
      <mesh position={[-14, 0.0, 2.2]}><boxGeometry args={[52, 0.16, 3.4]} /><Mat color="#cdbb8a" o={o} /></mesh>
      {/* espuma en la orilla */}
      <mesh position={[-14, 0.045, 4.05]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[52, 0.5]} /><meshBasicMaterial color="#e8f1ff" transparent opacity={0.4 * o} depthWrite={false} /></mesh>
      <mesh position={[-14, 0.045, 4.9]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[52, 0.25]} /><meshBasicMaterial color="#e8f1ff" transparent opacity={0.2 * o} depthWrite={false} /></mesh>
      <Inst items={pebbles}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#ffffff" flatShading transparent opacity={o} /></Inst>
    </group>
  )
}

function Raft({ o }: { o: number }) {
  return (
    <group visible={!(o < 0.02)} position={[-5, 0.2, 8]} rotation={[0, 0.3, 0]}>
      {[-0.6, -0.3, 0, 0.3, 0.6].map((z) => (
        <mesh key={z} position={[0, 0, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 2.2, 6]} /><Mat color="#8a5f3a" o={o} />
        </mesh>
      ))}
      <mesh position={[0, 1.2, 0]}><cylinderGeometry args={[0.04, 0.04, 2.2, 5]} /><Mat color="#6b4a2a" o={o} /></mesh>
      <mesh position={[0, 1.5, 0.35]}><boxGeometry args={[0.04, 1.2, 0.7]} /><Mat color="#efe6d2" o={o} /></mesh>
    </group>
  )
}

// ---------- camino ----------

function RoadStones({ o }: { o: number }) {
  const slabs = useMemo<Item[]>(() => {
    const out: Item[] = []
    const cols = ['#2b2f3d', '#323747', '#272b38', '#383d4f', '#2e3342']
    let n = 0
    for (let row = 0; row < 5; row++) {
      for (let x = -2; x < 47; x += 2.45) {
        n++
        if (x + (row % 2) * 1.2 > 6.6 && x + (row % 2) * 1.2 < 13.4) continue
        out.push({
          p: [x + (row % 2) * 1.2 + (rnd(n, 1) - 0.5) * 0.25, 0.05, -2.5 + row * 1.25 + (rnd(n, 2) - 0.5) * 0.1],
          s: [2.2 - rnd(n, 3) * 0.2, 0.1 + rnd(n, 4) * 0.04, 1.05],
          ry: (rnd(n, 5) - 0.5) * 0.05,
          c: cols[n % cols.length],
        })
      }
    }
    return out
  }, [])
  return (
    <group visible={!(o < 0.02)}>
      <mesh position={[22, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 7]} />
        <meshStandardMaterial color="#1c1f2a" transparent opacity={o} depthWrite={false} />
      </mesh>
      <Inst items={slabs}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" flatShading transparent opacity={o} />
      </Inst>
      {/* ribetes tenues */}
      {[-3.35, 3.35].map((z) => (
        <mesh key={z} position={[22, 0.09, z]}>
          <boxGeometry args={[50, 0.14, 0.2]} />
          <meshStandardMaterial color="#5a6686" emissive="#3a4670" emissiveIntensity={0.6} transparent opacity={o} />
        </mesh>
      ))}
    </group>
  )
}

function Mist({ s }: { s: number }) {
  const patches = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    p: [4 + rnd(i, 1) * 40, 0.4 + rnd(i, 2) * 0.9, (i % 2 ? 1 : -1) * (4.5 + rnd(i, 3) * 4.5)] as Vec3,
    sz: 9 + rnd(i, 4) * 8,
    ry: rnd(i, 5) * 3,
  })), [])
  return (
    <group visible={!(s < 0.02)}>
      {patches.map((m, i) => (
        <mesh key={i} position={m.p} rotation={[-Math.PI / 2, 0, m.ry]}>
          <planeGeometry args={[m.sz, m.sz * 0.55]} />
          <meshBasicMaterial map={soft().map} color="#8f9cb8" transparent opacity={0.2 * s} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function Asfodelos({ s }: { s: number }) {
  const { stems, flowers, leaves, tufts } = useMemo(() => {
    const stems: Item[] = [], flowers: Item[] = [], leaves: Item[] = [], tufts: Item[] = []
    const fc = ['#f1eee0', '#e8e6d6', '#faf6ea']
    for (let i = 0; i < 40; i++) {
      const x = 40.5 + rnd(i, 1) * 19, z = (rnd(i, 2) - 0.5) * 13
      const h = 1.1 + rnd(i, 3) * 0.9
      stems.push({ p: [x, h / 2, z], s: [1, h, 1], c: '#7f8c74' })
      for (let k = 0; k < 5; k++) {
        const t = k / 4
        const ang = k * 2.4 + i
        flowers.push({
          p: [x + Math.cos(ang) * 0.09 * (1 - t * 0.6), h * (0.62 + 0.38 * t), z + Math.sin(ang) * 0.09 * (1 - t * 0.6)],
          s: (1 - t * 0.45) * 1.1,
          c: fc[(i + k) % 3],
        })
      }
      for (let k = 0; k < 4; k++) {
        const ang = k * 1.57 + rnd(i, 7) * 2
        leaves.push({ p: [x + Math.cos(ang) * 0.12, 0.28, z + Math.sin(ang) * 0.12], r: [Math.sin(ang) * 0.35, 0, -Math.cos(ang) * 0.35], s: [1, 0.8 + rnd(i, 8 + k) * 0.5, 1], c: '#76846b' })
      }
    }
    const tc = ['#6b7a66', '#5d6c5c', '#7a8872', '#657361']
    for (let i = 0; i < 170; i++) {
      tufts.push({
        p: [39 + rnd(i, 11) * 25, 0.2, (rnd(i, 12) - 0.5) * 15],
        r: [(rnd(i, 13) - 0.5) * 0.4, 0, (rnd(i, 14) - 0.5) * 0.4],
        s: [1, 0.6 + rnd(i, 15) * 1.0, 1],
        c: tc[i % 4],
      })
    }
    return { stems, flowers, leaves, tufts }
  }, [])
  return (
    <group visible={!(s < 0.01)} scale={[1, s, 1]}>
      <mesh position={[51, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[34, 24]} />
        <meshStandardMaterial color="#4c5649" alphaMap={soft().gray} transparent depthWrite={false} />
      </mesh>
      <Inst items={tufts}><coneGeometry args={[0.09, 0.4, 4]} /><meshStandardMaterial color="#ffffff" flatShading /></Inst>
      <Inst items={leaves}><coneGeometry args={[0.05, 0.6, 3]} /><meshStandardMaterial color="#ffffff" flatShading /></Inst>
      <Inst items={stems}><cylinderGeometry args={[0.012, 0.022, 1, 4]} /><meshStandardMaterial color="#ffffff" flatShading /></Inst>
      <Inst items={flowers}><sphereGeometry args={[0.08, 5, 3]} /><meshStandardMaterial color="#ffffff" emissive="#d8d6c6" emissiveIntensity={0.35} flatShading /></Inst>
    </group>
  )
}

function Landmarks({ s }: { s: number }) {
  const dreams = useMemo(() => Array.from({ length: 11 }, (_, i) => ({
    p: [24 + rnd(i, 1) * 3.4, 0.9 + rnd(i, 2) * 3.2, (rnd(i, 3) - 0.5) * 9] as Vec3,
    sz: 1.3 + rnd(i, 4) * 1.6,
    c: ['#8a7ac8', '#6c5b9a', '#a58ad0'][i % 3]!,
  })), [])
  return (
    <group visible={!(s < 0.01)} scale={[1, s, 1]}>
      {/* Océano: río facetado con orillas y puente de losa */}
      <group position={[10, 0.0, 0]}>
        <group position={[0, 0.02, 0]}><Wavy w={4.4} h={22} seg={22} amp={0.1} color="#2f6ea6" emissive="#14355a" phase={1.3} /></group>
        {[-2.5, 2.5].map((x) => (
          <mesh key={x} position={[x, 0.12, 0]}><boxGeometry args={[0.7, 0.3, 22]} /><meshStandardMaterial color="#3a3f52" flatShading /></mesh>
        ))}
        <mesh position={[0, 0.22, 0]}><boxGeometry args={[5.4, 0.18, 3.4]} /><meshStandardMaterial color="#444a60" flatShading /></mesh>
        {[-1.6, 1.6].map((z) => (
          <mesh key={z} position={[0, 0.34, z]}><boxGeometry args={[5.4, 0.1, 0.18]} /><meshStandardMaterial color="#5a6686" emissive="#3a4670" emissiveIntensity={0.5} /></mesh>
        ))}
      </group>
      {/* roca blanca */}
      <mesh position={[15, 1.8, -5]} scale={[2.4, 2.8, 2]}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#f1f1ec" emissive="#9aa0b0" emissiveIntensity={0.25} flatShading /></mesh>
      <mesh position={[17.4, 0.7, -4]} scale={1.5}><dodecahedronGeometry args={[0.5, 0]} /><meshStandardMaterial color="#e6e6df" emissive="#9aa0b0" emissiveIntensity={0.2} flatShading /></mesh>
      <mesh position={[13, 0.5, -3.6]} scale={[1.1, 0.8, 1.2]}><dodecahedronGeometry args={[0.6, 0]} /><meshStandardMaterial color="#dcdcd4" flatShading /></mesh>
      {/* puertas del Sol */}
      <group position={[20, 0, 0]} scale={1.05}>
        {[-2.7, 2.7].map((z) => (
          <group key={z} position={[0, 0, z]}>
            <mesh position={[0, 0.2, 0]}><boxGeometry args={[0.9, 0.4, 0.9]} /><meshStandardMaterial color="#5c5a62" flatShading /></mesh>
            <mesh position={[0, 1.9, 0]}><cylinderGeometry args={[0.2, 0.25, 3.2, 8]} /><meshStandardMaterial color="#d9a441" emissive="#8a6a1c" emissiveIntensity={0.6} /></mesh>
            <mesh position={[0, 3.6, 0]}><boxGeometry args={[0.6, 0.22, 0.6]} /><meshStandardMaterial color="#e6b955" emissive="#8a6a1c" emissiveIntensity={0.6} flatShading /></mesh>
          </group>
        ))}
        <mesh position={[0, 3.85, 0]}><boxGeometry args={[0.55, 0.3, 6.4]} /><meshStandardMaterial color="#d9a441" emissive="#8a6a1c" emissiveIntensity={0.6} /></mesh>
        <mesh position={[0, 4.6, 0]}><sphereGeometry args={[0.35, 14, 10]} /><meshBasicMaterial color="#ffd36b" /></mesh>
        <Halo position={[0, 4.6, 0]} size={4} color="#ffcf70" opacity={0.5} />
      </group>
      {/* región de los Sueños */}
      {dreams.map((d, i) => (
        <Halo key={i} position={d.p} size={d.sz} color={d.c} opacity={0.38} />
      ))}
      {/* umbral */}
      <group position={[30, 0, 0]} scale={1.7}>
        {[-1.6, 1.6].map((z) => (
          <group key={z} position={[0, 0, z]}>
            <mesh position={[0, 0.15, 0]}><boxGeometry args={[1, 0.3, 1]} /><meshStandardMaterial color="#6d7184" flatShading /></mesh>
            <mesh position={[0, 1.5, 0]}><boxGeometry args={[0.6, 2.7, 0.6]} /><meshStandardMaterial color="#8a8d96" flatShading /></mesh>
          </group>
        ))}
        <mesh position={[0, 2.95, 0]}><boxGeometry args={[0.8, 0.4, 4.2]} /><meshStandardMaterial color="#8a8d96" flatShading /></mesh>
        <mesh position={[0, 3.25, 0]}><boxGeometry args={[0.5, 0.2, 4.6]} /><meshStandardMaterial color="#6d7184" flatShading /></mesh>
        <mesh position={[0, 1.5, 0]}><boxGeometry args={[0.05, 2.6, 2.6]} /><meshBasicMaterial color="#9fb0e8" transparent opacity={0.08} depthWrite={false} /></mesh>
      </group>
      <pointLight position={[30, 3, 0]} color="#8a9ae0" intensity={5} distance={12} decay={2} />
    </group>
  )
}

function LivingGlimpse({ s }: { s: number }) {
  return (
    <group visible={!(s < 0.01)} position={[29, 0, -11]} scale={[1.8, 1.8 * s, 1.8]}>
      <mesh position={[0, 0.1, 0]}><boxGeometry args={[3, 0.2, 2.4]} /><meshStandardMaterial color="#8a7a66" flatShading /></mesh>
      <mesh position={[0, 1.0, 0]}><boxGeometry args={[2.4, 1.6, 1.8]} /><meshStandardMaterial color="#e2c79a" flatShading /></mesh>
      <mesh position={[0, 1.9, 0]}><boxGeometry args={[2.6, 0.12, 2.0]} /><meshStandardMaterial color="#8a5a44" flatShading /></mesh>
      <mesh position={[0, 2.35, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[1.95, 0.95, 4]} /><meshStandardMaterial color="#b5614a" flatShading /></mesh>
      <mesh position={[0.7, 2.6, -0.3]}><boxGeometry args={[0.28, 0.7, 0.28]} /><meshStandardMaterial color="#8a7a66" flatShading /></mesh>
      <mesh position={[-0.5, 0.75, 0.93]}><boxGeometry args={[0.6, 1.1, 0.06]} /><meshStandardMaterial color="#5a3d28" flatShading /></mesh>
      <mesh position={[0.55, 1.15, 0.93]}><boxGeometry args={[0.6, 0.55, 0.05]} /><meshBasicMaterial color="#ffc46b" /></mesh>
      <mesh position={[0.55, 1.15, 0.96]}><boxGeometry args={[0.7, 0.07, 0.05]} /><meshStandardMaterial color="#5a3d28" /></mesh>
      <mesh position={[0.55, 1.15, 0.96]}><boxGeometry args={[0.07, 0.65, 0.05]} /><meshStandardMaterial color="#5a3d28" /></mesh>
      {[-1.1, 1.1].map((x) => (
        <mesh key={x} position={[x, 0.45, 1.5]} scale={[0.5, 0.4, 0.5]}><sphereGeometry args={[0.5, 8, 6]} /><meshStandardMaterial color="#5a8a4a" flatShading /></mesh>
      ))}
      <Halo position={[0, 0.06, 1.7]} size={4.5} color="#ffb869" opacity={0.35} />
      <pointLight position={[0, 1.2, 2]} color="#ffb869" intensity={8} distance={9} />
    </group>
  )
}

export default function S07Almas({ beat }: SceneProps) {
  const dim = useDamp(beat >= 1 ? 1 : 0, 0.9)
  const dissolve = useDamp(beat >= 2 ? 1 : 0, 1.0)
  const seaO = 1 - dissolve
  const routeO = useDamp(beat >= 7 ? 0.25 : beat >= 2 ? 1 : 0, 0.8)
  const landmarks = useDamp(beat >= 2 ? 1 : 0, 0.8)
  const meadow = useDamp(beat >= 4 ? 1 : 0, 1.0)
  const living = useDamp(beat >= 5 && beat < 7 ? 1 : 0, 0.8)
  const glow = useDamp(beat >= 7 ? 1 : 0, 1.4)
  const lit = useDamp(beat >= 7 ? OLYMPUS_NETWORK.links.length : 0, 1.6)

  const hx = HERMES_X[Math.min(beat, 7)]
  const hz = HERMES_Z[Math.min(beat, 7)]
  const hRot = beat === 3 ? -Math.PI / 2 : beat >= 5 && beat <= 6 ? Math.PI / 2 : 0
  const b = Math.min(beat, 7)
  const landColor = useMemo(() => mixc('#7d8458', '#2b3144', dim), [dim])

  return (
    <group>
      <ambientLight intensity={0.35 - 0.15 * dim} color="#b9c2d8" />
      <directionalLight position={[8, 14, 10]} intensity={0.6 - 0.25 * dim} color="#e6e9f5" />
      <pointLight position={[hx, 3, hz + 2]} color="#ffdca0" intensity={6} distance={10} decay={2} />

      {/* tierra firme */}
      <mesh position={[30, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[220, 160]} />
        <meshStandardMaterial color={landColor} />
      </mesh>

      {/* mar, costa y balsa */}
      {seaO > 0.02 && (
        <group position={[-14, 0.06, 24]}>
          <Wavy w={64} h={40} seg={34} amp={0.13} color="#2f6ea6" emissive="#14355a" o={seaO} />
        </group>
      )}
      <Beach o={seaO} />
      <Raft o={seaO} />

      <Palace dim={dim} dissolve={dissolve} />

      {/* ruta oscura y neblina */}
      <RoadStones o={routeO} />
      <Mist s={landmarks} />
      <Landmarks s={landmarks} />
      <Asfodelos s={meadow} />
      <LivingGlimpse s={living} />

      {/* ruta que se vuelve línea luminosa y red de la portada */}
      <GlowLine points={ROUTE_GLOW} progress={glow} color="#ffd36b" width={3} />
      <group position={NET_OFFSET}>
        <ConnectionNetwork nodes={OLYMPUS_NETWORK.nodes} links={OLYMPUS_NETWORK.links} lit={lit} color="#ffd36b" arc={0.12} />
      </group>

      <Hermes position={[hx, 0, hz]} rotation={hRot} scale={1.1} />
      {SOUL_COLORS.map((c, i) => (
        <Character
          key={i}
          kind="alma"
          color={beat === 0 ? '#6b6272' : c}
          ghost={beat !== 0}
          position={soulPos(i, b)}
          rotation={beat === 0 ? 0 : Math.PI / 2}
        />
      ))}
    </group>
  )
}
