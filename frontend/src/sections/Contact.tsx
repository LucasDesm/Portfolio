import { useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import PageTransition from '@/components/PageTransition'
import { colors, fonts, ca, justify } from '@/lib/tokens'
import { useMediaQuery, NARROW } from '@/hooks/useMediaQuery'

const DIRECT_EMAIL = 'lucasdesmartin@yahoo.fr'

// ─── Contact direct ───────────────────────────────────────────────────────────
// Pas de formulaire tant que l'API Java n'est pas déployée : un mail ne se perd jamais.

function DirectContact() {
  const [copied, setCopied] = useState(false)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(DIRECT_EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      style={{
        background: colors.bgCard, border: `1px solid ${colors.border}`,
        borderRadius: '20px', padding: '36px',
        boxShadow: `0 4px 24px ${ca.text(0.05)}`,
        display: 'flex', flexDirection: 'column', gap: '18px',
      }}
    >
      <h2 style={{ fontFamily: fonts.heading, fontSize: '22px', fontWeight: 400, color: colors.text, margin: 0, letterSpacing: '-0.015em' }}>
        Écrivez-moi directement
      </h2>
      <p style={{ fontFamily: fonts.body, fontSize: '14px', color: colors.textMuted, lineHeight: 1.7, margin: 0, ...justify }}>
        Une offre de PFE, une question sur un projet : je réponds sous 48 h.
      </p>
      <div style={{ fontFamily: fonts.mono, fontSize: '15px', color: colors.text, padding: '14px 16px', borderRadius: '10px', background: colors.bgSubtle, border: `1px solid ${colors.borderLight}`, wordBreak: 'break-all' }}>
        {DIRECT_EMAIL}
      </div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <a
          href={`mailto:${DIRECT_EMAIL}?subject=${encodeURIComponent('PFE : prise de contact')}`}
          style={{ flex: '1 1 180px', textAlign: 'center', textDecoration: 'none', background: colors.accent, color: colors.bg, padding: '14px 22px', borderRadius: '14px', fontFamily: fonts.body, fontSize: '15px', fontWeight: 600, boxShadow: `0 6px 24px ${ca.accent(0.22)}` }}
        >
          Ouvrir ma messagerie
        </a>
        <button
          type="button"
          onClick={copyEmail}
          aria-live="polite"
          style={{ flex: '1 1 140px', background: 'transparent', color: colors.text, border: `1.5px solid ${colors.border}`, padding: '14px 22px', borderRadius: '14px', fontFamily: fonts.body, fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
        >
          {copied ? 'Adresse copiée ✓' : "Copier l'adresse"}
        </button>
      </div>
    </motion.div>
  )
}

// ─── Lien de contact ──────────────────────────────────────────────────────────

function ContactLink({ icon, label, href, sublabel }: { icon: string; label: string; href: string; sublabel?: string }) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      whileHover={{ x: 4, color: colors.text }}
      style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', color: colors.textMuted, padding: '12px 0' }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: '10px',
        background: colors.bgSubtle, border: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: fonts.body, fontSize: '14px', fontWeight: 600, color: 'inherit' }}>{label}</div>
        {sublabel && <div style={{ fontFamily: fonts.body, fontSize: '11px', color: colors.textLight, marginTop: '1px' }}>{sublabel}</div>}
      </div>
      <span style={{ marginLeft: 'auto', fontSize: '14px', opacity: 0.5 }}>→</span>
    </motion.a>
  )
}

// ─── Panel gauche ─────────────────────────────────────────────────────────────

function InfoPanel() {
  const narrow = useMediaQuery(NARROW)
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: narrow ? 'static' : 'sticky', top: '100px', alignSelf: 'start' }}
    >
      {/* Badge disponible */}
      <div
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '7px 16px', borderRadius: '20px',
          background: colors.accentLight, border: `1px solid ${ca.accent(0.2)}`,
          marginBottom: '28px',
        }}
      >
        <motion.span
          animate={{ opacity: [1, 0.2, 1], scale: [1, 0.8, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ width: 6, height: 6, borderRadius: '50%', background: colors.accent, display: 'block' }}
        />
        <span style={{ fontFamily: fonts.body, fontSize: '12px', fontWeight: 600, color: colors.accent, letterSpacing: '0.04em' }}>
          Disponible · PFE à partir du 7 avril 2027
        </span>
      </div>

      {/* Titre */}
      <div style={{ overflow: 'hidden', marginBottom: '4px' }}>
        <motion.h1
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          style={{ fontFamily: fonts.heading, fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 400, color: colors.text, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.06 }}
        >
          Parlons-en.
        </motion.h1>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.55 }}
        style={{ fontFamily: fonts.body, fontSize: '15px', color: colors.textMuted, lineHeight: 1.8, margin: '0 0 40px', ...justify }}
      >
        PFE 6 mois · R&D biomédicale · à partir du 7 avril 2027.<br />
        IA appliquée aux données de santé : imagerie médicale, dispositifs médicaux, données biologiques.
      </motion.p>

      {/* Liens */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        style={{ display: 'flex', flexDirection: 'column', borderTop: `1px solid ${colors.borderLight}` }}
      >
        <ContactLink icon="✉" label="Email" href={`mailto:${DIRECT_EMAIL}`} sublabel={DIRECT_EMAIL} />
        <div style={{ height: 1, background: colors.borderLight }} />
        <ContactLink icon="in" label="LinkedIn" href="https://www.linkedin.com/in/lucas-desmartin-953177250/" sublabel="linkedin.com/in/lucas-desmartin" />
        <div style={{ height: 1, background: colors.borderLight }} />
        <ContactLink icon="⌥" label="GitHub" href="https://github.com/LucasDesm" sublabel="github.com/LucasDesm" />
        <div style={{ height: 1, background: colors.borderLight }} />
        <ContactLink icon="↓" label="Télécharger le CV" href="/lucas-desmartin-cv.pdf" sublabel="CV PFE · PDF" />
      </motion.div>

      {/* Info disponibilité */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        style={{ marginTop: '32px', padding: '16px 18px', borderRadius: '14px', background: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        <div style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
          Localisation
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: '13px', color: colors.text, lineHeight: 1.6 }}>
          Paris · ESME Sudria<br />
          <span style={{ color: colors.textMuted, fontSize: '12px' }}>Mobilité France et international</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Contact() {
  const { scrollYProgress } = useScroll()
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])
  const narrow = useMediaQuery(NARROW)   // téléphone : une colonne

  return (
    <PageTransition>
      {/* Barre de lecture */}
      <motion.div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 100,
        background: colors.accent,
        scaleX: lineScale, transformOrigin: 'left',
      }} />

      <div style={{ paddingTop: '64px', background: colors.bg, minHeight: '100svh' }}>
        <div style={{ maxWidth: '1020px', margin: '0 auto', padding: '60px clamp(16px, 5vw, 48px) 100px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1.1fr', gap: narrow ? '40px' : '72px', alignItems: 'start' }}>
            <InfoPanel />
            <div style={{ paddingTop: narrow ? 0 : '80px' }}>
              <DirectContact />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
