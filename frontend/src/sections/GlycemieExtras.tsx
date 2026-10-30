import { motion } from 'motion/react'
import { colors, fonts, justify } from '@/lib/tokens'
import { ChainDiagram } from '@/components/ChainDiagram'

// ─── Hardware extension chain ─────────────────────────────────────────────────

const HARDWARE_STEPS = [
  { label: 'Cardio + GSR', sublabel: 'effort · émotion' },
  { label: 'Arduino MKR', sublabel: 'WiFi 1010' },
  { label: 'Bluetooth', sublabel: 'vers smartphone' },
  { label: 'Alerte activité', sublabel: 'buzzer' },
]

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
      <rect x={0} y={Z1} width={VW} height={Z2 - Z1} fill={colors.olive} fillOpacity={0.08} />
      <line x1={0} y1={Z1} x2={VW} y2={Z1} stroke={colors.olive} strokeWidth={1} strokeDasharray="5 4" strokeOpacity={0.4} />
      <line x1={0} y1={Z2} x2={VW} y2={Z2} stroke={colors.olive} strokeWidth={1} strokeDasharray="5 4" strokeOpacity={0.4} />
      {/* Labels */}
      <text x={4} y={Z1 - 4} fontSize="8" fill={colors.rust} fontFamily={fonts.mono}>HYPER</text>
      <text x={4} y={VH - 3} fontSize="8" fill={colors.accent} fontFamily={fonts.mono}>HYPO</text>
      <text x={VW - 4} y={VH - 3} fontSize="8" fill={colors.textLight} fontFamily={fonts.mono} textAnchor="end">temps →</text>
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
        stroke={colors.rust}
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
      <section style={{ padding: '80px clamp(16px, 5vw, 48px) 0', maxWidth: '1100px', margin: '0 auto' }}>
        <SectionHead title="Principe de la régulation (illustration)" accent={ctxColor} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>

          {/* Sans correcteur */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ padding: '24px', borderRadius: '18px', background: colors.bgCard, border: `1px solid ${colors.border}`, position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, ${colors.rust}, transparent)`, borderRadius: '18px 18px 0 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color: colors.rust, background: `${colors.rust}14`, border: `1px solid ${colors.rust}30`, padding: '3px 10px', borderRadius: '20px' }}>
                Sans correcteur
              </span>
            </div>
            <NoControlChart />
            <p style={{ fontFamily: fonts.body, fontSize: '12px', color: colors.textMuted, margin: '12px 0 0', lineHeight: 1.6, ...justify }}>
              Schéma de principe : sans régulation, la glycémie sort de la zone cible après les perturbations (repas, activité).
            </p>
          </motion.div>

          {/* Avec PID */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ padding: '24px', borderRadius: '18px', background: colors.bgCard, border: `1px solid ${colors.border}`, position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, ${ctxColor}, transparent)`, borderRadius: '18px 18px 0 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color: ctxColor, background: `${ctxColor}14`, border: `1px solid ${ctxColor}30`, padding: '3px 10px', borderRadius: '20px' }}>
                Avec correcteur
              </span>
            </div>
            <PIDChart accent={ctxColor} />
            <p style={{ fontFamily: fonts.body, fontSize: '12px', color: colors.textMuted, margin: '12px 0 0', lineHeight: 1.6, ...justify }}>
              Schéma de principe : le correcteur ramène la glycémie dans la zone cible. Courbes illustratives, pas des résultats de simulation.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ── Extension matérielle Arduino ── */}
      <section style={{ padding: '80px clamp(16px, 5vw, 48px) 0', maxWidth: '1100px', margin: '0 auto' }}>
        <SectionHead title="Prototype : détecteur d'activité physique" accent={ctxColor} />
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ fontFamily: fonts.body, fontSize: '14px', color: colors.textMuted, margin: '0 0 28px', lineHeight: 1.7, ...justify }}
        >
          Seuil de fréquence cardiaque réglable, capteur GSR pour écarter les fortes émotions, alerte par buzzer et transmission Bluetooth vers un smartphone. Objectif : ajuster la régulation pendant l'effort ; l'intégration dans la boucle reste une perspective.
        </motion.p>
        <ChainDiagram steps={HARDWARE_STEPS} ctxColor={ctxColor} />
      </section>

    </>
  )
}
