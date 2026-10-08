import './quiz.css'

export type QuizPhase = 'shown' | 'hidden' | 'revealed'
export interface QuestionCardProps {
  prompt: string
  options: [string, string, string, string]
  phase: QuizPhase
  correct: 0 | 1 | 2 | 3
}

const SHAPES = ['triangle', 'diamond', 'circle', 'square'] as const
const NAMES = ['rojo, triángulo', 'azul, rombo', 'amarillo, círculo', 'verde, cuadrado']

function Shape({ kind }: { kind: (typeof SHAPES)[number] }) {
  return (
    <svg className="qc-shape" viewBox="0 0 24 24" aria-hidden="true">
      {kind === 'triangle' && <polygon points="12,3 22,21 2,21" />}
      {kind === 'diamond' && <polygon points="12,2 22,12 12,22 2,12" />}
      {kind === 'circle' && <circle cx="12" cy="12" r="10" />}
      {kind === 'square' && <rect x="3" y="3" width="18" height="18" />}
    </svg>
  )
}

export function QuestionCard({ prompt, options, phase, correct }: QuestionCardProps) {
  return (
    <section className={`qc qc-${phase}`} aria-label="Pregunta">
      <h2 className="qc-prompt">{prompt}</h2>
      {phase === 'hidden' && <p className="qc-voice" role="status">La respuesta viaja por voz…</p>}
      <ul className="qc-grid">
        {options.map((opt, i) => {
          const state = phase === 'revealed' ? (i === correct ? 'correct' : 'dim') : ''
          return (
            <li key={i} className={`qc-opt qc-c${i} ${state}`} aria-label={phase === 'hidden' ? NAMES[i] : undefined}>
              <Shape kind={SHAPES[i]} />
              {phase !== 'hidden' && <span className="qc-text">{opt}</span>}
              {state === 'correct' && <span className="qc-check" aria-label="Correcta">✓</span>}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
