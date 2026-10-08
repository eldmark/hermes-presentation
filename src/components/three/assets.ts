/** Rutas relativas a public/models (se usan con asset()). null = aún no hay modelo: se dibuja el placeholder. */
export const ASSETS = {
  hermes: null,
  apolo: null,
  calipso: null,
  odiseo: null,
  humano: null,
  alma: null,
  zeus: null,
  lira: null,
  tortuga: null,
  ganado: null,
  herma: null,
  caduceo: null,
  carta: null,
  moly: null,
} as const satisfies Record<string, string | null>
