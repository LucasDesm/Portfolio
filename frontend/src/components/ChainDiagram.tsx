import { motion } from 'motion/react'
import { colors, fonts } from '@/lib/tokens'
import type { ChainStep } from '@/lib/data'
import { useMediaQuery, NARROW } from '@/hooks/useMediaQuery'

// Flèche entre deux étapes : horizontale, ou verticale sur téléphone
function ChainArrow({ ctxColor, vertical }: { ctxColor: string; vertical: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', alignItems: 'center', flexShrink: 0, width: vertical ? 'auto' : '48px', height: vertical ? '28px' : 'auto' }}>
      <motion.div
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        style={vertical
          ? { flex: 1, width: '1.5px', background: `linear-gradient(to bottom, ${ctxColor}50, ${ctxColor}90)` }
          : { flex: 1, height: '1.5px', background: `linear-gradient(to right, ${ctxColor}50, ${ctxColor}90)` }}
      />
      <div style={vertical
        ? { width: 0, height: 0, flexShrink: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: `7px solid ${ctxColor}90` }
        : { width: 0, height: 0, flexShrink: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: `7px solid ${ctxColor}90` }}
      />
    </div>
  )
}

export function ChainDiagram({ steps, ctxColor, feedback, label }: {
  steps: ChainStep[]
  ctxColor: string
  feedback?: boolean
  label?: string
}) {
  const vertical = useMediaQuery(NARROW)   // téléphone : une étape sous l'autre
  return (
    <div>
      {/* Centrée quand elle tient, défilable depuis le début sinon */}
      <div style={{ display: 'flex', overflowX: 'auto', paddingBottom: '4px' }}>
        <div style={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', alignItems: vertical ? 'stretch' : 'center', margin: '0 auto', width: vertical ? '100%' : 'auto' }}>
          {steps.map((step, i) => (
            <div key={step.label} style={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', alignItems: 'center' }}>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.09 }}
                style={{
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background: colors.bgCard,
                  border: `1px solid ${ctxColor}30`,
                  minWidth: '130px',
                  width: vertical ? '100%' : 'auto',
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  boxShadow: `0 4px 20px ${ctxColor}0c`,
                }}
              >
                <div style={{ fontFamily: fonts.body, fontSize: '13px', fontWeight: 600, color: colors.text, lineHeight: 1.3 }}>
                  {step.label}
                </div>
                {step.sublabel && (
                  <div style={{ fontFamily: fonts.mono, fontSize: '10px', color: ctxColor, marginTop: '5px' }}>
                    {step.sublabel}
                  </div>
                )}
              </motion.div>
              {i < steps.length - 1 && <ChainArrow ctxColor={ctxColor} vertical={vertical} />}
            </div>
          ))}
        </div>
      </div>

      {feedback && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ marginTop: '12px', display: 'flex', alignItems: 'center', maxWidth: '800px', margin: '12px auto 0' }}
        >
          <div style={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderRight: `7px solid ${ctxColor}40` }} />
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(to left, ${ctxColor}40, ${ctxColor}15)` }} />
          <span style={{
            padding: '3px 14px', borderRadius: '20px',
            background: `${ctxColor}0e`, border: `1px solid ${ctxColor}22`,
            fontFamily: fonts.mono, fontSize: '10px', color: ctxColor,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            {label ?? 'boucle fermée'}
          </span>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, ${ctxColor}40, ${ctxColor}15)` }} />
          <div style={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: `7px solid ${ctxColor}40` }} />
        </motion.div>
      )}
    </div>
  )
}
