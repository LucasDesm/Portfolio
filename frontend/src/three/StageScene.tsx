import { motion, useReducedMotion } from 'motion/react'
import { colors, fonts, contextColors } from '@/lib/tokens'

// Animations des stages, en schéma de principe (aucune donnée réelle) :
// - INSERM : la composition observée par la chaîne, confrontée au certificat
// - Quantum Surgical : le parc métrologique et les échéances d'étalonnage
// - Laboratoire Excell : la chaîne de traçabilité, l'incertitude s'élargit à chaque étape
// Utilisées dans les cartes de la page Stages et en haut de chaque page de stage.

const A = contextColors.Stage
const SVG_STYLE: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }
const TEXT = { fontFamily: fonts.mono, fontSize: 7, fill: colors.textLight } as const

// Boucle synchronisée : chaque élément décrit sa propre séquence sur la même durée
const loop = (duration: number, times: number[]) => ({ duration, times: times.map(t => t / duration), repeat: Infinity, ease: 'linear' as const })

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 240 150" preserveAspectRatio="xMidYMid meet" style={SVG_STYLE} aria-hidden>
      {children}
      <text x={236} y={8} textAnchor="end" {...TEXT} fontSize={6}>schéma de principe</text>
    </svg>
  )
}

// ── INSERM : valider contre une vérité connue ──────────────────────────────────

const SEGMENTS = [
  { c: colors.accent,    cert: 0.30, obs: 0.32 },
  { c: colors.rust,      cert: 0.22, obs: 0.20 },
  { c: colors.olive,     cert: 0.18, obs: 0.19 },
  { c: colors.textLight, cert: 0.15, obs: 0.14 },
  { c: colors.wine,      cert: 0.10, obs: 0.10 },
  { c: colors.border,    cert: 0.05, obs: 0.05 },
]
const cumul = (k: 'cert' | 'obs') => SEGMENTS.map((_, i) => SEGMENTS.slice(0, i).reduce((s, x) => s + x[k], 0))

function InsermScene() {
  const reduce = useReducedMotion()
  const L = 7, X0 = 50, W = 170, OBS_Y = 56, CERT_Y = 96, H = 14
  const cObs = cumul('obs'), cCert = cumul('cert')
  return (
    <Frame>
      <text x={X0 - 5} y={OBS_Y + 10} textAnchor="end" {...TEXT}>observée</text>
      <text x={X0 - 5} y={CERT_Y + 10} textAnchor="end" {...TEXT}>certifiée</text>

      {/* Composition certifiée : la vérité connue */}
      {SEGMENTS.map((s, i) => (
        <rect key={`c${i}`} x={X0 + cCert[i] * W} y={CERT_Y} width={s.cert * W} height={H}
          fill={s.c} fillOpacity={0.12} stroke={s.c} strokeWidth={0.8} strokeDasharray="2 2" />
      ))}

      {/* Lectures qui tombent, puis composition observée segment par segment */}
      {SEGMENTS.map((s, i) => {
        const start = 0.8 + i * 0.45
        const x = X0 + (cObs[i] + s.obs / 2) * W
        return (
          <g key={`o${i}`}>
            {[0, 1].map(k => {
              const t0 = start - 0.45 + k * 0.15
              return (
                <motion.circle key={k} cx={x + (k ? 3 : -3)} r={1.8} fill={s.c}
                  cy={OBS_Y} opacity={0}
                  animate={reduce ? undefined : { cy: [8, 8, 8, OBS_Y, OBS_Y, 8], opacity: [0, 0, 0.9, 0.9, 0, 0] }}
                  transition={loop(L, [0, t0 - 0.01, t0, t0 + 0.45, t0 + 0.5, L])}
                />
              )
            })}
            <motion.rect x={X0 + cObs[i] * W} y={OBS_Y} width={s.obs * W} height={H} fill={s.c}
              style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
              animate={reduce ? undefined : { scaleX: [0, 0, 1, 1, 0, 0] }}
              transition={loop(L, [0, start, start + 0.45, 6.3, 6.8, L])}
            />
          </g>
        )
      })}

      {/* Comparaison : l'écart entre ce que la chaîne voit et la vérité */}
      <motion.g opacity={reduce ? 1 : 0}
        animate={reduce ? undefined : { opacity: [0, 0, 1, 1, 0, 0] }}
        transition={loop(L, [0, 3.6, 4.0, 6.3, 6.8, L])}
      >
        {SEGMENTS.slice(1).map((_, j) => (
          <line key={j} x1={X0 + cObs[j + 1] * W} y1={OBS_Y + H} x2={X0 + cCert[j + 1] * W} y2={CERT_Y}
            stroke={colors.textMuted} strokeWidth={0.6} />
        ))}
        <text x={X0 + W / 2} y={CERT_Y + H + 14} textAnchor="middle" {...TEXT} fill={A}>écart mesuré face au certificat</text>
      </motion.g>
    </Frame>
  )
}

// ── Quantum Surgical : le parc métrologique ────────────────────────────────────

