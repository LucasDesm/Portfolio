import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { fonts } from '@/lib/tokens'

// Easter egg (Konami code ↑ ↑ ↓ ↓ ← → ← → B A, ou 5 taps sur le nom dans l'en-tête) :
// radiographie du site. Une barre de scanner balaie l'écran, la page passe en négatif,
// puis le « squelette » apparaît (contour de chaque élément) avec un compte rendu d'examen.

export const XRAY_EVENT = 'portfolio:xray'

const SEQUENCE = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']
const SCAN_S = 1.8      // durée du balayage
const FILM_MS = 9000    // durée d'affichage du cliché

// Négatif bleuté façon film radiographique, appliqué à ce qui est derrière le calque
const XRAY_FILTER = 'invert(1) grayscale(1) sepia(0.35) hue-rotate(175deg) contrast(1.2) brightness(0.95)'
const FILM_INK = '#a9c4df'

type Phase = 'off' | 'scan' | 'film'

export default function XRayEasterEgg() {
  const reduce = useReducedMotion()
  const { pathname } = useLocation()
  const [phase, setPhase] = useState<Phase>('off')
  const [elements, setElements] = useState(0)

  const start = useCallback(() => {
    setElements(document.querySelectorAll('#root *').length)
    setPhase(reduce ? 'film' : 'scan')
  }, [reduce])
  const stop = useCallback(() => setPhase('off'), [])

  // Clavier : Konami code, Échap pour quitter
  useEffect(() => {
    let i = 0
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === 'escape') { stop(); return }
      i = k === SEQUENCE[i] ? i + 1 : (k === SEQUENCE[0] ? 1 : 0)
      if (i === SEQUENCE.length) { i = 0; start() }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener(XRAY_EVENT, start)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener(XRAY_EVENT, start) }
  }, [start, stop])

  // Squelette (contours) pendant le cliché, puis fin automatique
  useEffect(() => {
    document.documentElement.classList.toggle('xray', phase === 'film')
    if (phase !== 'film') return
    const t = window.setTimeout(stop, FILM_MS)
    return () => window.clearTimeout(t)
  }, [phase, stop])

  // Indice pour qui ouvre la console
  useEffect(() => {
    console.info(
      '%cPsst… ↑ ↑ ↓ ↓ ← → ← → B A\n%cEt si le cœur vous en dit : /arythmie',
      `font: 600 13px ${fonts.mono}; color: #3f5f86`,
      `font: 12px ${fonts.mono}; color: #954130`,
    )
  }, [])

  return (
    <AnimatePresence>
      {phase !== 'off' && (
        <motion.div
          key="xray"
          className="xray-ui"
          role="dialog"
          aria-label="Radiographie du site. Échap pour quitter."
          onClick={stop}
          style={{ position: 'fixed', inset: 0, zIndex: 90, cursor: 'pointer' }}
        >
          {/* Zone déjà scannée : négatif radiographique */}
          <motion.div
            className="xray-ui"
            initial={{ height: reduce ? '100%' : '0%', opacity: 1 }}
            animate={{ height: '100%', opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25, delay: 0 } }}
            transition={{ height: { duration: SCAN_S, ease: [0.45, 0, 0.55, 1] }, opacity: { duration: 0.4 } }}
            onAnimationComplete={() => setPhase(p => (p === 'scan' ? 'film' : p))}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, backdropFilter: XRAY_FILTER, WebkitBackdropFilter: XRAY_FILTER }}
          />

          {/* Barre du scanner */}
          {phase === 'scan' && (
            <motion.div
              className="xray-ui"
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              transition={{ duration: SCAN_S, ease: [0.45, 0, 0.55, 1] }}
              style={{ position: 'absolute', left: 0, right: 0, height: 3, marginTop: -2, background: FILM_INK, boxShadow: `0 0 18px 6px ${FILM_INK}88, 0 0 60px 18px #6f9fc855` }}
            />
          )}

          {/* Vignettage du film */}
          <motion.div
            className="xray-ui"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'film' ? 1 : 0 }}
            exit={{ opacity: 0, transition: { duration: 0.25, delay: 0 } }}
            transition={{ duration: 0.6 }}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 55%, rgba(4, 10, 18, 0.55) 100%)' }}
          />

          {/* Repères de latéralité (droite du patient à gauche de l'image) */}
          {phase === 'film' && ['D', 'G'].map((m, i) => (
            <motion.span
              key={m}
              className="xray-ui"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.25, delay: 0 } }}
              transition={{ duration: 0.4, delay: 0.2 }}
              style={{ position: 'absolute', top: 'clamp(76px, 12vh, 110px)', [i ? 'right' : 'left']: 'clamp(16px, 4vw, 40px)', fontFamily: fonts.mono, fontSize: '28px', fontWeight: 700, color: FILM_INK, border: `2px solid ${FILM_INK}`, borderRadius: '6px', padding: '0 8px', lineHeight: 1.3 }}
            >
              {m}
            </motion.span>
          ))}

          {/* Compte rendu d'examen */}
          {phase === 'film' && (
            <motion.div
              className="xray-ui"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.25, delay: 0 } }}
              transition={{ duration: 0.45, delay: 0.3 }}
              style={{
                position: 'absolute', left: 'clamp(16px, 4vw, 40px)', bottom: 'clamp(16px, 4vw, 40px)', maxWidth: 'min(420px, calc(100% - 32px))',
                padding: '16px 20px', borderRadius: '12px', background: 'rgba(8, 19, 30, 0.88)', border: `1px solid ${FILM_INK}55`,
                fontFamily: fonts.mono, fontSize: '12px', lineHeight: 1.75, color: FILM_INK,
              }}
            >
              <div style={{ fontWeight: 700, letterSpacing: '0.14em', marginBottom: '6px' }}>RADIOGRAPHIE · PORTFOLIO</div>
              <div>Patient : Lucas Desmartin</div>
              <div>Région : {pathname}</div>
              <div>Éléments analysés : {elements.toLocaleString('fr-FR')}</div>
              <div>Ossature : React · TypeScript · Three.js</div>
              <div style={{ color: '#c4c99f', marginTop: '4px' }}>Conclusion : aucune anomalie détectée.</div>
              <div>
                Examen complémentaire :{' '}
                <Link to="/arythmie" style={{ color: FILM_INK, textDecoration: 'underline', textUnderlineOffset: '3px' }}>/arythmie</Link>
              </div>
              <div style={{ opacity: 0.7, marginTop: '8px', fontSize: '11px' }}>Échap ou clic pour quitter</div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
