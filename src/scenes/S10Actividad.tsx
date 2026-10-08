import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { SCENES } from '../data/scenes'
import { Character } from '../components/three/Character'
import { Hermes } from '../components/three/Hermes'
import { GlowLine } from '../components/three/GlowLine'
import { ConnectionNetwork, OLYMPUS_NETWORK } from '../components/three/ConnectionNetwork'
import { pointAt } from '../components/three/polyline'
import { useDamp } from '../components/three/useDamp'
import type { SceneProps, Shot } from '../presentation/types'
import { useSceneKeys } from '../presentation/keys'
import { loadQuizState, saveQuizState } from '../presentation/quizState'
import type { QuizState } from '../presentation/quizState'
import { ActividadUI } from './actividad/ActividadUI'
import {
  LINE_R, SEATS, SEAT_R, TABLE_R, canSwapReserve, chainPath, clickScore, polar, reduceScoreKey, resetScores, resetStep,
  seatAngle, shotFor, stageFor, swapReserve,
} from './actividad/logic'

const BEAT_IDS = SCENES.find((s) => s.id === 'actividad')!.beats.map((b) => b.id)
/** Un shot por paso (25). */
export const shots: Shot[] = BEAT_IDS.map((id) => shotFor(id))

const RESERVE_KEY = 'hermes.reserve'
const CARD_COLORS = ['#d62839', '#1f5fd1', '#f2b705', '#1f9d55']
const MSG_COLORS = ['#7fd6ff', '#ffd166', '#ff6b6b']
const PATH = chainPath(LINE_R, 0.8)
const NET_OFFSET: [number, number, number] = [0, 3, -11]

function loadSwapped(): number | null {
  try {
    const v = localStorage.getItem(RESERVE_KEY)
    return v === null ? null : Number.isInteger(Number(v)) ? Number(v) : null
  } catch { return null }
}

