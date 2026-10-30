import { Link } from 'react-router'
import { motion } from 'motion/react'
import PageTransition from '@/components/PageTransition'
import { colors, fonts, ca } from '@/lib/tokens'
import { usePageTitle } from '@/hooks/usePageTitle'

// Adresse inconnue : page sobre, deux sorties
export default function NotFound() {
  usePageTitle('Page introuvable')
  return (
    <PageTransition>
      <div style={{ paddingTop: '64px', minHeight: '100svh', background: colors.bg, display: 'flex', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxWidth: '760px', margin: '0 auto', padding: '80px clamp(16px, 5vw, 48px)' }}
        >
          <p style={{ fontFamily: fonts.mono, fontSize: '12px', color: colors.textLight, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 18px' }}>
            Erreur 404
          </p>
          <h1 style={{ fontFamily: fonts.heading, fontSize: 'clamp(44px, 7vw, 80px)', fontWeight: 400, color: colors.text, margin: '0 0 6px', letterSpacing: '-0.035em', lineHeight: 1.02 }}>
            Page introuvable.
          </h1>
          <p style={{ fontFamily: fonts.heading, fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 300, fontStyle: 'italic', color: colors.textMuted, margin: '0 0 28px', letterSpacing: '-0.02em' }}>
            Le signal s'est perdu en route.
          </p>
          <p style={{ fontFamily: fonts.body, fontSize: '16px', lineHeight: 1.75, color: colors.textMuted, margin: '0 0 40px', maxWidth: '520px' }}>
            Cette adresse n'existe pas ou a été déplacée.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/" style={{ textDecoration: 'none', background: colors.accent, color: colors.bg, padding: '14px 28px', borderRadius: '14px', fontFamily: fonts.body, fontSize: '15px', fontWeight: 600, boxShadow: `0 6px 24px ${ca.accent(0.22)}` }}>
              Retour à l'accueil
            </Link>
            <Link to="/projets" style={{ textDecoration: 'none', color: colors.text, border: `1.5px solid ${colors.border}`, padding: '14px 28px', borderRadius: '14px', fontFamily: fonts.body, fontSize: '15px', fontWeight: 600 }}>
              Voir les projets
            </Link>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
