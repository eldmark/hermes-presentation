import { GEN_H, GEN_W, GENERATION_LABELS, layoutGenealogy, type Generation } from '../../data/genealogia'
import './panels.css'

const LAYOUT = layoutGenealogy()
const ROW_DELAY = 0.45 // s entre generaciones

/** Árbol genealógico de Hermes (SVG puro, escala con el contenedor). */
export function GenealogyTree() {
  const { nodes, edges } = LAYOUT
  return (
    <svg className="gt" viewBox={`0 0 ${GEN_W} ${GEN_H}`} role="img"
      aria-label="Árbol genealógico de Hermes: hijo de Zeus y Maia, nieto de Atlas, hermano de Apolo por parte de padre.">
      <defs>
        <radialGradient id="gt-glow">
          <stop offset="0" stopColor="#e6c765" stopOpacity=".75" />
          <stop offset="1" stopColor="#c9a227" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="gt-legend">
        {GENERATION_LABELS.map((g, i) => (
          <g key={g.gen} transform={`translate(790 ${528 + i * 28})`}>
            <circle r="9" className={`gt-c gt-${g.gen}`} />
            <text x="26" y="8" className="gt-leg-t">{g.label}</text>
          </g>
        ))}
      </g>

      {edges.map((e, i) => {
        const row = Math.max(...e.from.map((id) => nodes.find((n) => n.id === id)!.row))
        const style = { animationDelay: `${(row + 0.5) * ROW_DELAY}s` }
        return (
          <g key={i} className={`gt-edge gt-in${e.hot ? ' hot' : ''}`} style={style}>
            <path d={e.path} className="gt-link" />
            {e.couple && <line x1={e.couple[0]} y1={e.couple[1]} x2={e.couple[2]} y2={e.couple[3]} className="gt-pair" />}
          </g>
        )
      })}

      {nodes.map((n) => {
        const nameSize = n.emphasis === 'focus' ? 40 : 31
        const nameY = n.y + n.r + nameSize * 0.95
        return (
          <g key={n.id} className={`gt-node gt-in e-${n.emphasis}`}
            style={{ animationDelay: `${n.delayGroup * ROW_DELAY}s` }}>
            {n.emphasis === 'focus' && <circle cx={n.x} cy={n.y} r={n.r * 2.6} fill="url(#gt-glow)" className="gt-pulse" />}
            {n.group ? (
              <rect x={n.x - 22} y={n.y - n.r} width="44" height={n.r * 2} rx="9" className={`gt-c gt-${n.gen}`} />
            ) : (
              <circle cx={n.x} cy={n.y} r={n.r} className={`gt-c gt-${n.gen}`} />
            )}
            <text x={n.x} y={nameY} textAnchor="middle" className="gt-name" style={{ fontSize: nameSize }}>{n.name}</text>
            {n.sub?.map((line, i) => (
              <text key={i} x={n.x} y={nameY + 26 + i * 25} textAnchor="middle" className="gt-sub">{line}</text>
            ))}
            {n.alias && (
              <g className="gt-alias">
                <text x={n.x + n.r + 16} y={n.y + 9} className="gt-alias-t">{n.alias}</text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export type { Generation }
