import './quiz.css'

export interface ScoreboardProps {
  scores: number[]
  variant: 'corner' | 'center'
  /** Índice (0-indexado) de la mesa que destella al sumar. */
  flash?: number
  /** Clic = +1, Shift+clic = −1. */
  onSelectTable?: (i: number, delta: 1 | -1) => void
}

export function Scoreboard({ scores, variant, flash, onSelectTable }: ScoreboardProps) {
  const max = Math.max(0, ...scores)
  // En 'center' se ordena visualmente por puntaje; el número de mesa se conserva.
  const order = scores.map((_, i) => i)
  if (variant === 'center') order.sort((a, b) => scores[b] - scores[a] || a - b)
  return (
    <ol className={`sb sb-${variant}`} aria-label="Marcador">
      {order.map((i) => {
        const leader = variant === 'center' && max > 0 && scores[i] === max
        const cls = `sb-row${leader ? ' leader' : ''}${flash === i ? ' flash' : ''}`
        const inner = (
          <>
            <span className="sb-table">Mesa {i + 1}</span>
            <span className="sb-score">{scores[i]}</span>
          </>
        )
        return (
          <li key={i} className={cls}>
            {onSelectTable ? (
              <button type="button" className="sb-btn" onClick={(e) => onSelectTable(i, e.shiftKey ? -1 : 1)}>{inner}</button>
            ) : inner}
          </li>
        )
      })}
    </ol>
  )
}
