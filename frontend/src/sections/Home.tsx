import { useRef, useEffect, useState, useCallback, lazy, Suspense } from 'react'
import { Link } from 'react-router'
import {
  motion, useScroll, useTransform, useSpring,
  useMotionValue, useMotionValueEvent, AnimatePresence,
  useReducedMotion, type MotionValue,
} from 'motion/react'
import { animate, stagger } from 'animejs'
import PageTransition from '@/components/PageTransition'
import AnimeCharReveal from '@/components/AnimeCharReveal'
import { useAnimeCounter } from '@/hooks/useAnimeCounter'
import { colors, ca, fonts } from '@/lib/tokens'
import { useParcours } from '@/hooks/useParcours'
import { useProjects } from '@/hooks/useProjects'
import type { Project } from '@/lib/data'

// ─── Lazy 3D renders (chargés uniquement quand la carte est active) ────────────
const HandOnlyLazy       = lazy(() => import('@/three/HandCanvas').then(m => ({ default: m.HandCanvasOnly })))
const CTScanCanvasLazy   = lazy(() => import('@/three/CTScanCanvas'))
const GlycemieCanvasLazy = lazy(() => import('@/three/GlycemieCanvas'))
const EthylCanvasLazy    = lazy(() => import('@/three/EthylCanvas'))
const AnemCanvasLazy     = lazy(() => import('@/three/AnemCanvas'))

