import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import PageTransition from '@/components/PageTransition'
import { colors, fonts, ca } from '@/lib/tokens'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useMediaQuery, NARROW } from '@/hooks/useMediaQuery'

// 404 : un moniteur cardiaque dont le tracé écrit « 404 » puis tombe à plat.
// « Défibriller » charge, choque, rétablit le rythme et ramène à l'accueil.

const BASE = 100   // ligne de base du tracé (viewBox 600 × 130)

// Tracé : onde P, puis les battements dessinent 4, 0, 4
const TRACE_404 =
  `M0,${BASE} L56,${BASE} C64,${BASE} 68,90 74,90 C80,90 84,${BASE} 92,${BASE} L150,${BASE}` +
  // 4
  ` L150,20 L116,74 L164,74 L150,74 L150,${BASE} L238,${BASE}` +
  // 0
  ` A24 40 0 1 1 238,20 A24 40 0 1 1 238,${BASE} L330,${BASE}` +
  // 4
  ` L330,20 L296,74 L344,74 L330,74 L330,${BASE} L420,${BASE}`
const FLATLINE = `M420,${BASE} L600,${BASE}`

// Rythme rétabli : battements réguliers
const BEATS = (() => {
  let d = `M0,${BASE}`
  for (let x = 0; x < 600; x += 150) {
    d += ` L${x + 40},${BASE} C${x + 46},${BASE} ${x + 49},90 ${x + 54},90 C${x + 59},90 ${x + 62},${BASE} ${x + 68},${BASE}`
    d += ` L${x + 84},${BASE} L${x + 90},110 L${x + 98},38 L${x + 106},116 L${x + 112},${BASE}`
    d += ` L${x + 128},${BASE} C${x + 134},${BASE} ${x + 138},84 ${x + 144},84 C${x + 150},84 ${x + 152},${BASE} ${x + 150},${BASE}`
  }
  return d + ` L600,${BASE}`
})()

type Phase = 'lost' | 'charging' | 'shock' | 'restored'

