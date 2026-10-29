// ─── Palette — modifier ici ───────────────────────────────────────────────────

const P = {
  lightest: '#F4EFE6',
  light:    '#6B7B84',
  mid:      '#5e4b3b',
  dark:     '#465562',
  darkest:  '#0E2233',
  accent:   '#3f5f86',
  glow:     '#6f9fc8',  // touches ambiantes arrière-plan uniquement
} as const
// ─── Hex → rgba ───────────────────────────────────────────────────────────────

function rgba(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

// ─── Tokens sémantiques ───────────────────────────────────────────────────────

export const colors = {
  bg:          P.lightest,
  bgCard:      '#FFFFFF',
  bgCardHome:  '#ffffff',
  bgSubtle:    '#F5F8FC',
  text:        P.darkest,
  textMuted:   P.dark,
  textLight:   P.mid,
  accent:      P.accent,
  accentLight: '#DDEDF9',
  accentHover: '#0558A3',
  green:       'oklch(57% 0.14 155)',
  greenLight:  'oklch(95% 0.04 155)',
  border:      P.light,
  borderLight: '#D5E1EA',
} as const

// Couleur par contexte de projet — une seule source pour toutes les pages
export const contextColors = {
  Stage: colors.green,
  ESME:  colors.accent,
  BUT:   P.mid,
  Perso: '#954130',
} as const

// ─── Alpha helpers ────────────────────────────────────────────────────────────

export const ca = {
  accent: (a: number) => rgba(P.accent,   a),
  text:   (a: number) => rgba(P.darkest,  a),
  green:  (a: number) => `oklch(57% 0.14 155 / ${a})`,
  border: (a: number) => rgba(P.light,    a),
  bg:     (a: number) => rgba(P.lightest, a),
  glow:   (a: number) => rgba(P.glow,    a),
} as const

export const fonts = {
  heading: "'Newsreader', Georgia, serif",
  body: "'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const
