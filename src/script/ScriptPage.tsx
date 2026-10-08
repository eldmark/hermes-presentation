import { useEffect, useRef, useState } from 'react'
import { SCENES } from '../data/scenes'
import type { Speaker } from '../data/types'
import './script.css'

const SPEAKER_NAMES: Record<Speaker, string> = {
  expositor: 'Expositor/a', narrador: 'Narrador/a', presentador: 'Presentador/a',
  hermes: 'Hermes', zeus: 'Zeus', calipso: 'Calipso', apolo: 'Apolo',
}

type Filter = 0 | 1 | 2 | 3 // 0 = todos
const FILTER_KEY = 'hermes-script-filter'
const FILTERS: { v: Filter; label: string }[] = [
  { v: 0, label: 'Todos' }, { v: 1, label: 'Persona 1' }, { v: 2, label: 'Persona 2' }, { v: 3, label: 'Persona 3' },
]

function loadFilter(): Filter {
  try {
    const v = Number(localStorage.getItem(FILTER_KEY))
    if (v === 1 || v === 2 || v === 3) return v
  } catch { /* sin almacenamiento */ }
  return 0
}

const fmtMin = (n: number) => String(n).replace('.', ',')
const duration = ([a, b]: [number, number]) => (a === b ? `${fmtMin(a)} min` : `${fmtMin(a)} a ${fmtMin(b)} min`)

// Estructura mínima de Wake Lock para no depender de la versión de lib.dom.
type WakeSentinel = { release: () => Promise<void> }
type WakeNav = { wakeLock?: { request: (t: 'screen') => Promise<WakeSentinel> } }

function useWakeLock() {
  const supported = typeof navigator !== 'undefined' && !!(navigator as unknown as WakeNav).wakeLock
  const [on, setOn] = useState(false)
  const sentinel = useRef<WakeSentinel | null>(null)

  useEffect(() => {
    if (!on) return
    let cancelled = false
    const acquire = async () => {
      try {
        const s = await (navigator as unknown as WakeNav).wakeLock!.request('screen')
        if (cancelled) { void s.release().catch(() => {}); return }
        sentinel.current = s
      } catch { /* denegado o no disponible */ }
    }
    void acquire()
    // El navegador libera el bloqueo al ocultar la pestaña: se vuelve a pedir al regresar.
    const onVis = () => { if (document.visibilityState === 'visible') void acquire() }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVis)
      const s = sentinel.current
      sentinel.current = null
      if (s) void s.release().catch(() => {})
    }
  }, [on])

  return { supported, on, setOn }
}

export default function ScriptPage() {
  const [filter, setFilter] = useState<Filter>(loadFilter)
  const wake = useWakeLock()

  useEffect(() => {
    const prev = document.title
    document.title = 'Guion: Hermes'
    return () => { document.title = prev }
  }, [])

  const choose = (v: Filter) => {
    setFilter(v)
    try { localStorage.setItem(FILTER_KEY, String(v)) } catch { /* ignorar */ }
  }

  // Los enlaces del índice no usan href="#id" porque el hash es la ruta (#/script).
  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="sp" id="sp-top">
      <header className="sp-top">
        <div className="sp-controls">
          <div className="sp-filter" role="group" aria-label="Filtrar por persona">
            {FILTERS.map((f) => (
              <button key={f.v} type="button" className="sp-btn" aria-pressed={filter === f.v} onClick={() => choose(f.v)}>
                {f.label}
              </button>
            ))}
          </div>
          {wake.supported && (
            <label className="sp-wake">
              <input type="checkbox" checked={wake.on} onChange={(e) => wake.setOn(e.target.checked)} />
              Mantener pantalla encendida
            </label>
          )}
        </div>
        <nav className="sp-index" aria-label="Índice de escenas">
          {SCENES.map((s) => (
            <a key={s.id} className="sp-chip" href={`#/script`} onClick={goTo(`sp-${s.id}`)} title={s.title}>
              <b>{s.number}</b>{s.title.length > 22 ? s.title.slice(0, 21) + '…' : s.title}
            </a>
          ))}
        </nav>
      </header>

      <main className="sp-main">
        <h1 className="sp-title">Guion: Hermes</h1>
        {SCENES.map((s) => (
          <section key={s.id} id={`sp-${s.id}`} className="sp-scene" aria-labelledby={`sp-h-${s.id}`}>
            <h2 id={`sp-h-${s.id}`}><span>{s.number}.</span> {s.title}</h2>
            <p className="sp-meta">{duration(s.minutes)} · {s.place}</p>
            {s.question && <p className="sp-question"><strong>Pregunta:</strong> {s.question}</p>}
            {s.beats.length === 0 && <p className="sp-empty">Sin pasos todavía.</p>}
            {s.beats.map((b) => (
              <div key={b.id} className="sp-beat">
                {b.stage && <p className="sp-stage">[{b.stage}]</p>}
                {b.lines.map((l, i) => {
                  const other = filter !== 0 && l.presenter !== undefined && l.presenter !== filter
                  return (
                    <p key={i} className={`sp-line${other ? ' is-dim' : ''}`}>
                      <b>{SPEAKER_NAMES[l.speaker] ?? l.speaker}:</b> {l.text}
                      {l.presenter === undefined
                        ? <span className="sp-unassigned">sin asignar</span>
                        : filter === 0 && <span className="sp-who">P{l.presenter}</span>}
                    </p>
                  )
                })}
                {b.onScreen && (
                  <div className="sp-screen">
                    <strong>En pantalla</strong>{Array.isArray(b.onScreen) ? b.onScreen.join(' · ') : b.onScreen}
                  </div>
                )}
                {b.interaction && <div className="sp-pause" role="note">⏸ Pausa: {b.interaction}</div>}
              </div>
            ))}
          </section>
        ))}
      </main>

      <button type="button" className="sp-up" aria-label="Volver arriba"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
    </div>
  )
}