// Adds alpha — handles both hex (#rrggbb) and oklch/rgb functions
const ao = (c: string, a: number) => {
  if (c.startsWith('#')) {
    const r = parseInt(c.slice(1, 3), 16)
    const g = parseInt(c.slice(3, 5), 16)
    const b = parseInt(c.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${a})`
  }
  return c.endsWith(')') ? `${c.slice(0, -1)} / ${a})` : c
}

// ─── ScrambleTitle ────────────────────────────────────────────────────────────

function ScrambleTitle({ text }: { text: string }) {
  const shouldReduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [output, setOutput] = useState(text)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    if (shouldReduce) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTriggered(true) },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [shouldReduce])

  useEffect(() => {
    if (!triggered || shouldReduce) return
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZαβγδ0123'
    let frame = 0
    const total = Math.ceil(text.length * 2.8)
    const id = setInterval(() => {
      setOutput(text.split('').map((char, i) => {
        if (char === ' ') return ' '
        if (frame > i * 2) return char
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      }).join(''))
      frame++
      if (frame > total) { setOutput(text); clearInterval(id) }
    }, 38)
    return () => clearInterval(id)
  }, [triggered, text, shouldReduce])

  return <span ref={ref}>{output}</span>
}

// ─── Marquee ──────────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  'Instrumentation', '·', 'Machine Learning', '·', 'Deep Learning', '·',
  'Robotique chirurgicale', '·', 'Dispositifs médicaux', '·', 'IoT médical', '·',
  'Métrologie', '·', 'Data santé', '·', 'Biotech', '·', 'ESME Paris', '·',
]

function Marquee({ reversed = false }: { reversed?: boolean }) {
  const shouldReduce = useReducedMotion()
  const items = shouldReduce ? MARQUEE_ITEMS : [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div style={{ overflow: 'hidden', display: 'flex', gap: '24px' }}>
      <motion.div
        animate={shouldReduce ? {} : { x: reversed ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: '24px', whiteSpace: 'nowrap', flexShrink: 0 }}
      >
        {items.map((item, i) => (
          <span key={i} style={{
            fontFamily: fonts.body,
            fontSize: item === '·' ? '10px' : '12px',
            fontWeight: item === '·' ? 400 : 600,
            color: item === '·' ? colors.border : colors.textLight,
            letterSpacing: item === '·' ? 0 : '0.08em',
            textTransform: 'uppercase',
            verticalAlign: 'middle',
          }}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── ECGDivider ───────────────────────────────────────────────────────────────

const ECG_PATH = (() => {
  const b = 42
  const cw = 360
  let p = `M0,${b}`
  for (let c = 0; c < 4; c++) {
    const x = c * cw
    p += ` L${x + 60},${b}`
    p += ` C${x + 68},${b} ${x + 72},28 ${x + 78},28`
    p += ` C${x + 84},28 ${x + 89},${b} ${x + 95},${b}`
    p += ` L${x + 148},${b}`
    p += ` L${x + 156},57`
    p += ` L${x + 165},4`
    p += ` L${x + 174},63`
    p += ` L${x + 183},${b}`
    p += ` L${x + 228},${b}`
    p += ` C${x + 240},${b} ${x + 248},22 ${x + 260},22`
    p += ` C${x + 272},22 ${x + 279},${b} ${x + 291},${b}`
    p += ` L${x + cw},${b}`
  }
  return p
})()

function ECGDivider() {
  const shouldReduce = useReducedMotion()
  return (
    <div style={{ position: 'relative', height: '100px', overflow: 'hidden' }}>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', width: '100%', height: '80px', pointerEvents: 'none' }}
      >
        <path d={ECG_PATH} stroke={colors.accent} strokeWidth="0.8" fill="none" opacity={shouldReduce ? 0.3 : 0.12} />
        {!shouldReduce && <>
          <motion.path
            d={ECG_PATH} stroke={colors.accent} strokeWidth="10" fill="none" strokeLinecap="round"
            initial={{ pathLength: 0.06, pathOffset: 0 }}
            animate={{ pathOffset: [0, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 0.8 }}
            opacity={0.10}
          />
          <motion.path
            d={ECG_PATH} stroke={colors.accent} strokeWidth="2" fill="none" strokeLinecap="round"
            initial={{ pathLength: 0.10, pathOffset: 0 }}
            animate={{ pathOffset: [0, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 0.8 }}
            opacity={0.55}
          />
          <motion.path
            d={ECG_PATH} stroke={colors.bgCard} strokeWidth="2.5" fill="none" strokeLinecap="round"
            initial={{ pathLength: 0.012, pathOffset: 0.09 }}
            animate={{ pathOffset: [0.09, 1.09] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 0.8 }}
            opacity={0.80}
          />
        </>}
      </svg>
    </div>
  )
}

// ─── HeroParticleBurst ────────────────────────────────────────────────────────

function HeroParticleBurst() {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (shouldReduce || !ref.current) return
    const dots = ref.current.querySelectorAll<HTMLElement>('.hpb')

    animate(dots, {
      translateX: (_: HTMLElement, i: number) => {
        const angle = (i / dots.length) * Math.PI * 2
        return Math.cos(angle) * (140 + (i % 4) * 55)
      },
      translateY: (_: HTMLElement, i: number) => {
        const angle = (i / dots.length) * Math.PI * 2
        return Math.sin(angle) * (90 + (i % 3) * 50)
      },
      opacity: [{ to: 0.85, duration: 200 }, { to: 0, duration: 1200 }],
      scale:   [{ to: 2.2,  duration: 300 }, { to: 0.1, duration: 1100 }],
      ease: 'outExpo',
      delay: stagger(22, { start: 550 }),
    })
  }, [shouldReduce])

  const BURST_COLORS = [
    colors.accent, colors.green, '#8b5cf6', '#d97706',
    colors.accent, colors.accent, colors.green, '#8b5cf6',
  ]

  return (
    <div ref={ref} style={{ position: 'absolute', top: '44%', left: '12%', width: 0, height: 0, pointerEvents: 'none', zIndex: 3 }}>
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} className="hpb" style={{
          position: 'absolute',
          width:  i % 4 === 0 ? 8 : i % 4 === 1 ? 5 : i % 4 === 2 ? 4 : 3,
          height: i % 4 === 0 ? 8 : i % 4 === 1 ? 5 : i % 4 === 2 ? 4 : 3,
          borderRadius: '50%',
          background: BURST_COLORS[i % BURST_COLORS.length],
          opacity: 0,
          top: 0, left: 0,
          marginTop: '-4px', marginLeft: '-4px',
        }} />
      ))}
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const PARTICLES = [
  { id: 0,  x: 8,  y: 22, dx: 25,  dy: -18, size: 2.5, dur: 13, delay: 0,   op: 0.22 },
  { id: 1,  x: 18, y: 65, dx: -20, dy: 28,  size: 1.8, dur: 17, delay: 2,   op: 0.15 },
  { id: 2,  x: 72, y: 14, dx: 18,  dy: 22,  size: 2.2, dur: 15, delay: 5,   op: 0.18 },
  { id: 3,  x: 88, y: 54, dx: -28, dy: -14, size: 3.0, dur: 11, delay: 1,   op: 0.24 },
  { id: 4,  x: 35, y: 88, dx: 22,  dy: -25, size: 2.0, dur: 19, delay: 7,   op: 0.16 },
  { id: 5,  x: 62, y: 38, dx: -15, dy: 20,  size: 2.8, dur: 14, delay: 3,   op: 0.13 },
  { id: 6,  x: 45, y: 10, dx: 30,  dy: 15,  size: 1.5, dur: 22, delay: 9,   op: 0.20 },
  { id: 7,  x: 78, y: 76, dx: -22, dy: -20, size: 2.3, dur: 16, delay: 4,   op: 0.18 },
  { id: 8,  x: 22, y: 44, dx: 18,  dy: 24,  size: 1.7, dur: 12, delay: 6,   op: 0.14 },
  { id: 9,  x: 55, y: 92, dx: -18, dy: -22, size: 2.6, dur: 18, delay: 0.5, op: 0.22 },
  { id: 10, x: 91, y: 30, dx: -30, dy: 18,  size: 2.0, dur: 20, delay: 8,   op: 0.14 },
  { id: 11, x: 12, y: 82, dx: 24,  dy: -20, size: 3.2, dur: 10, delay: 3.5, op: 0.17 },
]

type OrbDef = {
  bg: string; size: number; dx: number; dy: number; dur: number; delay?: number
  top?: string; bottom?: string; left?: string; right?: string
}

function RotatingBadge() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      style={{ width: 130, height: 130 }}
    >
      <svg viewBox="0 0 130 130" width="130" height="130">
        <defs>
          <path id="cp" d="M 65,65 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
        </defs>
        <text style={{ fontSize: '8.5px', letterSpacing: '0.18em' }} fill={colors.textLight} fontFamily={fonts.mono}>
          <textPath href="#cp">INGÉNIEUR BIOMÉDICAL · ESME · PROMO 2027 · </textPath>
        </text>
        <circle cx="65" cy="65" r="3.5" fill={colors.accent} />
      </svg>
    </motion.div>
  )
}

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const fadeOut = useTransform(scrollYProgress, [0, 0.55], [1, 0])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const sx = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const sy = useSpring(mouseY, { stiffness: 50, damping: 20 })
  const spotX = useTransform(sx, v => `${v}px`)
  const spotY = useTransform(sy, v => `${v}px`)

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (shouldReduce) return
    mouseX.set(e.clientX); mouseY.set(e.clientY)
  }, [mouseX, mouseY, shouldReduce])

  const ORBS: OrbDef[] = [
    { bg: ca.accent(0.13), size: 800, top: '-220px', right: '-180px', dx: 40,  dy: -30, dur: 16 },
    { bg: ca.green(0.10),  size: 650, bottom: '-180px', left: '-220px', dx: -25, dy: 35, dur: 20, delay: 3 },
    { bg: ca.accent(0.06), size: 500, top: '20%', left: '30%',          dx: 20,  dy: 20, dur: 25, delay: 7 },
    { bg: ca.green(0.07),  size: 350, bottom: '15%', right: '20%',      dx: -15, dy: -20, dur: 18, delay: 4 },
  ]

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouse}
      style={{ minHeight: '100svh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', background: colors.bg }}
    >
      {/* Cursor spotlight */}
      {!shouldReduce && (
        <motion.div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1,
          background: `radial-gradient(600px circle at ${spotX} ${spotY}, ${ca.accent(0.09)} 0%, transparent 60%)`,
        }} />
      )}

      {/* Particules */}
      {!shouldReduce && PARTICLES.map(p => (
        <motion.div key={p.id}
          initial={{ opacity: 0 }}
          animate={{ x: [0, p.dx, 0], y: [0, p.dy, 0], opacity: [p.op * 0.3, p.op, p.op * 0.3] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: colors.accent }}
        />
      ))}

      {/* Burst de particules au chargement */}
      {!shouldReduce && <HeroParticleBurst />}

      {/* Orbes */}
      {!shouldReduce && ORBS.map((o, i) => (
        <motion.div key={i}
          animate={{ x: [0, o.dx, 0], y: [0, o.dy, 0] }}
          transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut', delay: o.delay ?? 0 }}
          style={{
            position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
            width: o.size, height: o.size,
            background: `radial-gradient(circle, ${o.bg} 0%, transparent 65%)`,
            filter: 'blur(65px)',
            top: o.top, bottom: o.bottom, left: o.left, right: o.right,
          }}
        />
      ))}

      {/* Contenu — CENTERED */}
      <motion.div style={{ y, opacity: fadeOut, width: '100%', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 80px 0', textAlign: 'center' }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: colors.accentLight, color: colors.accent, padding: '7px 16px', borderRadius: '20px', marginBottom: '44px', fontSize: '12px', fontFamily: fonts.body, fontWeight: 600, border: `1px solid ${ca.accent(0.2)}`, letterSpacing: '0.04em' }}
          >
            <motion.span
              animate={shouldReduce ? {} : { opacity: [1, 0.2, 1], scale: [1, 0.8, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: colors.accent, display: 'inline-block' }}
            />
            Disponible · PFE Ingénieur · Début 2027
          </motion.div>

          {/* Titre — char-by-char spring reveal via anime.js */}
          <h1 style={{ fontFamily: fonts.heading, margin: '0 0 28px', fontSize: 'clamp(56px, 9.5vw, 116px)', lineHeight: 1.0, letterSpacing: '-0.04em' }}>
            <div style={{ display: 'block', fontWeight: 500,fontSize: 'clamp(56px, 9.5vw, 116px)',lineHeight: 0.95,letterSpacing: '-0.04em', color: colors.accent }}>
              <AnimeCharReveal
                text="Du capteur"
                delay={120}
                staggerMs={30}
                springParams={{ mass: 0.8, stiffness: 100, damping: 12 }}
              />
            </div>
            <div style={{ display: 'block',marginTop: '0.08em', 
                          fontFamily: '"Cormorant Garamond", "Playfair Display", serif', 
                          fontWeight: 400,
                          fontSize: 'clamp(3.2rem, 6.8vw, 6.4rem)',
                          fontStyle: 'italic',
                          lineHeight: 1,
                          letterSpacing: '0.04em', color: colors.text }}>
              <AnimeCharReveal
                text="au modèle."
                delay={450}
                staggerMs={28}
                springParams={{ mass: 0.8, stiffness: 85, damping: 14 }}
              />
            </div>
          </h1>

          {/* Sous-titre */}
          <div style={{ overflow: 'hidden', marginBottom: '52px' }}>
            <motion.p
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1], delay: 0.68 }}
              style={{ fontFamily: fonts.body, fontSize: 'clamp(16px, 1.8vw, 19px)', lineHeight: 1.75, color: colors.textMuted, margin: '0 auto', maxWidth: '520px' }}
            >
              Instrumentation · Machine Learning · Dispositifs médicaux.<br />
              Je construis des systèmes qui mesurent le vivant et le comprennent.
            </motion.p>
          </div>

          {/* CTAs — LEFT ALIGNED */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1], delay: 0.88}}
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/projets" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: `0 14px 44px ${ca.accent(0.32)}` }}
                whileTap={{ scale: 0.97 }}
                style={{ background: colors.accent, color: colors.bg, border: 'none', padding: '16px 34px', borderRadius: '14px', fontSize: '15px', fontFamily: fonts.body, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: `0 6px 24px ${ca.accent(0.22)}` }}
              >
                Voir mes projets
                <motion.span
                  animate={shouldReduce ? {} : { x: [0, 5, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                >→</motion.span>
              </motion.button>
            </Link>
            <Link to="/parcours" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.04, background: colors.borderLight }}
                whileTap={{ scale: 0.97 }}
                style={{ background: 'transparent', color: colors.text, border: `1.5px solid ${colors.border}`, padding: '16px 34px', borderRadius: '14px', fontSize: '15px', fontFamily: fonts.body, fontWeight: 600, cursor: 'pointer' }}
              >
                Mon parcours
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Badge rotatif */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        style={{ position: 'absolute', bottom: '48px', right: '48px', zIndex: 2 }}
      >
        <RotatingBadge />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.28, duration: 0.8 }}
        style={{ position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}
      >
        <span style={{ fontSize: '10px', fontFamily: fonts.body, color: colors.textLight, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Scroll</span>
        <motion.div
          animate={shouldReduce ? {} : { scaleY: [1, 0.25, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 50, background: `linear-gradient(to bottom, ${colors.accent}, transparent)`, transformOrigin: 'top' }}
        />
      </motion.div>
    </section>
  )
}

// ─── MarqueeStrip ─────────────────────────────────────────────────────────────

function MarqueeStrip() {
  return (
    <div style={{ borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}`, padding: '16px 0', overflow: 'hidden', background: colors.bg }}>
      <Marquee />
    </div>
  )
}

