import { SCENES } from '../../data/scenes'

const mmss = (s: number) => {
  const t = Math.max(0, Math.round(s))
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}

/** Minutos planeados acumulados (punto medio) hasta el final de la escena `scene` (0-indexada). */
export function plannedSeconds(scene: number): number {
  return SCENES.slice(0, scene + 1).reduce((a, s) => a + ((s.minutes[0] + s.minutes[1]) / 2) * 60, 0)
}

export function Hud({ scene, beat, elapsed, planned }: { scene: number; beat: number; elapsed: number; planned: number }) {
  const s = SCENES[scene]
  return (
    <div style={{
      position: 'fixed', top: 12, left: 12, padding: '8px 14px', borderRadius: 8,
      background: 'rgba(0,0,0,.65)', color: '#fff', font: '16px/1.4 system-ui, sans-serif', pointerEvents: 'none',
    }}>
      <div>Escena {s.number}/{SCENES.length}: {s.title}</div>
      <div>Paso {beat + 1}/{s.beats.length} ({s.beats[beat].id})</div>
      <div>{mmss(elapsed)} / plan {mmss(planned)}</div>
    </div>
  )
}
