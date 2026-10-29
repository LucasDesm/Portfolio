import { motion } from 'motion/react'
import { colors, fonts } from '@/lib/tokens'
import { ChainDiagram } from '@/components/ChainDiagram'

// ─── Hardware extension chain ─────────────────────────────────────────────────

const HARDWARE_STEPS = [
  { label: 'Capteur GSR', sublabel: 'conductance peau' },
  { label: 'Arduino MKR', sublabel: 'WiFi 1010' },
  { label: 'BLE', sublabel: 'Bluetooth LE' },
  { label: 'Ajustement PID', sublabel: 'activité physique' },
]

// ─── Simulation grid ──────────────────────────────────────────────────────────

function seededRandom(s: number) {
  const x = Math.sin(s + 1) * 10000
  return x - Math.floor(x)
}

const ROWS = 11, COLS = 20
type CellStatus = 'green' | 'yellow' | 'red'

const GRID: CellStatus[] = Array.from({ length: ROWS * COLS }, (_, i) => {
  const r = seededRandom(i * 137.508)
  if (r < 0.74) return 'green'
  if (r < 0.91) return 'yellow'
  return 'red'
})

const CELL_COLOR: Record<CellStatus, string> = {
  green:  '#4ade80',
  yellow: '#fbbf24',
  red:    '#f87171',
}

// ─── PID comparison charts ────────────────────────────────────────────────────

// SVG coordinate system: y=0 top, y=140 bottom
// Target zone: y ∈ [50, 95] (center ≈ 72)
const VW = 320, VH = 140
const Z1 = 50, Z2 = 95  // normal zone bounds

function ChartShell({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      width="100%"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Normal glycemia zone */}
      <rect x={0} y={Z1} width={VW} height={Z2 - Z1} fill="#4ade80" fillOpacity={0.08} />
      <line x1={0} y1={Z1} x2={VW} y2={Z1} stroke="#4ade80" strokeWidth={1} strokeDasharray="5 4" strokeOpacity={0.4} />
      <line x1={0} y1={Z2} x2={VW} y2={Z2} stroke="#4ade80" strokeWidth={1} strokeDasharray="5 4" strokeOpacity={0.4} />
      {/* Labels */}
      <text x={4} y={Z1 - 4} fontSize="8" fill="#f87171" opacity={0.65} fontFamily="monospace">HYPER</text>
      <text x={4} y={VH - 3} fontSize="8" fill="#60a5fa" opacity={0.65} fontFamily="monospace">HYPO</text>
      <text x={VW - 4} y={VH - 3} fontSize="8" fill="#9ca3af" opacity={0.5} fontFamily="monospace" textAnchor="end">temps →</text>
      {children}
    </svg>
  )
}

function NoControlChart() {
  // Oscillates widely, never enters the target zone
  const d = `M0,22 C26,22 46,120 66,122 C82,124 100,8 118,6 C132,4 155,127 172,130 C184,132 206,6 222,3 C236,1 258,122 280,125 L${VW},125`
  return (
    <ChartShell>
      <motion.path
        d={d}
        fill="none"
        stroke="#f87171"
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.2, ease: 'easeInOut' }}
      />
    </ChartShell>
  )
}

function PIDChart({ accent }: { accent: string }) {
  // Starts at hyperglycemia, quickly converges to center of target zone (y≈72)
  const d = `M0,18 C32,18 52,58 80,68 C100,74 118,72 155,72 C195,72 250,72 ${VW},72`
  return (
    <ChartShell>
      <motion.path
        d={d}
        fill="none"
        stroke={accent}
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: 'easeInOut', delay: 0.2 }}
      />
      {/* Endpoint dot — shows stabilization */}
      <motion.circle
        cx={VW - 5} cy={72} r={5}
        fill={accent}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 2.1 }}
      />
    </ChartShell>
  )
}

// ─── Section header (same style as ProjetDetail) ─────────────────────────────