function Instrument({ kind, x, y }: { kind: number; x: number; y: number }) {
  const p = { stroke: colors.textMuted, strokeWidth: 1, fill: 'none', strokeLinecap: 'round' as const }
  switch (kind) {
    case 0: // cadran
      return <g {...p}><circle cx={x} cy={y} r={7} /><line x1={x} y1={y} x2={x + 4} y2={y - 4} /></g>
    case 1: // règle graduée
      return <g {...p}><rect x={x - 8} y={y - 3} width={16} height={6} rx={1} />{[-5, -2, 1, 4].map(d => <line key={d} x1={x + d} y1={y - 3} x2={x + d} y2={y} />)}</g>
    case 2: // thermomètre
      return <g {...p}><line x1={x} y1={y - 7} x2={x} y2={y + 3} /><circle cx={x} cy={y + 5} r={2.5} /></g>
    default: // balance
      return <g {...p}><line x1={x} y1={y - 6} x2={x} y2={y + 6} /><line x1={x - 7} y1={y - 4} x2={x + 7} y2={y - 4} /><path d={`M${x - 9},${y + 1} L${x - 7},${y - 4} L${x - 5},${y + 1} Z M${x + 5},${y + 1} L${x + 7},${y - 4} L${x + 9},${y + 1} Z`} /></g>
  }
}

function QuantumScene() {
  const reduce = useReducedMotion()
  const R = 17
  const C = 2 * Math.PI * R
  return (
    <Frame>
      {Array.from({ length: 8 }, (_, i) => {
        const x = 45 + (i % 4) * 50
        const y = 42 + Math.floor(i / 4) * 48
        const d = 7 + (i % 3) * 1.5
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={R} fill={colors.bgCard} stroke={colors.borderLight} strokeWidth={2.5} />
            {/* Validité de l'étalonnage : l'anneau se vide, puis l'instrument est réétalonné */}
            <motion.circle cx={x} cy={y} r={R} fill="none" strokeWidth={2.5} strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * 0.3} stroke={colors.olive}
              transform={`rotate(-90 ${x} ${y})`}
              animate={reduce ? undefined : {
                strokeDashoffset: [0, C * 0.55, C * 0.9, C * 0.9, 0],
                stroke: [colors.olive, colors.olive, A, A, colors.olive],
              }}
              transition={{ duration: d, delay: i * 0.6, times: [0, 0.55, 0.9, 0.93, 1], repeat: Infinity, ease: 'linear' }}
            />
            <Instrument kind={i % 4} x={x} y={y} />
          </g>
        )
      })}
      <text x={120} y={128} textAnchor="middle" {...TEXT}>parc métrologique · validité d'étalonnage</text>
      <circle cx={84} cy={140} r={2.5} fill={colors.olive} />
      <text x={90} y={142.5} {...TEXT}>valide</text>
      <circle cx={128} cy={140} r={2.5} fill={A} />
      <text x={134} y={142.5} {...TEXT}>à étalonner</text>
    </Frame>
  )
}

// ── Laboratoire Excell : la traçabilité métrologique ───────────────────────────

const LINKS = [
  { x: 36,  h: 5,  label: ['étalon', 'de référence'] },
  { x: 92,  h: 9,  label: ['étalon', 'du labo'] },
  { x: 148, h: 14, label: ['instrument', ''] },
  { x: 204, h: 20, label: ['résultat', 'de mesure'] },
]

function ExcellScene() {
  const reduce = useReducedMotion()
  const L = 6, Y = 62
  return (
    <Frame>
      <line x1={LINKS[0].x} y1={Y} x2={LINKS[3].x} y2={Y} stroke={colors.border} strokeWidth={1} />

      {LINKS.map((n, i) => {
        const t = 0.3 + i
        return (
          <g key={i}>
            {/* Incertitude : plus large à chaque étape de la chaîne */}
            <motion.g style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              animate={reduce ? undefined : { scaleY: [0, 0, 1, 1, 0, 0] }}
              transition={loop(L, [0, t, t + 0.35, 5.2, 5.6, L])}
            >
              <line x1={n.x} y1={Y - n.h} x2={n.x} y2={Y + n.h} stroke={A} strokeWidth={1.4} />
              <line x1={n.x - 4} y1={Y - n.h} x2={n.x + 4} y2={Y - n.h} stroke={A} strokeWidth={1.4} />
              <line x1={n.x - 4} y1={Y + n.h} x2={n.x + 4} y2={Y + n.h} stroke={A} strokeWidth={1.4} />
            </motion.g>
            <circle cx={n.x} cy={Y} r={4.5} fill={colors.bgCard} stroke={colors.textMuted} strokeWidth={1} />
            <text x={n.x} y={Y + 34} textAnchor="middle" {...TEXT}>{n.label[0]}</text>
            <text x={n.x} y={Y + 43} textAnchor="middle" {...TEXT}>{n.label[1]}</text>
          </g>
        )
      })}

      {/* L'étalonnage se transmet d'un maillon au suivant */}
      {!reduce && (
        <motion.circle cy={Y} r={2.6} fill={colors.accent}
          animate={{ cx: [LINKS[0].x, LINKS[0].x, LINKS[3].x, LINKS[3].x, LINKS[0].x], opacity: [0, 1, 1, 0, 0] }}
          transition={loop(L, [0, 0.3, 3.3, 3.6, L])}
        />
      )}
      <motion.text x={LINKS[3].x + 8} y={Y - LINKS[3].h - 4} {...TEXT} fill={A}
        opacity={reduce ? 1 : 0}
        animate={reduce ? undefined : { opacity: [0, 0, 1, 1, 0, 0] }}
        transition={loop(L, [0, 3.4, 3.7, 5.2, 5.6, L])}
      >± U</motion.text>

      <text x={120} y={132} textAnchor="middle" {...TEXT}>traçabilité métrologique · ISO/IEC 17025</text>
    </Frame>
  )
}

export default function StageScene({ slug }: { slug: string }) {
  switch (slug) {
    case 'inserm-mrgm':        return <InsermScene />
    case 'quantum-surgical':   return <QuantumScene />
    case 'laboratoire-excell': return <ExcellScene />
    default:                   return null
  }
}
