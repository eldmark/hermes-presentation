import '../../components/ui/quiz.css'
import './actividad.css'
import { QuestionCard } from '../../components/ui/QuestionCard'
import { Scoreboard } from '../../components/ui/Scoreboard'
import { QUIZ } from '../../data/scenes'
import type { Beat } from '../../data/types'
import { MAX_TABLES, MIN_TABLES } from '../../presentation/quizState'
import type { QuizState } from '../../presentation/quizState'
import { usesReserve } from './logic'

export interface ActividadUIProps {
  beatId: string
  quiz?: Beat['quiz']
  state: QuizState
  swapped: number | null
  flash?: number
  notice?: string
  onSelectTable(i: number, delta: 1 | -1): void
  onTables(delta: 1 | -1): void
}

/** DOM de la actividad: tarjeta de pregunta, marcador, selector de mesas y avisos. */
export function ActividadUI({ beatId, quiz, state, swapped, flash, notice, onSelectTable, onTables }: ActividadUIProps) {
  const q = quiz ? (usesReserve(swapped, quiz.q) ? QUIZ.reserve : QUIZ.questions[quiz.q - 1]) : undefined
  return (
    // mousedown sin foco: así Espacio/Enter siguen siendo de la presentación tras un clic.
    <div className="act-host" onMouseDown={(e) => e.preventDefault()}>
      {notice && <div className="act-notice" role="status">{notice}</div>}
      {quiz && q && (
        <>
          {usesReserve(swapped, quiz.q) && <div className="act-reserve">Pregunta de reserva</div>}
          <QuestionCard prompt={q.prompt} options={q.options} phase={quiz.phase} correct={q.correct} />
          <Scoreboard scores={state.scores} variant="corner" flash={flash} onSelectTable={onSelectTable} />
        </>
      )}
      {beatId === 'mesas' && (
        <>
          <div className="act-tables">
            <button type="button" className="act-btn" aria-label="Menos mesas" disabled={state.tables <= MIN_TABLES} onClick={() => onTables(-1)}>−</button>
            <div className="act-tables-n" aria-live="polite">{state.tables}</div>
            <button type="button" className="act-btn" aria-label="Más mesas" disabled={state.tables >= MAX_TABLES} onClick={() => onTables(1)}>+</button>
          </div>
          <Scoreboard scores={state.scores} variant="corner" flash={flash} />
        </>
      )}
      {beatId === 'cierre' && <Scoreboard scores={state.scores} variant="center" flash={flash} onSelectTable={onSelectTable} />}
    </div>
  )
}