function SectionHead({ title, accent }: { title: string; accent: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 style={{ fontFamily: fonts.heading, fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 400, color: colors.text, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
        {title}
      </h2>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ height: 1, background: `linear-gradient(to right, ${accent}50, transparent)`, transformOrigin: 'left', marginBottom: '36px', maxWidth: '200px' }}
      />
    </motion.div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function GlycemieExtras({ ctxColor }: { ctxColor: string }) {
  return (
    <>

      {/* ── Avant / Après PID ── */}
      <section style={{ padding: '80px 48px 0', maxWidth: '1100px', margin: '0 auto' }}>
        <SectionHead title="Avant / Après correcteur" accent={ctxColor} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {/* Sans correcteur */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ padding: '24px', borderRadius: '18px', background: colors.bgCard, border: `1px solid ${colors.border}`, position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right, #f87171, transparent)', borderRadius: '18px 18px 0 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color: '#f87171', background: '#f871711a', border: '1px solid #f8717130', padding: '3px 10px', borderRadius: '20px' }}>
                Sans correcteur
              </span>
            </div>
            <NoControlChart />
            <p style={{ fontFamily: fonts.body, fontSize: '12px', color: colors.textMuted, margin: '12px 0 0', lineHeight: 1.6 }}>
              La glycémie oscille sans régulation — alternance hyperglycémie / hypoglycémie.
            </p>
          </motion.div>

          {/* Avec PID */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ padding: '24px', borderRadius: '18px', background: colors.bgCard, border: `1px solid ${ctxColor}22`, position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, ${ctxColor}, transparent)`, borderRadius: '18px 18px 0 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color: ctxColor, background: `${ctxColor}14`, border: `1px solid ${ctxColor}30`, padding: '3px 10px', borderRadius: '20px' }}>
                Avec PID · Ziegler-Nichols
              </span>
            </div>
            <PIDChart accent={ctxColor} />
            <p style={{ fontFamily: fonts.body, fontSize: '12px', color: colors.textMuted, margin: '12px 0 0', lineHeight: 1.6 }}>
              Le correcteur PID ramène et maintient la glycémie dans la zone cible.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ── Extension matérielle Arduino ── */}
      <section style={{ padding: '80px 48px 0', maxWidth: '1100px', margin: '0 auto' }}>
        <SectionHead title="Extension matérielle" accent={ctxColor} />
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ fontFamily: fonts.body, fontSize: '14px', color: colors.textMuted, margin: '0 0 28px', lineHeight: 1.7 }}
        >
          Détection d'activité physique en temps réel pour adapter dynamiquement les paramètres du correcteur.
        </motion.p>
        <ChainDiagram steps={HARDWARE_STEPS} ctxColor={ctxColor} />
      </section>

      {/* ── Grille de simulation ── */}
      <section style={{ padding: '80px 48px 0', maxWidth: '1100px', margin: '0 auto' }}>
        <SectionHead title="Résultats de simulation" accent={ctxColor} />

        {/* Légende */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {(['green', 'yellow', 'red'] as CellStatus[]).map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div style={{ width: 10, height: 10, borderRadius: '3px', background: CELL_COLOR[s] }} />
              <span style={{ fontFamily: fonts.body, fontSize: '12px', color: colors.textMuted }}>
                {s === 'green' ? 'Glycémie contrôlée' : s === 'yellow' ? 'Limite' : 'Hors zone'}
              </span>
            </div>
          ))}
          <span style={{ fontFamily: fonts.mono, fontSize: '11px', color: colors.textLight, marginLeft: 'auto' }}>
            {GRID.filter(c => c === 'green').length} / {ROWS * COLS} succès
          </span>
        </div>

        {/* En-tête colonnes */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ width: '28px', flexShrink: 0 }} />
          <div style={{ fontFamily: fonts.mono, fontSize: '10px', color: colors.textLight }}>
            20 scénarios →
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-start', margin: '0 auto', width: 'fit-content' }}>
          {Array.from({ length: ROWS }, (_, row) => (
            <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontFamily: fonts.mono, fontSize: '9px', color: colors.textLight, width: '24px', textAlign: 'right', flexShrink: 0 }}>
                P{row + 1}
              </span>
              <div style={{ display: 'flex', gap: '5px' }}>
                {Array.from({ length: COLS }, (_, col) => {
                  const status = GRID[row * COLS + col]
                  return (
                    <motion.div
                      key={col}
                      initial={{ opacity: 0, scale: 0.3 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.25, delay: (row * COLS + col) * 0.003, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        width: 14, height: 14,
                        borderRadius: '4px',
                        background: CELL_COLOR[status],
                        opacity: status === 'green' ? 0.75 : status === 'yellow' ? 0.9 : 1,
                      }}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>

      </section>

    </>
  )
}
