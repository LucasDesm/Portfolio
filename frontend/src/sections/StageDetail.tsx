import { useParams, Link } from 'react-router'
import { motion } from 'motion/react'
import PageTransition from '@/components/PageTransition'
import { colors, fonts } from '@/lib/tokens'
import { useStage } from '@/hooks/useStages'

const STAGE_ACCENT = '#2d8c5f'

export default function StageDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data: stage } = useStage(slug ?? '')

  if (!stage) {
    return (
      <PageTransition>
        <div style={{ paddingTop: '64px', minHeight: '100svh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: fonts.body, color: colors.textMuted, marginBottom: '16px' }}>Stage introuvable.</p>
            <Link to="/stages" style={{ color: STAGE_ACCENT, fontFamily: fonts.body, fontSize: '14px' }}>← Retour aux stages</Link>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div style={{ paddingTop: '64px', background: colors.bg, minHeight: '100svh' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 48px' }}>

          {/* ── Retour ── */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            style={{ paddingTop: '40px', paddingBottom: '8px' }}
          >
            <Link to="/stages" style={{
              textDecoration: 'none', fontFamily: fonts.body, fontSize: '13px',
              color: colors.textLight, display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}>
              ← Stages
            </Link>
          </motion.div>

          {/* ── Header ── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ padding: '32px 0 48px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{
                fontFamily: fonts.mono, fontSize: '11px', fontWeight: 700,
                color: STAGE_ACCENT, background: `${STAGE_ACCENT}18`,
                padding: '4px 12px', borderRadius: '20px', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                {stage.context}
              </span>
              <span style={{ fontFamily: fonts.mono, fontSize: '11px', color: colors.textLight }}>
                {stage.period} · {stage.location}
              </span>
            </div>
            <h1 style={{
              fontFamily: fonts.heading, fontSize: 'clamp(36px, 5vw, 60px)',
              fontWeight: 400, color: colors.text, margin: '0 0 8px',
              letterSpacing: '-0.03em', lineHeight: 1.08,
            }}>
              {stage.company}
            </h1>
            <p style={{ fontFamily: fonts.body, fontSize: '18px', color: STAGE_ACCENT, margin: '0 0 24px', fontWeight: 500 }}>
              {stage.role}
            </p>
            <p style={{ fontFamily: fonts.body, fontSize: '16px', color: colors.textMuted, margin: 0, lineHeight: 1.75, maxWidth: '680px' }}>
              {stage.description}
            </p>
          </motion.section>

          {/* ── Highlights ── */}
          {stage.highlights && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '56px' }}
            >
              {stage.highlights.map(h => (
                <div key={h.label} style={{
                  padding: '16px 24px', borderRadius: '12px',
                  background: `${h.color ?? STAGE_ACCENT}10`,
                  border: `1px solid ${h.color ?? STAGE_ACCENT}22`,
                  textAlign: 'center', minWidth: '110px',
                }}>
                  <div style={{ fontFamily: fonts.mono, fontSize: '24px', fontWeight: 700, color: h.color ?? STAGE_ACCENT }}>{h.value}</div>
                  <div style={{ fontFamily: fonts.body, fontSize: '11px', color: colors.textLight, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h.label}</div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ── Contenu ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '56px' }}
          >
            {/* Missions */}
            {stage.missions.length > 0 && (
              <div style={{
                padding: '28px 32px', borderRadius: '14px',
                border: `1px solid ${colors.border}`, background: colors.bgCard,
              }}>
                <h2 style={{ fontFamily: fonts.heading, fontSize: '20px', fontWeight: 500, color: colors.text, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
                  Missions
                </h2>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stage.missions.map((m, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontFamily: fonts.body, fontSize: '14px', color: colors.textMuted, lineHeight: 1.65 }}>
                      <span style={{ color: STAGE_ACCENT, fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>›</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Compétences */}
            <div style={{
              padding: '28px 32px', borderRadius: '14px',
              border: `1px solid ${colors.border}`, background: colors.bgCard,
            }}>
              <h2 style={{ fontFamily: fonts.heading, fontSize: '20px', fontWeight: 500, color: colors.text, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
                Compétences
              </h2>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {stage.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: fonts.body, fontSize: '12px', fontWeight: 500,
                    padding: '5px 12px', borderRadius: '20px',
                    background: `${STAGE_ACCENT}0F`, color: STAGE_ACCENT, border: `1px solid ${STAGE_ACCENT}22`,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Long description ── */}
          {stage.longDescription && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              style={{ marginBottom: '80px' }}
            >
              <div style={{
                padding: '32px 36px', borderRadius: '14px',
                border: `1px solid ${colors.border}`, background: colors.bgCard,
              }}>
                <h2 style={{ fontFamily: fonts.heading, fontSize: '20px', fontWeight: 500, color: colors.text, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
                  Contexte
                </h2>
                <p style={{ fontFamily: fonts.body, fontSize: '15px', color: colors.textMuted, margin: 0, lineHeight: 1.8 }}>
                  {stage.longDescription}
                </p>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </PageTransition>
  )
}
