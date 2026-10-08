/** Ruta de un recurso de public/ respetando `base` (GitHub Pages). */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '')
}
