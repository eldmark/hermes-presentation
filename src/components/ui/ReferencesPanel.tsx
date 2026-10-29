import type { ReactNode } from 'react'
import './panels.css'

/** Convierte `*cursiva*` en <em>; el resto queda como texto. */
export function renderItalics(text: string): ReactNode[] {
  return text.split(/\*([^*]+)\*/g).map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : part))
}

export function ReferencesPanel({ title, items, note }: { title: string; items: string[]; note?: string }) {
  const long = items.reduce((n, s) => n + s.length, 0)
  // Más texto => letra más chica (la lista de 5 ítems largos usa el mínimo).
  const size = long > 800 ? 'pn-ref-s' : long > 520 ? 'pn-ref-m' : 'pn-ref-l'
  return (
    <section className={`pn-refs ${size}`}>
      <h2 className="pn-ref-title">{title}</h2>
      <ul className="pn-ref-list">
        {items.map((it, i) => <li key={i}>{renderItalics(it)}</li>)}
      </ul>
      {note && <p className="pn-ref-note">{note}</p>}
    </section>
  )
}
