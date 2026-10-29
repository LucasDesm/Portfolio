import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react'
import PageTransition from '@/components/PageTransition'
import { colors, fonts, ca } from '@/lib/tokens'

// Remplacer par votre ID Formspree — formspree.io/new
const FORMSPREE_URL = 'https://formspree.io/f/VOTRE_ID'
const DIRECT_EMAIL  = 'desmartinlucas2@gmail.com'

type Status = 'idle' | 'sending' | 'success' | 'error'

// ─── Checkmark animé ──────────────────────────────────────────────────────────

function CheckmarkAnimation() {
  return (
    <motion.svg
      width={64} height={64} viewBox="0 0 64 64" fill="none"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.circle
        cx={32} cy={32} r={30}
        stroke={colors.green} strokeWidth={2.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      />
      <motion.path
        d="M20 32 L29 41 L44 24"
        stroke={colors.green} strokeWidth={2.8}
        strokeLinecap="round" strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
      />
    </motion.svg>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <motion.svg
      width={20} height={20} viewBox="0 0 20 20"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <circle cx={10} cy={10} r={8} stroke="rgba(255,255,255,0.35)" strokeWidth={2.5} fill="none" />
      <path d="M10 2 A 8 8 0 0 1 18 10" stroke="white" strokeWidth={2.5} strokeLinecap="round" fill="none" />
    </motion.svg>
  )
}

// ─── Input stylisé ────────────────────────────────────────────────────────────

function FormInput({
  label, name, type = 'text', placeholder, required, value, onChange, error,
}: {
  label: string; name: string; type?: string; placeholder: string
  required?: boolean; value: string; onChange: (v: string) => void; error?: string
}) {
  const [focused, setFocused] = useState(false)
  const borderColor = error ? '#dc2626' : focused ? colors.accent : colors.border

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
        {label}{required && <span style={{ color: colors.accent }}> *</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          padding: '13px 16px',
          borderRadius: '10px',
          border: `1.5px solid ${borderColor}`,
          background: colors.bgCard,
          color: colors.text,
          fontFamily: fonts.body,
          fontSize: '14px',
          outline: 'none',
          transition: 'border-color 0.15s',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            style={{ fontFamily: fonts.body, fontSize: '11px', color: '#dc2626' }}
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
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

// ─── Formulaire ───────────────────────────────────────────────────────────────

function ContactForm() {
  const [status, setStatus]   = useState<Status>('idle')
  const [fields, setFields]   = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors]   = useState<Record<string, string>>({})

  const set = (key: string) => (v: string) => setFields(f => ({ ...f, [key]: v }))

  function validate() {
    const e: Record<string, string> = {}
    if (!fields.name.trim())                              e.name    = 'Nom requis'
    if (!fields.email.trim())                             e.email   = 'Email requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Email invalide'
    if (!fields.message.trim())                           e.message = 'Message requis'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStatus('sending')

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(fields),
      })
      if (res.ok) {
        setStatus('success')
        setFields({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '60px 40px', textAlign: 'center', background: colors.bgCard, borderRadius: '20px', border: `1px solid ${colors.border}`, minHeight: '340px' }}
      >
        <CheckmarkAnimation />
        <div>
          <h3 style={{ fontFamily: fonts.heading, fontSize: '26px', fontWeight: 400, color: colors.text, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Message envoyé !
          </h3>
          <p style={{ fontFamily: fonts.body, fontSize: '14px', color: colors.textMuted, margin: 0 }}>
            Je vous répondrai dans les plus brefs délais.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setStatus('idle')}
          style={{ fontFamily: fonts.body, fontSize: '13px', fontWeight: 600, color: colors.accent, background: colors.accentLight, border: `1px solid ${ca.accent(0.2)}`, padding: '9px 20px', borderRadius: '10px', cursor: 'pointer', marginTop: '8px' }}
        >
          Envoyer un autre message
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      style={{
        background: colors.bgCard, border: `1px solid ${colors.border}`,
        borderRadius: '20px', padding: '36px',
        boxShadow: `0 4px 24px ${ca.text(0.05)}`,
        display: 'flex', flexDirection: 'column', gap: '16px',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <FormInput label="Nom" name="name" placeholder="Votre nom" required value={fields.name} onChange={set('name')} error={errors.name} />
        <FormInput label="Email" name="email" type="email" placeholder="vous@email.com" required value={fields.email} onChange={set('email')} error={errors.email} />
      </div>
      <FormInput label="Objet" name="subject" placeholder="Objet du message" value={fields.subject} onChange={set('subject')} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
          Message <span style={{ color: colors.accent }}>*</span>
        </label>
        <textarea
          name="message"
          placeholder="Votre message..."
          rows={5}
          required
          value={fields.message}
          onChange={e => set('message')(e.target.value)}
          style={{
            padding: '13px 16px', borderRadius: '10px',
            border: `1.5px solid ${errors.message ? '#dc2626' : colors.border}`,
            background: colors.bgCard, color: colors.text,
            fontFamily: fonts.body, fontSize: '14px', outline: 'none',
            resize: 'vertical', transition: 'border-color 0.15s',
            width: '100%', boxSizing: 'border-box',
          }}
          onFocus={e => (e.target.style.borderColor = colors.accent)}
          onBlur={e => (e.target.style.borderColor = errors.message ? '#dc2626' : colors.border)}
        />
        <AnimatePresence>
          {errors.message && (
            <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ fontFamily: fonts.body, fontSize: '11px', color: '#dc2626' }}>
              {errors.message}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)', fontFamily: fonts.body, fontSize: '13px', color: '#dc2626' }}
        >
          Envoi échoué — contactez-moi directement à{' '}
          <a href={`mailto:${DIRECT_EMAIL}`} style={{ color: 'inherit', fontWeight: 700 }}>{DIRECT_EMAIL}</a>
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={status === 'sending'}
        whileHover={status !== 'sending' ? { scale: 1.015, boxShadow: `0 12px 36px ${ca.accent(0.3)}` } : {}}
        whileTap={status !== 'sending' ? { scale: 0.98 } : {}}
        style={{
          background: status === 'sending' ? ca.accent(0.7) : colors.accent,
          color: colors.bg, border: 'none',
          padding: '15px 28px', borderRadius: '12px',
          fontSize: '15px', fontFamily: fonts.body, fontWeight: 600,
          cursor: status === 'sending' ? 'not-allowed' : 'pointer',
          boxShadow: `0 4px 18px ${ca.accent(0.22)}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          transition: 'background 0.2s',
        }}
      >
        {status === 'sending' ? (
          <><Spinner /> Envoi en cours...</>
        ) : (
          'Envoyer le message →'
        )}
      </motion.button>
    </motion.form>
  )
}

// ─── Panel gauche ─────────────────────────────────────────────────────────────

function InfoPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}
    >
      {/* Badge disponible */}
      <motion.div
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 14px', borderRadius: '20px',
          background: colors.greenLight, border: `1px solid ${ca.green(0.25)}`,
          marginBottom: '28px',
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: colors.green, display: 'block' }} />
        <span style={{ fontFamily: fonts.body, fontSize: '12px', fontWeight: 700, color: colors.green }}>
          Disponible — PFE début 2027
        </span>
      </motion.div>

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
        style={{ fontFamily: fonts.body, fontSize: '15px', color: colors.textMuted, lineHeight: 1.8, margin: '0 0 40px' }}
      >
        PFE 6 mois · R&D biomédicale · Début 2027.<br />
        Medtech, imagerie, dispositifs médicaux, data santé.
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
        <ContactLink icon="in" label="LinkedIn" href="https://www.linkedin.com/in/lucas-desmartin" sublabel="linkedin.com/in/lucas-desmartin" />
        <div style={{ height: 1, background: colors.borderLight }} />
        <ContactLink icon="⌥" label="GitHub" href="https://github.com/LucasDesm" sublabel="github.com/LucasDesm" />
        <div style={{ height: 1, background: colors.borderLight }} />
        <ContactLink icon="↓" label="Télécharger le CV" href="/lucas-desmartin-cv.pdf" sublabel="CV Stage Ingénieur — PDF" />
      </motion.div>

      {/* Info disponibilité */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        style={{ marginTop: '32px', padding: '16px 18px', borderRadius: '12px', background: colors.bgSubtle, border: `1px solid ${colors.border}` }}
      >
        <div style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
          Localisation
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: '13px', color: colors.text, lineHeight: 1.6 }}>
          Paris — ESME Sudria<br />
          <span style={{ color: colors.textMuted, fontSize: '12px' }}>UTC+2 (Paris) · Mobilité France entière</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Contact() {
  const { scrollYProgress } = useScroll()
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <PageTransition>
      {/* Barre de lecture */}
      <motion.div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 100,
        background: `linear-gradient(to right, ${colors.accent}, ${colors.green})`,
        scaleX: lineScale, transformOrigin: 'left',
      }} />

      <div style={{ paddingTop: '64px', background: colors.bg, minHeight: '100svh' }}>
        <div style={{ maxWidth: '1020px', margin: '0 auto', padding: '60px 48px 100px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '72px', alignItems: 'start' }}>
            <InfoPanel />
            <div style={{ paddingTop: '80px' }}>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{ fontFamily: fonts.heading, fontSize: '22px', fontWeight: 400, color: colors.text, margin: '0 0 24px', letterSpacing: '-0.015em' }}
              >
                Envoyer un message
              </motion.h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
