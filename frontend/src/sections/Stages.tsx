import { Link } from 'react-router'
import { motion } from 'motion/react'
import PageTransition from '@/components/PageTransition'
import Reveal from '@/components/Reveal'
import { colors, fonts, ca, contextColors, justify } from '@/lib/tokens'
import { type Stage } from '@/lib/data'
import { useStages } from '@/hooks/useStages'
import StageScene from '@/three/StageScene'
import { useMediaQuery, NARROW } from '@/hooks/useMediaQuery'

const STAGE_ACCENT = contextColors.Stage

// ─── Stage Card ───────────────────────────────────────────────────────────────

function StageCard({ stage, index }: { stage: Stage; index: number }) {
  const narrow = useMediaQuery(NARROW)   // téléphone : une colonne, animation au-dessus du texte
  const isReversed = index % 2 === 1 && !narrow

  const visualZone = (
    <div style={{
      background: stage.upcoming
        ? `repeating-linear-gradient(45deg, transparent, transparent 8px, ${STAGE_ACCENT}08 8px, ${STAGE_ACCENT}08 9px)`
        : `linear-gradient(135deg, ${STAGE_ACCENT}0a 0%, ${STAGE_ACCENT}1a 100%)`,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      padding: '40px clamp(16px, 4vw, 36px)',
      minHeight: '300px',
    }}>
      {/* Company + duration pill */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{
          fontFamily: fonts.heading,
          fontSize: 'clamp(28px, 3vw, 42px)',
          fontWeight: 500,
          color: stage.upcoming ? colors.textLight : colors.text,
          letterSpacing: '-0.02em',
          marginBottom: '10px',
        }}>
          {stage.company}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '5px 14px', borderRadius: '20px',
          background: `${STAGE_ACCENT}18`, border: `1px solid ${STAGE_ACCENT}30`,
        }}>
          <span style={{ fontFamily: fonts.mono, fontSize: '11px', color: STAGE_ACCENT, fontWeight: 600 }}>
            {stage.duration}
          </span>
          <span style={{ width: 1, height: 10, background: `${STAGE_ACCENT}40` }} />
          <span style={{ fontFamily: fonts.mono, fontSize: '11px', color: STAGE_ACCENT }}>
            {stage.period}
          </span>
        </div>
      </div>

      {/* Animation du stage (schéma de principe) */}
      {!stage.upcoming && (
        <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: '180px' }}>
          <StageScene slug={stage.slug} />
        </div>
      )}

      {/* Upcoming badge */}
      {stage.upcoming && (
        <div style={{
          position: 'relative', zIndex: 1,
          padding: '8px 20px', borderRadius: '8px',
          border: `1.5px dashed ${STAGE_ACCENT}50`,
          fontFamily: fonts.mono, fontSize: '12px', color: STAGE_ACCENT,
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          À venir
        </div>
      )}

      {/* Location badge */}
      <div style={{
        position: 'absolute', bottom: 16, right: 16,
        fontFamily: fonts.mono, fontSize: '10px', color: colors.textLight,
        letterSpacing: '0.06em',
      }}>
        {stage.location}
      </div>
    </div>
  )

  const textZone = (
    <div style={{ padding: narrow ? '24px 20px 28px' : '44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontFamily: fonts.mono, fontSize: '11px', color: STAGE_ACCENT, marginBottom: '14px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {stage.context}
      </div>
      <h3 style={{
        fontFamily: fonts.heading, fontSize: 'clamp(20px, 2.2vw, 28px)',
        fontWeight: 400, color: colors.text, margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.2,
      }}>
        {stage.role}
      </h3>
      <p style={{ fontFamily: fonts.body, fontSize: '14px', color: colors.textMuted, margin: '0 0 22px', lineHeight: 1.75, ...justify }}>
        {stage.description}
      </p>

      {/* Chiffres clés */}
      {stage.highlights && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '0 0 22px' }}>
          {stage.highlights.map((h, i) => (
            <div key={h.label} style={{ padding: '8px 12px', borderRadius: '10px', background: colors.bgCard, border: `1px solid ${STAGE_ACCENT}30` }}>
              <div style={{ fontFamily: fonts.mono, fontSize: '15px', fontWeight: 700, color: i === 0 ? STAGE_ACCENT : colors.text }}>{h.value}</div>
              <div style={{ fontFamily: fonts.body, fontSize: '10px', color: colors.textLight, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Missions */}
      {stage.missions.length > 0 && (
        <ul style={{ margin: '0 0 22px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {stage.missions.map((m, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontFamily: fonts.body, fontSize: '13px', color: colors.textMuted, lineHeight: 1.6, ...justify }}>
              <span style={{ color: STAGE_ACCENT, fontWeight: 700, marginTop: '1px', flexShrink: 0 }}>›</span>
              {m}
            </li>
          ))}
        </ul>
      )}

      {/* Tags */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: stage.upcoming ? 0 : '24px' }}>
        {stage.tags.map(tag => (
          <span key={tag} style={{
            fontFamily: fonts.body, fontSize: '11px', fontWeight: 500,
            padding: '3px 10px', borderRadius: '20px',
            background: `${STAGE_ACCENT}0F`, color: STAGE_ACCENT, border: `1px solid ${STAGE_ACCENT}22`,
          }}>
            {tag}
          </span>
        ))}
      </div>

      {!stage.upcoming && (
        <motion.span
          style={{ fontFamily: fonts.body, fontSize: '13px', fontWeight: 600, color: STAGE_ACCENT, display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          Voir le détail →
        </motion.span>
      )}
    </div>
  )

  const card = (
    <motion.div
      whileHover={!stage.upcoming ? { boxShadow: `0 20px 60px ${ca.text(0.12)}` } : {}}
      style={{
        display: 'grid',
        gridTemplateColumns: narrow ? '1fr' : isReversed ? '1fr 1.1fr' : '1.1fr 1fr',
        borderRadius: '18px', overflow: 'hidden',
        border: stage.upcoming ? `1.5px dashed ${colors.border}` : `1px solid ${colors.border}`,
        background: colors.bgCard,
        boxShadow: `0 4px 18px ${ca.text(0.05)}`,
        transition: 'box-shadow 0.3s',
        opacity: stage.upcoming ? 0.65 : 1,
        cursor: stage.upcoming ? 'default' : 'pointer',
      }}
    >
      {isReversed ? <>{textZone}{visualZone}</> : <>{visualZone}{textZone}</>}
    </motion.div>
  )

  return (
    <Reveal delay={index * 0.08}>
      {stage.upcoming ? card : (
        <Link to={`/stages/${stage.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
          {card}
        </Link>
      )}
    </Reveal>
  )
}

// ─── Page Stages ──────────────────────────────────────────────────────────────

export default function Stages() {
  const { data: stages } = useStages()
  const done = stages.filter(s => !s.upcoming)
  const upcoming = stages.filter(s => s.upcoming)

  return (
    <PageTransition>
      <div style={{ paddingTop: '64px', background: colors.bg, minHeight: '100svh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px, 5vw, 48px)' }}>

          {/* ── Header ── */}
          <section style={{ padding: '80px 0 56px' }}>
            <div style={{ overflow: 'hidden', marginBottom: '12px' }}>
              <motion.h1
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: 'inset(0 0% 0 0)' }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
                style={{
                  fontFamily: fonts.heading, fontSize: 'clamp(52px, 7.5vw, 94px)',
                  fontWeight: 400, color: colors.text, margin: 0,
                  letterSpacing: '-0.03em', lineHeight: 1.02,
                }}
              >
                Stages
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              style={{ fontFamily: fonts.body, fontSize: '17px', color: colors.textMuted, margin: 0, lineHeight: 1.7, ...justify }}
            >
              {done.length} stages · du laboratoire d'analyses à la bio-informatique, en passant par la robotique chirurgicale.
            </motion.p>
          </section>

          {/* ── Stages terminés ── */}
          <section style={{ paddingBottom: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <span style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color: STAGE_ACCENT, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Expériences
              </span>
              <div style={{ flex: 1, height: 1, background: colors.borderLight }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {done.map((s, i) => <StageCard key={s.slug} stage={s} index={i} />)}
            </div>
          </section>

          {/* ── À venir ── */}
          {upcoming.length > 0 && (
            <section style={{ paddingBottom: '80px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <span style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color: colors.textLight, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  À venir
                </span>
                <div style={{ flex: 1, height: 1, background: colors.borderLight }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {upcoming.map((s, i) => <StageCard key={s.slug} stage={s} index={i} />)}
              </div>
            </section>
          )}

        </div>
      </div>
    </PageTransition>
  )
}