/** Mensaje luminoso: su forma cambia a lo largo del camino. */
function Orb({ mode, progress, deform }: { mode: 'none' | 'follow' | 'loop'; progress: number; deform: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const [shape, setShape] = useState(0)
  const [pos, setPos] = useState(0)
  useFrame(({ clock }) => {
    if (mode === 'none') return
    const p = mode === 'loop' ? (clock.elapsedTime * 0.18) % 1 : progress
    const s = deform ? Math.min(2, Math.floor(p * 3)) : 0
    if (s !== shape) setShape(s)
    const q = Math.round(p * 1000) / 1000
    if (q !== pos) setPos(q)
    const g = ref.current
    if (g) {
      const v = pointAt(PATH, p)
      g.position.set(v[0], v[1], v[2])
      g.rotation.y = clock.elapsedTime * 2
    }
  })
  if (mode === 'none') return null
  const color = deform ? MSG_COLORS[shape] : MSG_COLORS[0]
  return (
    <group ref={ref}>
      <mesh>
        {shape === 0 ? <sphereGeometry args={[0.2, 14, 14]} /> : shape === 1 ? <octahedronGeometry args={[0.26]} /> : <boxGeometry args={[0.36, 0.36, 0.36]} />}
        <meshBasicMaterial color={color} transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

/** Monta la UI DOM dentro de .stage-root (sobre el overlay, bajo el HUD y la pantalla negra). */
function DomPortal({ visible, children }: { visible: boolean; children: ReactNode }) {
  const dom = useThree((s) => s.gl.domElement)
  const root = useRef<Root | null>(null)
  const host = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = document.createElement('div')
    ;(dom.closest('.stage-root') ?? document.body).appendChild(el)
    host.current = el
    root.current = createRoot(el)
    return () => {
      const r = root.current
      root.current = null
      host.current = null
      // Fuera del render de React para no desmontar en medio de otro render.
      setTimeout(() => { r?.unmount(); el.remove() }, 0)
    }
  }, [dom])
  useEffect(() => { root.current?.render(visible ? children : null) })
  return null
}

export default function S10Actividad({ data, beat, beatId, active }: SceneProps) {
  const b = data.beats[beat]
  const st = stageFor(beatId)
  const [quiz, setQuiz] = useState<QuizState>(() => loadQuizState())
  const quizRef = useRef(quiz)
  const [swapped, setSwapped] = useState<number | null>(loadSwapped)
  const swappedRef = useRef(swapped)
  const [flash, setFlash] = useState<{ i: number; n: number } | undefined>()
  const [notice, setNotice] = useState<string | undefined>()
  const lastReset = useRef<number | null>(null)
  const timers = useRef<{ flash?: number; notice?: number }>({})
  useEffect(() => () => { clearTimeout(timers.current.flash); clearTimeout(timers.current.notice) }, [])

  const commit = (next: QuizState, flashIdx?: number) => {
    quizRef.current = next
    setQuiz(next)
    saveQuizState(next)
    if (flashIdx !== undefined) {
      setFlash((f) => ({ i: flashIdx, n: (f?.n ?? 0) + 1 }))
      clearTimeout(timers.current.flash)
      timers.current.flash = window.setTimeout(() => setFlash(undefined), 1000)
    }
  }
  const showNotice = (text: string, ms = 2000) => {
    setNotice(text)
    clearTimeout(timers.current.notice)
    timers.current.notice = window.setTimeout(() => setNotice(undefined), ms)
  }

  useSceneKeys((e) => {
    if (e.code === 'Backspace' && e.shiftKey) {
      const r = resetStep(lastReset.current, Date.now())
      lastReset.current = r.lastAt
      if (r.reset) { commit(resetScores(quizRef.current)); showNotice('Marcador reiniciado') }
      else showNotice('Shift + Retroceso otra vez para reiniciar el marcador')
      return true
    }
    if (e.code === 'KeyR' && !e.shiftKey) {
      if (!canSwapReserve(swappedRef.current, b.quiz)) return false
      const next = swapReserve(swappedRef.current, b.quiz)
      swappedRef.current = next
      setSwapped(next)
      try { if (next !== null) localStorage.setItem(RESERVE_KEY, String(next)) } catch { /* ignorar */ }
      showNotice('Pregunta de reserva')
      return true
    }
    const out = reduceScoreKey(quizRef.current, e, beatId)
    if (!out) return false
    commit(out.state, out.flash)
    return true
  })

  const onSelectTable = (i: number, delta: 1 | -1) => {
    const out = clickScore(quizRef.current, i, delta)
    if (out.state !== quizRef.current) commit(out.state, out.flash)
  }
  const onTables = (delta: 1 | -1) => {
    const out = reduceScoreKey(quizRef.current, { code: delta > 0 ? 'NumpadAdd' : 'NumpadSubtract', key: '', shiftKey: false }, 'mesas')
    if (out) commit(out.state)
  }

  // 3D derivado del paso.
  const cards = useDamp(st.cards, 0.4)
  const chain = useDamp(st.chain, 0.9)
  const net = useDamp(st.network ? OLYMPUS_NETWORK.links.length : 0, 1.6)
  const ring = useDamp(st.ring ? 1 : 0, 0.5)
  const stones = useDamp(st.network ? 1 : 0, 0.8)
  const seats = useMemo(() => Array.from({ length: SEATS }, (_, i) => ({ pos: polar(seatAngle(i), SEAT_R), rot: seatAngle(i) + Math.PI })), [])
  const segColor = (k: number) => (st.deform ? MSG_COLORS[Math.min(2, k)] : '#7fd6ff')
  // El camino se parte en 4 tramos; cada uno con su color (el mensaje se deforma en la demo).
  const segs = useMemo(() => {
    const per = (PATH.length - 1) / (SEATS - 1)
    return Array.from({ length: SEATS - 1 }, (_, k) => PATH.slice(k * per, (k + 1) * per + 1))
  }, [])
  const hermesPos: [number, number, number] = st.away ? [10, 0, -7] : [5, 0, 3.5]

  return (
    <group>
      {/* mesa redonda vista desde arriba */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[TABLE_R, TABLE_R, 0.25, 40]} />
        <meshStandardMaterial color="#8a5a34" flatShading />
      </mesh>
      <mesh position={[0, 0.34, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={ring > 0.01 ? 1 : 0.001}>
        <ringGeometry args={[TABLE_R * 0.78, TABLE_R * 0.95, 48]} />
        <meshBasicMaterial color="#ffd166" transparent opacity={0.9 * ring} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* tarjetas de las cuatro opciones (se ocultan al empezar la cadena) */}
      <group position={[0, 0.5 + 0.3 * cards, 0]} scale={Math.max(0.001, cards)}>
        {CARD_COLORS.map((c, i) => (
          <mesh key={c} position={[(i % 2 ? 0.55 : -0.55), 0, (i < 2 ? -0.4 : 0.4)]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.95, 0.65]} />
            <meshBasicMaterial color={c} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
      {/* cinco figuras mirando al centro */}
      {seats.map((s, i) => (
        <Character
          key={i}
          kind="humano"
          position={s.pos}
          rotation={s.rot}
          action={(i === 0 && st.hand0) || (i === SEATS - 1 && st.hand4) ? 'wave' : 'idle'}
          color={['#6c8ebf', '#b5838d', '#6a994e', '#e9c46a', '#9d7bb0'][i]}
        />
      ))}
      {/* línea del mensaje hacia la izquierda: quien inicia (abajo) -> último (a su derecha) */}
      {segs.map((p, k) => (
        <GlowLine key={k} points={p} progress={Math.min(1, Math.max(0, chain * (SEATS - 1) - k))} color={segColor(k)} width={4} />
      ))}
      <Orb mode={st.orb} progress={chain} deform={st.deform} />
      {/* las 5 respuestas, en el cierre */}
      {seats.map((_, i) => (
        <mesh key={i} position={polar(seatAngle(i), LINE_R, 0.8)} scale={Math.max(0.001, stones)}>
          <octahedronGeometry args={[0.28]} />
          <meshBasicMaterial color="#ffd166" transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
      {/* red de conexiones, brillante y completa al cierre */}
      <group position={NET_OFFSET}>
        <ConnectionNetwork nodes={OLYMPUS_NETWORK.nodes} links={OLYMPUS_NETWORK.links} lit={net} color="#ffd166" pulse />
      </group>
      <Hermes position={hermesPos} rotation={st.away ? Math.PI * 0.8 : -0.6} action={st.away ? 'walk' : 'idle'} holding="carta" />
      <DomPortal visible={active}>
        <ActividadUI
          beatId={beatId}
          quiz={b.quiz}
          state={quiz}
          swapped={swapped}
          flash={flash?.i}
          notice={notice}
          onSelectTable={onSelectTable}
          onTables={onTables}
        />
      </DomPortal>
    </group>
  )
}
