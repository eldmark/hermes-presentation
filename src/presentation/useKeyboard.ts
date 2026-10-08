import { useEffect, useRef } from 'react'
import { dispatchSceneKey } from './keys'

export interface KeyboardActions {
  next(): void
  prev(): void
  home(): void
  toggleHud(): void
  toggleBlack(): void
}

const NEXT = new Set(['ArrowRight', 'ArrowDown', ' ', 'PageDown', 'Enter'])
const PREV = new Set(['ArrowLeft', 'ArrowUp', 'PageUp'])

export function useKeyboard(actions: KeyboardActions) {
  const ref = useRef(actions)
  ref.current = actions
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (dispatchSceneKey(e)) { e.preventDefault(); return }
      const a = ref.current
      const k = e.key
      if (NEXT.has(k)) a.next()
      else if (PREV.has(k)) a.prev()
      else if (k === 'Home') a.home()
      else if (k === 'f' || k === 'F') {
        if (document.fullscreenElement) void document.exitFullscreen()
        else void document.documentElement.requestFullscreen?.()
      }
      else if (k === 'h' || k === 'H') a.toggleHud()
      else if (k === 'b' || k === 'B' || k === '.') a.toggleBlack()
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
