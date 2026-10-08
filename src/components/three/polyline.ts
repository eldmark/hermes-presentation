import type { Vec3 } from '../../data/types'

const dist = (a: Vec3, b: Vec3) => Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])

/** Punto a fracción t (0..1) del recorrido total de la polilínea. */
export function pointAt(points: Vec3[], t: number): Vec3 {
  const s = slicePolyline(points, t)
  return s[s.length - 1] ?? [0, 0, 0]
}

/** Recorta la polilínea a la fracción `progress` (0..1) de su longitud, interpolando el último punto. */
export function slicePolyline(points: Vec3[], progress: number): Vec3[] {
  if (points.length === 0) return []
  const p = Math.min(1, Math.max(0, progress))
  if (p >= 1) return points.slice()
  if (p <= 0 || points.length === 1) return [points[0]]
  let total = 0
  for (let i = 1; i < points.length; i++) total += dist(points[i - 1], points[i])
  if (total === 0) return [points[0]]
  const target = total * p
  const out: Vec3[] = [points[0]]
  let acc = 0
  for (let i = 1; i < points.length; i++) {
    const seg = dist(points[i - 1], points[i])
    if (acc + seg >= target) {
      const k = seg === 0 ? 0 : (target - acc) / seg
      const a = points[i - 1], b = points[i]
      out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k])
      return out
    }
    acc += seg
    out.push(points[i])
  }
  return out
}

/** Arco cuadrático de `a` a `b` elevado en Y `arc * longitud`. Con arc=0 devuelve [a, b]. */
export function arcPoints(a: Vec3, b: Vec3, arc = 0, segments = 24): Vec3[] {
  if (!arc) return [a, b]
  const h = dist(a, b) * arc
  const c: Vec3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + h * 2, (a[2] + b[2]) / 2]
  const out: Vec3[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments, u = 1 - t
    out.push([
      u * u * a[0] + 2 * u * t * c[0] + t * t * b[0],
      u * u * a[1] + 2 * u * t * c[1] + t * t * b[1],
      u * u * a[2] + 2 * u * t * c[2] + t * t * b[2],
    ])
  }
  return out
}
