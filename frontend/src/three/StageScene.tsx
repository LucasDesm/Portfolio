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
              style={{ originX: 0 }}
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
  const L = 9
  const SX = 18, SY = 38, SW = 34, SH = 46   // fiche papier
  const TX = 92                              // tableau de suivi
  const rowY = (k: number) => 58 + k * 18
  const sheets = [0.2, 1.6, 3.0]             // arrivée de chaque fiche
  const show = (r: number) => loop(L, [0, r, r + 0.4, 8.2, 8.7, L])
  return (
    <Frame>
      {/* Fiches papier : une par instrument, numérisées l'une après l'autre */}
      {sheets.map((s, k) => (
        <motion.g key={k} opacity={reduce && k === 0 ? 1 : 0}
          animate={reduce ? undefined : { x: [-60, -60, 0, 0, 40, 40], opacity: [0, 0, 1, 1, 0, 0] }}
          transition={loop(L, [0, s, s + 0.6, s + 0.9, s + 1.3, L])}
        >
          <path d={`M${SX},${SY} h${SW - 8} l8,8 v${SH - 8} h${-SW} Z`} fill={colors.bgCard} stroke={colors.textMuted} strokeWidth={0.8} />
          <path d={`M${SX + SW - 8},${SY} v8 h8`} fill="none" stroke={colors.textMuted} strokeWidth={0.8} />
          {[12, 18, 24, 30].map(dy => <line key={dy} x1={SX + 5} x2={SX + (dy === 30 ? 16 : 25)} y1={SY + dy} y2={SY + dy} stroke={colors.border} strokeWidth={0.8} />)}
          <circle cx={SX + SW - 8} cy={SY + SH - 8} r={4} fill="none" stroke={colors.olive} strokeWidth={0.8} />
          <path d={`M${SX + SW - 10},${SY + SH - 8} l1.6,1.6 l3,-3.2`} fill="none" stroke={colors.olive} strokeWidth={0.8} />
        </motion.g>
      ))}
      <text x={SX + SW / 2} y={SY + SH + 12} textAnchor="middle" {...TEXT}>fiche papier</text>
      <path d="M62,60 h14 m-4,-3 l4,3 l-4,3" fill="none" stroke={colors.border} strokeWidth={1} />

      {/* Base de suivi numérique */}
      <text x={TX} y={30} {...TEXT} fill={colors.textMuted}>base de suivi</text>
      <text x={TX} y={44} {...TEXT} fontSize={6}>instrument</text>
      <text x={TX + 46} y={44} {...TEXT} fontSize={6}>statut</text>
      <text x={TX + 104} y={44} {...TEXT} fontSize={6}>validité</text>
      <line x1={TX} x2={TX + 140} y1={47} y2={47} stroke={colors.border} strokeWidth={0.8} />

      {[0, 1, 2].map(k => {
        const y = rowY(k)
        const expires = k === 1   // cette ligne arrive à échéance
        return (
          <motion.g key={k} opacity={reduce ? 1 : 0}
            animate={reduce ? undefined : { opacity: [0, 0, 1, 1, 0, 0] }}
            transition={show(sheets[k] + 1.0)}
          >
            <g transform={`translate(${TX + 10} ${y}) scale(0.65) translate(${-TX - 10} ${-y})`}>
              <Instrument kind={k === 2 ? 3 : k} x={TX + 10} y={y} />
            </g>

            {/* Statut : valide, puis à étalonner le temps de l'étalonnage */}
            <rect x={TX + 44} y={y - 6} width={48} height={12} rx={6} fill={colors.olive} fillOpacity={0.12} stroke={colors.olive} strokeWidth={0.6} />
            <motion.text x={TX + 68} y={y + 2.2} textAnchor="middle" {...TEXT} fontSize={6} fill={colors.olive}
              animate={reduce || !expires ? undefined : { opacity: [1, 1, 0, 0, 1, 1] }}
              transition={loop(L, [0, 6.0, 6.2, 7.0, 7.2, L])}
            >valide</motion.text>
            {expires && !reduce && (
              <motion.g opacity={0}
                animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
                transition={loop(L, [0, 6.0, 6.2, 7.0, 7.2, L])}
              >
                <rect x={TX + 44} y={y - 6} width={48} height={12} rx={6} fill={colors.bgCard} stroke={A} strokeWidth={0.8} />
                <rect x={TX + 44} y={y - 6} width={48} height={12} rx={6} fill={A} fillOpacity={0.12} />
                <text x={TX + 68} y={y + 2.2} textAnchor="middle" {...TEXT} fontSize={6} fill={A}>à étalonner</text>
              </motion.g>
            )}
            {/* Alerte à l'échéance */}
            {expires && !reduce && (
              <motion.circle cx={TX + 68} cy={y} r={10} fill="none" stroke={A} strokeWidth={0.8}
                opacity={0}
                animate={{ opacity: [0, 0, 0.8, 0, 0], r: [10, 10, 10, 22, 22] }}
                transition={loop(L, [0, 6.1, 6.2, 6.9, L])}
              />
            )}

            {/* Validité restante avant le prochain étalonnage */}
            <rect x={TX + 104} y={y - 1.5} width={34} height={3} rx={1.5} fill={colors.borderLight} />
            <motion.rect x={TX + 104} y={y - 1.5} width={34} height={3} rx={1.5} fill={colors.olive}
              style={{ originX: 0 }}
              animate={reduce ? undefined : expires
                ? { scaleX: [0.7, 0.7, 0.04, 0.04, 1, 1], fill: [colors.olive, colors.olive, A, A, colors.olive, colors.olive] }
                : { scaleX: [0.9 - k * 0.15, 0.85 - k * 0.15] }}
              transition={expires ? loop(L, [0, 4.8, 6.2, 6.9, 7.3, L]) : { duration: L, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
            />
          </motion.g>
        )
      })}

      <text x={120} y={136} textAnchor="middle" {...TEXT}>parc métrologique · digitalisation du suivi</text>
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
