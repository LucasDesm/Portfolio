import { motion, useReducedMotion } from 'motion/react'
import { colors } from '@/lib/tokens'

// Pendant le chargement d'une page : un battement ECG qui parcourt une ligne fine.
// Apparition retardée : rien ne s'affiche si la page arrive tout de suite.

const BEAT = 'M0,20 L70,20 L78,26 L86,4 L94,34 L102,20 L120,20 C126,20 130,12 136,12 C142,12 146,20 152,20 L240,20'

export default function PageLoader() {
  const reduce = useReducedMotion()
  return (
    <div role="status" aria-label="Chargement de la page" style={{ minHeight: '100svh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.svg
        viewBox="0 0 240 40" width="160" height="27"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        style={{ overflow: 'visible' }}
      >
        <path d={BEAT} fill="none" stroke={colors.borderLight} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <motion.path
          d={BEAT} fill="none" stroke={colors.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0.18, pathOffset: 0 }}
          animate={reduce ? undefined : { pathOffset: [0, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
        />
      </motion.svg>
    </div>
  )
}
