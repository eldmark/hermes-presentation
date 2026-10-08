import { createContext, useContext, useEffect, useRef } from 'react'

/** Devuelve true si consumió la tecla. */
export type SceneKeyHandler = (e: KeyboardEvent) => boolean | void

const handlers = new Set<SceneKeyHandler>()

/** Lo usa useKeyboard antes de aplicar las teclas globales. */
export function dispatchSceneKey(e: KeyboardEvent): boolean {
  for (const h of handlers) if (h(e) === true) return true
  return false
}

/** Stage lo provee por escena para saber si está activa. */
export const SceneActiveContext = createContext(false)

/** Registra teclas propias de la escena; solo está activo cuando la escena está activa. */
export function useSceneKeys(handler: SceneKeyHandler) {
  const active = useContext(SceneActiveContext)
  const ref = useRef(handler)
  ref.current = handler
  useEffect(() => {
    if (!active) return
    const h: SceneKeyHandler = (e) => ref.current(e)
    handlers.add(h)
    return () => { handlers.delete(h) }
  }, [active])
}