const MARQUEE_TECH = [
  'Python', '·', 'PyTorch', '·', 'React', '·', 'TypeScript', '·', 'Arduino', '·', 'SolidWorks', '·',
  'MATLAB', '·', 'Simulink', '·', 'Java', '·', 'Rust', '·', 'Solidity', '·', 'Three.js', '·',
]

function MarqueeStripReversed() {
  const shouldReduce = useReducedMotion()
  const items = shouldReduce ? MARQUEE_TECH : [...MARQUEE_TECH, ...MARQUEE_TECH]
  return (
    <div style={{ borderBottom: `1px solid ${colors.border}`, padding: '16px 0', overflow: 'hidden', background: colors.bg }}>
      <motion.div
        animate={shouldReduce ? {} : { x: ['-50%', '0%'] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: '24px', whiteSpace: 'nowrap', flexShrink: 0 }}
      >
        {items.map((item, i) => (
          <span key={i} style={{
            fontFamily: fonts.body,
            fontSize: item === '·' ? '10px' : '12px',
            fontWeight: item === '·' ? 400 : 600,
            color: item === '·' ? colors.border : colors.accent,
            letterSpacing: item === '·' ? 0 : '0.08em',
            textTransform: 'uppercase',
            opacity: item === '·' ? 1 : 0.65,
          }}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Qui je suis ─────────────────────────────────────────────────────────────

const SCHOOL_LOGOS = [
  { name: 'IUT Bordeaux',     short: 'IUT',  sub: 'BUT Mesures Physiques', color: colors.accent,            logo: '/logos/mesures-physiques.png' },
  { name: 'DU Santé & Tech',  short: 'DU',   sub: 'Technologie & Santé',   color: colors.green,             logo: '/logos/iut-bordeaux.png' },
  { name: 'Quantum Surgical', short: 'QS',   sub: 'Stage · Robotique',     color: 'oklch(60% 0.22 300)',    logo: '/logos/quantum-surgical.png' },
  { name: 'ESME',             short: 'ESME', sub: 'Biotech & Numérique',   color: 'oklch(65% 0.17 65)',     logo: '/logos/esme.png' },
  { name: 'KNU Corée',        short: 'KNU',  sub: 'Daegu · S3 ESME',       color: 'oklch(55% 0.23 25)',     logo: '/logos/knu.png' },
]

function QuiJeSuis() {
  return (
    <section style={{ padding: '140px 40px 100px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
        >
          <p style={{ fontFamily: fonts.heading, fontSize: 'clamp(22px, 2.6vw, 30px)', fontWeight: 400, lineHeight: 1.6, color: colors.text, margin: '0 0 22px', letterSpacing: '-0.01em' }}>
            Je m'appelle Lucas Desmartin, ingénieur biomédical en formation à l'ESME Paris, spécialisé en biotechnologies et numérique.
          </p>
          <p style={{ fontFamily: fonts.body, fontSize: '17px', lineHeight: 1.85, color: colors.textMuted, margin: '0 0 16px' }}>
            Mon parcours part de la mesure physique — capteurs, instrumentation, métrologie — pour rejoindre le machine learning et les systèmes médicaux embarqués. Robotique chirurgicale chez Quantum Surgical, régulation glycémique par correcteur PID, deep learning pour la détection du cancer du poumon.
          </p>
          <p style={{ fontFamily: fonts.body, fontSize: '17px', lineHeight: 1.85, color: colors.textMuted, margin: 0 }}>
            Je cherche un <strong style={{ color: colors.accent, fontWeight: 600 }}>PFE de 6 mois début 2027</strong> en R&D biomédicale.
          </p>
        </motion.div>

        {/* Logos — LEFT ALIGNED */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-start', marginTop: '56px' }}>
          {SCHOOL_LOGOS.map((school, i) => (
            <motion.div key={school.name}
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
              whileHover={{ y: -6, boxShadow: `0 16px 40px ${ao(school.color, 0.14)}` }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderRadius: '14px', background: colors.bgCardHome, border: `1px solid ${colors.border}`, cursor: 'default', boxShadow: `0 2px 8px ${ca.text(0.04)}` }}
            >
              <div style={{ width: 44, height: 44, borderRadius: '10px', background: colors.bgCardHome, border: `1px solid ${ao(school.color, 0.13)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '5px', flexShrink: 0 }}>
                {school.logo ? (
                  <img
                    src={school.logo}
                    alt={school.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      const t = e.currentTarget
                      t.style.display = 'none'
                      const fallback = t.parentElement?.querySelector('.logo-fallback') as HTMLElement
                      if (fallback) fallback.style.display = 'flex'
                    }}
                  />
                ) : null}
                <span className="logo-fallback" style={{ display: school.logo ? 'none' : 'flex', fontFamily: fonts.body, fontWeight: 800, fontSize: '10px', color: school.color, alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                  {school.short}
                </span>
              </div>
              <div>
                <div style={{ fontFamily: fonts.body, fontSize: '12px', fontWeight: 600, color: colors.text }}>{school.name}</div>
                <div style={{ fontFamily: fonts.body, fontSize: '11px', color: colors.textMuted }}>{school.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── DataStrip ────────────────────────────────────────────────────────────────

function DataStrip() {
  // anime.js v4 — spring elastic : léger overshoot avant de se stabiliser
  const c0 = useAnimeCounter(87.6, { decimals: 1, duration: 1760 })
  const c1 = useAnimeCounter(16,   { duration: 1280 })
  const c2 = useAnimeCounter(222,  { duration: 1920 })
  const c3 = useAnimeCounter(3,    { duration: 960 })

  const metrics = [
    { counter: c0, format: () => c0.val.toFixed(1) + ' %', label: 'accuracy',         sub: 'CT-scan cancer',         prominent: true  },
    { counter: c1, format: () => c1.val + ' sem.',          label: 'Quantum Surgical', sub: 'robotique chirurgicale', prominent: false },
    { counter: c2, format: () => String(c2.val),            label: 'simulations',      sub: 'régulation glycémie T1', prominent: false },
    { counter: c3, format: () => String(c3.val),            label: 'formations',       sub: 'BUT · DU · ESME',        prominent: false },
  ]

  return (
    <section style={{ padding: '0 40px 120px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap' }}
      >
        {metrics.map((m, i) => (
          <div
            key={m.label}
            ref={m.counter.ref}
            style={{
              flex: m.prominent ? '1.4 1 180px' : '1 1 130px',
              padding: '0 28px',
              borderRight: i < metrics.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
            }}
          >
            <div style={{
              fontFamily: fonts.heading,
              fontSize: m.prominent ? 'clamp(40px, 4.8vw, 58px)' : 'clamp(26px, 3vw, 40px)',
              fontWeight: 400,
              color: m.prominent ? colors.accent : colors.text,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              marginBottom: '8px',
            }}>
              {m.format()}
            </div>
            <div style={{ fontFamily: fonts.mono, fontSize: '10px', fontWeight: 600, color: colors.textLight, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>
              {m.label}
            </div>
            <div style={{ fontFamily: fonts.body, fontSize: '12px', color: colors.textMuted }}>
              {m.sub}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}

// ─── Carousel3D ───────────────────────────────────────────────────────────────

const TYPE_COLOR: Record<string, string> = {
  formation: colors.accent,
  stage:     '#954130',
  echange:   '#3b0014',
  cible:     colors.textLight,
}
const TYPE_LABEL: Record<string, string> = {
  formation: 'Formation', stage: 'Stage', echange: 'Séjour international', cible: 'Prochain objectif',
}

type ParcoursStep = { id: string; title: string; institution: string; period: string; type: string; location?: string }

const CAROUSEL_LOGOS: Record<string, string> = {
  'but':           '/logos/mesures-physiques.png',
  'du-sante':      '/logos/iut-bordeaux.png',
  'stage-excell':  '/logos/logo_excell.png',
  'stage-quantum': '/logos/quantum-surgical.png',
  'esme':          '/logos/Esme-sudria-logo.png',
  'coree':         '/logos/knu.png',
}

function CarouselCard({
  step, index, active, anglePerItem, RADIUS, rotY, N,
}: {
  step: ParcoursStep
  index: number
  active: number
  anglePerItem: number
  RADIUS: number
  rotY: MotionValue<number>
  N: number
}) {
  const baseAngle = index * anglePerItem
  const color = TYPE_COLOR[step.type]
  const dist = Math.min(Math.abs(index - active), N - Math.abs(index - active))
  const isActive = dist === 0
  const isNear = dist === 1

  // Each card independently computes its world-space transform — no preserve-3d cascade needed
  const cardTransform = useTransform(rotY, v => {
    const world = baseAngle + v
    return `rotateY(${world}deg) translateZ(${RADIUS}px) rotateY(${-world}deg)`
  })

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: '420px',
        marginLeft: '-210px',
        marginTop: '-200px',
        transform: cardTransform,
        zIndex: isActive ? N + 1 : N - dist,
      }}
    >
      <motion.div
        animate={{
          opacity: isActive ? 1 : isNear ? 0.52 : 0.20,
          scale:   isActive ? 1 : isNear ? 0.84 : 0.64,
          filter:  isActive ? 'blur(0px)' : isNear ? 'blur(1.5px)' : 'blur(4px)',
        }}
        transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Carte 100% visuelle — pas de section texte séparée */}
        <div style={{
          height: '400px',
          background: colors.bgCardHome,
          border: `1.5px solid ${isActive ? color : colors.borderLight}`,
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isActive
            ? `0 32px 80px ${ao(color, 0.26)}, 0 4px 16px ${ao(color, 0.12)}`
            : `0 2px 8px ${ao(colors.text, 0.04)}`,
          transition: 'box-shadow 0.55s, border-color 0.55s',
        }}>
          {CAROUSEL_LOGOS[step.id] ? (
            <img
              src={CAROUSEL_LOGOS[step.id]}
              alt={step.institution}
              style={{ position: 'absolute', top: '36px', left: '52px', right: '52px', bottom: '130px', width: 'calc(100% - 104px)', height: 'calc(100% - 166px)', objectFit: 'contain' }}
            />
          ) : (
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: ao(color, 0.14), border: `2px solid ${ao(color, 0.45)}` }} />
          )}

          {/* Badge type — haut gauche */}
          <span style={{ position: 'absolute', top: 16, left: 18, fontFamily: fonts.mono, fontSize: '12px', fontWeight: 700, color: color, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.90 }}>
            {TYPE_LABEL[step.type]}
          </span>

          {/* Overlay bas — titre + institution + période */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: `linear-gradient(to top, ${ao(colors.bg, 0.97)} 0%, ${ao(colors.bg, 0.75)} 55%, transparent 100%)`,
            padding: '60px 22px 22px',
          }}>
            <div style={{ fontFamily: fonts.heading, fontSize: '22px', fontWeight: 400, color: colors.text, lineHeight: 1.25, letterSpacing: '-0.01em', marginBottom: '6px' }}>
              {step.title}
            </div>
            <div style={{ fontFamily: fonts.body, fontSize: '15px', color: color, fontWeight: 600, marginBottom: '5px' }}>
              {step.institution}
            </div>
            <div style={{ fontFamily: fonts.mono, fontSize: '12px', color: colors.textLight, letterSpacing: '0.05em' }}>
              {step.period}{step.location ? ` · ${step.location}` : ''}
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  )
}

function Carousel3D() {
  const { data: steps } = useParcours()
  const N = steps.length
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  const anglePerItem = 360 / N
  const RADIUS = Math.max(660, N * 105)

  const rawRotY = useTransform(scrollYProgress, [0, 1], [0, -(N - 1) * anglePerItem])
  const rotY = useSpring(rawRotY, { stiffness: 55, damping: 22 })

  useMotionValueEvent(scrollYProgress, 'change', v => {
    setActive(Math.min(Math.round(v * (N - 1)), N - 1))
  })

  const step = steps[active] as ParcoursStep
  const accent = TYPE_COLOR[step.type]

  const header = (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 40px 60px', textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.48 }}>
        <h2 style={{ fontFamily: fonts.heading, fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400, color: colors.text, margin: '0 0 12px', letterSpacing: '-0.025em' }}>
          <ScrambleTitle text="Parcours" />
        </h2>
        <p style={{ fontFamily: fonts.body, fontSize: '15px', color: colors.textMuted, margin: '0 0 16px' }}>
          Scrollez pour faire tourner le carrousel
        </p>
        <Link to="/parcours" style={{ fontFamily: fonts.body, fontSize: '13px', color: colors.accent, textDecoration: 'none', fontWeight: 600 }}>
          Voir le détail complet →
        </Link>
      </motion.div>
    </div>
  )

  if (shouldReduce) {
    return (
      <section style={{ paddingBottom: '0' }}>
        {header}
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '0 40px 80px', maxWidth: '1100px', margin: '0 auto' }}>
          {(steps as ParcoursStep[]).map(s => {
            const color = TYPE_COLOR[s.type]
            return (
              <div key={s.id} style={{ flexShrink: 0, width: '420px', height: '400px', background: colors.bgCardHome, border: `1.5px solid ${color}`, borderRadius: '24px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {CAROUSEL_LOGOS[s.id] ? (
                  <img
                    src={CAROUSEL_LOGOS[s.id]}
                    alt={s.institution}
                    style={{ position: 'absolute', top: '24px', left: '24px', right: '24px', bottom: '110px', width: 'calc(100% - 48px)', height: 'calc(100% - 134px)', objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: ao(color, 0.14), border: `2px solid ${ao(color, 0.42)}` }} />
                )}
                <span style={{ position: 'absolute', top: 16, left: 18, fontFamily: fonts.mono, fontSize: '12px', fontWeight: 700, color, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.90 }}>
                  {TYPE_LABEL[s.type]}
                </span>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: `linear-gradient(to top, ${ao(colors.bg, 0.97)} 0%, ${ao(colors.bg, 0.75)} 55%, transparent 100%)`, padding: '60px 22px 22px' }}>
                  <div style={{ fontFamily: fonts.heading, fontSize: '22px', fontWeight: 400, color: colors.text, lineHeight: 1.25, letterSpacing: '-0.01em', marginBottom: '6px' }}>{s.title}</div>
                  <div style={{ fontFamily: fonts.body, fontSize: '15px', color, fontWeight: 600, marginBottom: '5px' }}>{s.institution}</div>
                  <div style={{ fontFamily: fonts.mono, fontSize: '12px', color: colors.textLight, letterSpacing: '0.05em' }}>{s.period}{s.location ? ` · ${s.location}` : ''}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <section style={{ paddingBottom: '0' }}>
      {header}

      <div ref={containerRef} style={{ height: `${N * 80}vh`, position: 'relative' }}>
        <div style={{
          position: 'sticky', top: 0, height: '100vh',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', background: colors.bg,
          perspective: '1200px',
          perspectiveOrigin: '50% 48%',
        }}>

          {/* Ambient orb shifts color with active step type */}
          <AnimatePresence mode="wait">
            <motion.div
              key={accent}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute',
                width: 580,
                height: 580,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${ao(accent, 0.22)} 0%, transparent 65%)`,
                filter: 'blur(72px)',
                pointerEvents: 'none',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -62%)',
                zIndex: 0,
              }}
            />
          </AnimatePresence>

          {/* Ring — static div, each card computes its own 3D transform */}
          <div style={{ position: 'relative', width: 0, height: 0, transform: 'translateY(-60px)', zIndex: 1 }}>
            {(steps as ParcoursStep[]).map((s, i) => (
              <CarouselCard
                key={s.id}
                step={s}
                index={i}
                active={active}
                anglePerItem={anglePerItem}
                RADIUS={RADIUS}
                rotY={rotY}
                N={N}
              />
            ))}
          </div>

          {/* Compteur */}
          <div style={{ position: 'absolute', bottom: '40px', right: '48px', fontFamily: fonts.mono, fontSize: '13px', color: colors.textLight, display: 'flex', gap: '6px', zIndex: 2 }}>
            <motion.span animate={{ color: accent }} style={{ fontWeight: 700 }}>{String(active + 1).padStart(2, '0')}</motion.span>
            <span>/</span>
            <span>{String(N).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── ProjetDossier ────────────────────────────────────────────────────────────

const PROJ_ACCENT: Record<string, string> = {
  'ct-scan-deep-learning': '#6b9fc8',
  'regulateur-glycemie':   '#22c55e',
  'main-robotique-emg':    '#60a5fa',
  'ethylometre':           '#a78bfa',
  'anemometre':            '#fbbf24',
}

const PROJECT_3D: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'ct-scan-deep-learning': CTScanCanvasLazy,
  'regulateur-glycemie':   GlycemieCanvasLazy,
  'main-robotique-emg':    HandOnlyLazy,
  'ethylometre':           EthylCanvasLazy,
  'anemometre':            AnemCanvasLazy,
}

// Positions finales des cartes autour du dossier (px, relatif au centre du viewport)
// Contraintes : x ≤ ±380 (évite le clip sur 1024px), y bas ≤ 200 (évite le clip à 768px)
const CARD_POSITIONS = [
  { x: -370, y: -170 }, // gauche haut
  { x:  370, y: -170 }, // droite haut
  { x: -370, y:  170 }, // gauche bas
  { x:  370, y:  170 }, // droite bas
  { x:    0, y:  200 }, // centre bas
]


const PAPER_STRIPS = [
  { color: '#acb087', left: 20, right: 20 },
  { color: '#567C8D', left: 30, right: 30 },
  { color: '#C7AF94', left: 45, right: 45 },
]

function FolderIcon({ open }: { open: boolean }) {
  return (
    <div style={{
      position: 'relative', width: 380, height: 310,
      perspective: '1200px', perspectiveOrigin: '50% 90%',
      zIndex: 5, flexShrink: 0, pointerEvents: 'none',
    }}>
      {/* Onglet */}
      <div style={{
        position: 'absolute', top: -26, left: 22,
        width: 110, height: 32,
        background: 'linear-gradient(135deg, #5E4B3B, #7a5c45)',
        borderRadius: '14px 14px 0 0',
        zIndex: 0,
        boxShadow: '0 -4px 12px #f1e0c1',
      }} />

      {/* Dos du dossier */}
      <div style={{
        position: 'absolute', top: 20, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(155deg, #5E4B3B)',
        borderRadius: '4px 28px 28px 28px',
        boxShadow: '#f1e0c1 0px 60px 140px, #f1e0c1 0px 20px 48px',
        zIndex: 2,
      }} />

      {/* Papiers qui dépassent — entre le dos et le rabat */}
      {PAPER_STRIPS.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: 24 + i * 9,
          left: p.left, right: p.right,
          height: 300,
          background: `linear-gradient(to bottom, ${p.color}f0 0%, ${p.color}50 60%, transparent 100%)`,
          borderRadius: '8px 8px 0 0',
          zIndex: 3,
        }} />
      ))}

      {/* Rabat avant — s'ouvre au hover */}
      <motion.div
        animate={{ rotateX: open ? -62 : 0 }}
        transition={{ duration: 0.60, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute', top: 52, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(155deg, #5E4B3B)',
          borderRadius: '0 0 28px 28px',
          transformOrigin: 'bottom center',
          zIndex: 4,
          boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.13), inset 0 -2px 8px rgba(0,0,0,0.12)',
        }}
      >
        {/* Badge "Portfolio" */}
        <div style={{
          position: 'absolute', top: 22, left: 22,
          padding: '5px 16px',
          background: 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(255,255,255,0.16)',
          borderRadius: 12,
          fontFamily: fonts.body, fontSize: '11px', fontWeight: 600,
          color: 'rgba(255,255,255,0.65)',
          letterSpacing: '0.05em',
          backdropFilter: 'blur(4px)',
        }}>
          Portfolio
        </div>

        {/* Icône embossée — 3 piliers */}
        <div style={{
          position: 'absolute',
          top: '46%', left: '54%',
          transform: 'translate(-50%, -44%)',
          display: 'flex', alignItems: 'flex-end', gap: 13,
          opacity: 0.15,
        }}>
          {[{ bar: 60 }, { bar: 82 }, { bar: 68 }].map(({ bar }, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 17, height: 17, borderRadius: '50%', background: '#fff' }} />
              <div style={{ width: 17, height: bar, borderRadius: 9, background: '#fff' }} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function DossierCard({
  project, index, total, scrollYProgress,
}: {
  project: Project
  index: number
  total: number
  scrollYProgress: MotionValue<number>
}) {
  const Render3D = PROJECT_3D[project.slug]
  const accent   = PROJ_ACCENT[project.slug] ?? '#6b9fc8'
  const pos      = CARD_POSITIONS[index] ?? { x: 0, y: 0 }

  const segStart = Math.max(0.05, (index / total) * 0.60)

  const [arrived, setArrived] = useState(false)
  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (v >= segStart && !arrived) setArrived(true)
    else if (v < segStart && arrived) setArrived(false)
  })

  return (
    <motion.div
      initial={{ x: 0, y: 0, scale: 0.38, opacity: 0 }}
      animate={arrived
        ? { x: pos.x, y: pos.y, scale: 1, opacity: 1 }
        : { x: 0,     y: 0,     scale: 0.38, opacity: 0 }}
      transition={arrived
        ? { type: 'spring', stiffness: 72, damping: 14, mass: 1.1,
            opacity: { duration: 0.25, ease: 'easeOut' } }
        : { duration: 0.40, ease: [0.55, 0, 0.8, 0.5] }}
      style={{
        position: 'absolute',
        top: '50%', left: '50%',
        marginLeft: -110, marginTop: -145,
        width: 220, height: 290,
        zIndex: 10 + index,
        borderRadius: '16px',
      }}
    >
      <motion.div
        whileHover={{ scale: 1.06, boxShadow: `0 28px 72px ${ao(accent, 0.52)}` }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%', height: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: `0 14px 40px ${ao(colors.text, 0.35)}`,
          border: `1px solid ${ao(accent, 0.22)}`,
          position: 'relative',
          background: '#F4EFE6',
          cursor: 'pointer',
        }}
      >
        {/* Rendu 3D — toujours actif */}
        {Render3D && (
          <Suspense fallback={null}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <Render3D />
            </div>
          </Suspense>
        )}

        {/* Overlay bas — titre + lien */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '48px 14px 14px',
          background: `linear-gradient(to top, ${ao(colors.text, 0.9)} 0%, transparent 100%)`,
          zIndex: 2,
        }}>
          <span style={{
            display: 'inline-block', padding: '2px 7px', borderRadius: 5,
            background: ao(accent, 0.2), color: accent,
            fontFamily: fonts.body, fontSize: '8px', fontWeight: 700,
            letterSpacing: '0.10em', textTransform: 'uppercase' as const,
            marginBottom: 6,
          }}>
            {project.context}
          </span>
          <h4 style={{
            fontFamily: fonts.heading,
            fontSize: '14px', fontWeight: 400,
            color: colors.bg, lineHeight: 1.2,
            margin: '0 0 6px',
          }}>
            {project.title}
          </h4>
          <Link to={`/projets/${project.slug}`} style={{
            fontFamily: fonts.body, fontSize: '10px', fontWeight: 600,
            color: accent, textDecoration: 'none',
          }}>
            Voir →
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ProjetDossier() {
  const { data: projects } = useProjects()
  const featured = (projects as Project[]).filter(p => p.has3D)
  const N = featured.length

  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [folderHovered, setFolderHovered] = useState(false)
  const [autoOpen, setAutoOpen] = useState(false)
  const folderOpen = folderHovered || autoOpen

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', v => setAutoOpen(v > 0.02))

  const textY = useTransform(scrollYProgress, [0, 1], [40, -80])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setMounted(true) },
      { threshold: 0.02 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div>
      <section style={{ padding: '120px 40px 60px', textAlign: 'center', background: colors.bg }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.48 }}
        >
          <h2 style={{ fontFamily: fonts.heading, fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400, color: colors.text, margin: '0 0 12px', letterSpacing: '-0.025em' }}>
            <ScrambleTitle text="Projets" />
          </h2>
          <p style={{ fontFamily: fonts.body, fontSize: '15px', color: colors.textMuted, margin: '0 0 14px' }}>
            Rendus 3D interactifs · {N} projets
          </p>
          <Link to="/projets" style={{ fontFamily: fonts.body, fontSize: '13px', color: colors.accent, textDecoration: 'none', fontWeight: 600 }}>
            Tous les projets →
          </Link>
        </motion.div>
      </section>

      <div ref={containerRef} style={{ height: `${N * 100}vh` }}>
        <div style={{
          position: 'sticky', top: 0,
          height: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: colors.bg,
          overflow: 'hidden',
        }}>
          {/* Watermark "Projets" en arrière-plan */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none', overflow: 'hidden',
          }}>
            <motion.span style={{
              fontFamily: fonts.heading,
              fontSize: '30vw',
              fontWeight: 700,
              color: colors.text,
              opacity: 0.055,
              letterSpacing: '-0.03em',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              lineHeight: 1,
              display: 'block',
              y: textY,
            }}>
              Projets
            </motion.span>
          </div>

          <div
            onMouseEnter={() => setFolderHovered(true)}
            onMouseLeave={() => setFolderHovered(false)}
            style={{ cursor: 'pointer', zIndex: 5 }}
          >
            <FolderIcon open={folderOpen} />
          </div>

          {mounted && featured.map((project, i) => (
            <DossierCard
              key={project.slug}
              project={project}
              index={i}
              total={N}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contact" style={{ borderTop: `1px solid ${colors.border}`, padding: '120px 40px', background: colors.bg }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 style={{ fontFamily: fonts.heading, fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 400, color: colors.text, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
            Travaillons<br /><em style={{ fontWeight: 300, fontStyle: 'italic', color: colors.textMuted }}>ensemble.</em>
          </h2>
          <p style={{ fontFamily: fonts.body, fontSize: '16px', color: colors.textMuted, lineHeight: 1.75, margin: '0 0 48px' }}>
            PFE de 6 mois · début 2027 · R&D biomédicale.<br />
            Medtech, imagerie médicale, dispositifs médicaux, data santé.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.48, delay: 0.1 }}
          style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start', flexWrap: 'wrap', marginBottom: '56px' }}
        >
          {[
            { label: 'Email', href: 'mailto:lucas.desmartin@esme.fr' },
            { label: 'LinkedIn', href: '#' },
            { label: 'GitHub', href: '#' },
          ].map((link) => (
            <motion.a key={link.label} href={link.href}
              whileHover={{ scale: 1.05, background: colors.bgCard, boxShadow: `0 8px 24px ${ca.text(0.1)}` }}
              whileTap={{ scale: 0.97 }}
              style={{ fontFamily: fonts.body, fontSize: '14px', fontWeight: 600, color: colors.text, textDecoration: 'none', padding: '12px 24px', borderRadius: '12px', border: `1.5px solid ${colors.border}`, background: 'transparent', display: 'inline-block', transition: 'box-shadow 0.2s' }}
            >
              {link.label}
            </motion.a>
          ))}
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.48, delay: 0.2 }}
          onSubmit={e => e.preventDefault()}
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {[
              { name: 'name', label: 'Nom', type: 'text', placeholder: 'Votre nom' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'votre@email.com' },
            ].map(f => (
              <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  style={{ padding: '13px 16px', borderRadius: '10px', border: `1.5px solid ${colors.border}`, background: colors.bgCard, color: colors.text, fontFamily: fonts.body, fontSize: '14px', outline: 'none', transition: 'border-color 0.15s' }}
                  onFocus={e => (e.target.style.borderColor = colors.accent)}
                  onBlur={e => (e.target.style.borderColor = colors.border)}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Message</label>
            <textarea placeholder="Votre message..." rows={4}
              style={{ padding: '13px 16px', borderRadius: '10px', border: `1.5px solid ${colors.border}`, background: colors.bgCard, color: colors.text, fontFamily: fonts.body, fontSize: '14px', outline: 'none', resize: 'vertical', transition: 'border-color 0.15s' }}
              onFocus={e => (e.target.style.borderColor = colors.accent)}
              onBlur={e => (e.target.style.borderColor = colors.border)}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: `0 10px 32px ${ca.accent(0.28)}` }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            style={{ background: colors.accent, color: colors.bg, border: 'none', padding: '15px', borderRadius: '12px', fontSize: '15px', fontFamily: fonts.body, fontWeight: 600, cursor: 'pointer', boxShadow: `0 4px 18px ${ca.accent(0.22)}` }}
          >
            Envoyer →
          </motion.button>
        </motion.form>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <MarqueeStrip />
      <QuiJeSuis />
      <DataStrip />
      <MarqueeStripReversed />
      <Carousel3D />
      <ECGDivider />
      <ProjetDossier />
      <Contact />
    </PageTransition>
  )
}
