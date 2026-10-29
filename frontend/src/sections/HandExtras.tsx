import { motion } from 'motion/react'
import { colors, fonts } from '@/lib/tokens'

// ─── SVG chart helpers ────────────────────────────────────────────────────────

const VW = 320, VH = 140

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

// ─── Raw EMG chart (biphasic, noisy) ─────────────────────────────────────────

function RawEMGChart() {
  // Biphasic oscillation simulating raw surface EMG - goes above and below center (y=70)
  const d = `M0,70 C6,14 15,126 24,68 C33,12 42,128 51,72 C60,18 68,122 78,68
             C87,16 95,124 105,72 C114,20 122,118 132,68 C141,18 149,122 159,72
             C168,22 176,116 186,70 C195,20 203,118 213,70 C222,24 230,114 240,70
             C249,22 257,116 267,70 C276,26 284,112 294,70 L${VW},70`
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      {/* Center line */}
      <line x1={0} y1={70} x2={VW} y2={70} stroke="#374151" strokeWidth={0.8} strokeDasharray="4 3" />
      {/* Labels */}
      <text x={4} y={14} fontSize="8" fill="#9ca3af" opacity={0.6} fontFamily="monospace">+</text>
      <text x={4} y={134} fontSize="8" fill="#9ca3af" opacity={0.6} fontFamily="monospace">−</text>
      <text x={4} y={VH - 2} fontSize="7" fill="#6b7280" opacity={0.7} fontFamily="monospace">ARTEFACTS · BRUIT 60 Hz</text>
      <text x={VW - 4} y={VH - 2} fontSize="8" fill="#9ca3af" opacity={0.45} fontFamily="monospace" textAnchor="end">temps →</text>
      <motion.path
        d={d}
        fill="none"
        stroke="#9ca3af"
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.0, ease: 'easeInOut' }}
      />
    </svg>
  )
}

// ─── Processed EMG chart (rectified + smoothed envelope) ─────────────────────

function ProcessedEMGChart({ accent }: { accent: string }) {
  // Envelope: starts near baseline (y=128), rises to activation plateau (~y=48), ends settling (~y=70)
  const d = `M0,130 C18,130 32,124 48,112 C64,100 76,84 96,66 C112,52 128,46 150,44
             C170,42 190,46 212,54 C230,60 248,68 270,74 L${VW},76`
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      {/* Activation zone shading */}
      <rect x={0} y={36} width={VW} height={94} fill={accent} fillOpacity={0.05} />
      <line x1={0} y1={36} x2={VW} y2={36} stroke={accent} strokeWidth={0.8} strokeDasharray="4 3" strokeOpacity={0.3} />
      {/* Baseline */}
      <line x1={0} y1={128} x2={VW} y2={128} stroke="#374151" strokeWidth={0.8} strokeDasharray="4 3" />
      {/* Labels */}
      <text x={4} y={30} fontSize="8" fill={accent} opacity={0.65} fontFamily="monospace">ACTIVATION</text>
      <text x={4} y={VH - 2} fontSize="7" fill="#6b7280" opacity={0.7} fontFamily="monospace">BASELINE</text>
      <text x={VW - 4} y={VH - 2} fontSize="8" fill="#9ca3af" opacity={0.45} fontFamily="monospace" textAnchor="end">temps →</text>
      {/* Fill under curve */}
      <motion.path
        d={`${d} L${VW},130 L0,130 Z`}
        fill={accent}
        fillOpacity={0.08}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.2 }}
      />
      {/* Envelope line */}
      <motion.path
        d={d}
        fill="none"
        stroke={accent}
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.0, ease: 'easeInOut', delay: 0.2 }}
      />
      {/* Endpoint dot */}
      <motion.circle
        cx={VW - 5} cy={76} r={5}
        fill={accent}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 2.1 }}
      />
    </svg>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function HandExtras({ ctxColor }: { ctxColor: string }) {
  return (
    <section style={{ padding: '80px 48px 0', maxWidth: '1100px', margin: '0 auto' }}>
      <SectionHead title="Traitement du signal EMG" accent={ctxColor} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Signal brut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ padding: '24px', borderRadius: '18px', background: colors.bgCard, border: `1px solid ${colors.border}`, position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right, #6b7280, transparent)', borderRadius: '18px 18px 0 0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color: '#9ca3af', background: '#9ca3af1a', border: '1px solid #9ca3af30', padding: '3px 10px', borderRadius: '20px' }}>
              Signal brut
            </span>
          </div>
          <RawEMGChart />
          <p style={{ fontFamily: fonts.body, fontSize: '12px', color: colors.textMuted, margin: '12px 0 0', lineHeight: 1.6 }}>
            Signal EMG brut capté par les électrodes de surface — biphasique, bruité, contaminé par artefacts 60 Hz et mouvement.
          </p>
        </motion.div>

        {/* Signal traité */}
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
              Enveloppe filtrée · FIR 20–500 Hz
            </span>
          </div>
          <ProcessedEMGChart accent={ctxColor} />
          <p style={{ fontFamily: fonts.body, fontSize: '12px', color: colors.textMuted, margin: '12px 0 0', lineHeight: 1.6 }}>
            Après redressement et filtrage passe-bande FIR — enveloppe d'activation lisse exploitable pour la classification des prises.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