export default function NotFound() {
  usePageTitle('Page introuvable')
  const reduce = useReducedMotion()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [phase, setPhase] = useState<Phase>('lost')
  // Le tracé est réduit de moitié sur téléphone : trait plus épais pour rester lisible
  const narrow = useMediaQuery(NARROW)
  const sw = narrow ? 5 : 3
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const later = (ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, ms)) }

  function defibrillate() {
    if (phase !== 'lost') return
    if (reduce) { navigate('/'); return }
    setPhase('charging')
    later(1100, () => setPhase('shock'))
    later(1500, () => setPhase('restored'))
    later(3300, () => navigate('/'))
  }

  const restored = phase === 'restored'
  const hr = restored ? '72' : '--'

  return (
    <PageTransition>
      {/* Flash du choc */}
      <AnimatePresence>
        {phase === 'shock' && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.4, times: [0, 0.15, 1] }}
            style={{ position: 'fixed', inset: 0, background: colors.bgCard, zIndex: 60, pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

      <div style={{ paddingTop: '64px', minHeight: '100svh', background: colors.bg, display: 'flex', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxWidth: '860px', margin: '0 auto', padding: 'clamp(40px, 8vh, 80px) clamp(16px, 5vw, 48px)' }}
        >
          <p style={{ fontFamily: fonts.mono, fontSize: '12px', color: colors.textLight, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 16px' }}>
            Erreur 404
          </p>
          <h1 style={{ fontFamily: fonts.heading, fontSize: 'clamp(44px, 7vw, 80px)', fontWeight: 400, color: colors.text, margin: '0 0 6px', letterSpacing: '-0.035em', lineHeight: 1.02 }}>
            {restored ? 'Rythme rétabli.' : 'Signal perdu.'}
          </h1>
          <p style={{ fontFamily: fonts.heading, fontSize: 'clamp(22px, 3.2vw, 32px)', fontWeight: 300, fontStyle: 'italic', color: colors.textMuted, margin: '0 0 32px', letterSpacing: '-0.02em' }}>
            {restored ? 'Retour à l\'accueil en cours…' : 'Aucun pouls détecté à cette adresse.'}
          </p>

          {/* ── Moniteur ── */}
          <motion.div
            animate={phase === 'shock' ? { x: [0, -10, 9, -7, 5, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '20px', overflow: 'hidden', boxShadow: `0 4px 24px ${ca.text(0.05)}` }}
          >
            {/* En-tête : patient = adresse demandée */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '12px 18px', borderBottom: `1px solid ${colors.borderLight}`, fontFamily: fonts.mono, fontSize: '11px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, color: colors.textMuted }}>
                <motion.span
                  animate={reduce || restored ? undefined : { opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: restored ? colors.olive : colors.rust, flexShrink: 0 }}
                />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  PATIENT · {pathname}
                </span>
              </span>
              <span style={{ color: restored ? colors.olive : colors.rust, fontWeight: 700, whiteSpace: 'nowrap' }}>
                FC {hr} bpm
              </span>
            </div>

            {/* Tracé */}
            <div style={{ position: 'relative', padding: '18px 18px 8px' }}>
              <svg viewBox="0 0 600 130" width="100%" role="img" aria-label={restored ? 'Tracé cardiaque régulier' : 'Tracé cardiaque qui écrit 404 puis devient plat'} style={{ display: 'block', overflow: 'visible' }}>
                {/* Grille du papier ECG */}
                {Array.from({ length: 13 }, (_, i) => (
                  <line key={`v${i}`} x1={i * 50} x2={i * 50} y1={0} y2={130} stroke={colors.borderLight} strokeWidth={0.6} />
                ))}
                {Array.from({ length: 4 }, (_, i) => (
                  <line key={`h${i}`} x1={0} x2={600} y1={10 + i * 40} y2={10 + i * 40} stroke={colors.borderLight} strokeWidth={0.6} />
                ))}

                {restored ? (
                  <>
                    <path d={BEATS} fill="none" stroke={colors.olive} strokeWidth={1.5} opacity={0.25} />
                    <motion.path
                      d={BEATS} fill="none" stroke={colors.olive} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.6, ease: 'linear' }}
                    />
                  </>
                ) : (
                  <>
                    <motion.path
                      d={TRACE_404} fill="none" stroke={colors.accent} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: reduce ? 1 : 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2.6, ease: 'linear', delay: 0.4 }}
                    />
                    <motion.path
                      d={FLATLINE} fill="none" stroke={colors.rust} strokeWidth={sw} strokeLinecap="round"
                      initial={{ pathLength: reduce ? 1 : 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.9, ease: 'linear', delay: 3.0 }}
                    />
                  </>
                )}
              </svg>
              {!restored && (
                <motion.span
                  aria-hidden
                  initial={{ opacity: reduce ? 1 : 0 }}
                  animate={reduce ? { opacity: 1 } : { opacity: [0, 1, 0.25, 1] }}
                  transition={reduce ? undefined : { delay: 3.6, duration: 1.4, repeat: Infinity, repeatType: 'reverse' }}
                  style={{ position: 'absolute', right: 'calc(18px + 15%)', top: '42%', transform: 'translateX(50%)', fontFamily: fonts.mono, fontSize: 'clamp(11px, 1.6vw, 14px)', fontWeight: 700, color: colors.rust, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}
                >
                  SIGNAL PERDU
                </motion.span>
              )}
            </div>

            {/* Diagnostic */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '6px 16px', padding: '10px 18px 14px', fontFamily: fonts.mono, fontSize: '11px', color: colors.textMuted }}>
              <span>Diagnostic : {restored ? 'rythme sinusal' : 'erreur 404'}</span>
              <span>confiance {restored ? '100' : '99,7'} %</span>
            </div>

            {/* Indice caché : le Konami code (radiographie du site), révélé à qui attend */}
            {!restored && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduce ? 0 : 6, duration: 1.2 }}
                style={{ padding: '0 18px 14px', fontFamily: fonts.mono, fontSize: '11px', color: colors.textLight }}
              >
                Traitement conseillé : {narrow ? '5 taps rapides sur « Lucas Desmartin »' : '↑ ↑ ↓ ↓ ← → ← → B A'}
              </motion.div>
            )}

            {/* Charge du défibrillateur */}
            <AnimatePresence>
              {phase === 'charging' && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ padding: '0 18px 16px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.mono, fontSize: '11px', color: colors.rust, marginBottom: '6px' }}>
                    <span>Charge du défibrillateur…</span>
                    <span>200 J</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: colors.borderLight, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, ease: 'easeIn' }}
                      style={{ height: '100%', background: colors.rust, originX: 0 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <p style={{ fontFamily: fonts.body, fontSize: '15px', lineHeight: 1.75, color: colors.textMuted, margin: '28px 0 28px', maxWidth: '560px' }}>
            Cette adresse n'existe pas ou a été déplacée. On tente une réanimation ?
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <motion.button
              type="button"
              onClick={defibrillate}
              disabled={phase !== 'lost'}
              whileHover={phase === 'lost' ? { scale: 1.04 } : undefined}
              whileTap={phase === 'lost' ? { scale: 0.96 } : undefined}
              style={{ background: colors.rust, color: colors.bg, border: 'none', padding: '14px 28px', borderRadius: '14px', fontFamily: fonts.body, fontSize: '15px', fontWeight: 600, cursor: phase === 'lost' ? 'pointer' : 'default', opacity: phase === 'lost' ? 1 : 0.6, boxShadow: `0 6px 24px ${colors.rust}38` }}
            >
              ⚡ Défibriller
            </motion.button>
            <Link to="/" style={{ textDecoration: 'none', color: colors.text, border: `1.5px solid ${colors.border}`, padding: '14px 28px', borderRadius: '14px', fontFamily: fonts.body, fontSize: '15px', fontWeight: 600 }}>
              Retour à l'accueil
            </Link>
            <Link to="/projets" style={{ textDecoration: 'none', color: colors.textMuted, padding: '14px 8px', fontFamily: fonts.body, fontSize: '15px', fontWeight: 600 }}>
              Voir les projets →
            </Link>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
