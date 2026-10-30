import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react'
import { animate, stagger } from 'animejs'
import PageTransition from '@/components/PageTransition'
import Reveal from '@/components/Reveal'
import ThreeBoundary from '@/components/ThreeBoundary'
import CurieField from '@/three/CurieField'
import { colors, fonts, ca, contextColors, justify } from '@/lib/tokens'
import { type ProjectContext } from '@/lib/data'
import { useProjects } from '@/hooks/useProjects'
import { useMediaQuery, NARROW } from '@/hooks/useMediaQuery'

const HandCanvasOnly  = lazy(() => import('@/three/HandCanvas').then(m => ({ default: m.HandCanvasOnly })))
const EthylCanvas     = lazy(() => import('@/three/EthylCanvas'))
const AnemCanvas      = lazy(() => import('@/three/AnemCanvas'))
const CTScanCanvas    = lazy(() => import('@/three/CTScanCanvas'))
const GlycemieCanvas  = lazy(() => import('@/three/GlycemieCanvas'))
const AustralCanvas   = lazy(() => import('@/three/AustralCanvas'))

const CTX_COLOR: Record<ProjectContext, string> = contextColors

// Projets phares dont la vignette est une animation plutôt que la figure de couverture
const TIER1_ANIMATED = new Set(['austral-omics', 'ct-scan-deep-learning', 'regulateur-glycemie', 'main-robotique-emg'])

type Filter = 'tous' | ProjectContext
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'tous', label: 'Tous' },
  { key: 'Stage', label: 'Stage' },
  { key: 'ESME', label: 'ESME' },
  { key: 'BUT', label: 'BUT' },
  { key: 'Perso', label: 'Perso' },
]

// ─── TiltCard ─────────────────────────────────────────────────────────────────

function TiltCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const rotX = useMotionValue(0), rotY = useMotionValue(0)
  const sRotX = useSpring(rotX, { stiffness: 180, damping: 22 })
  const sRotY = useSpring(rotY, { stiffness: 180, damping: 22 })
  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    rotX.set(-(((e.clientY - rect.top) / rect.height) - 0.5) * 8)
    rotY.set(((e.clientX - rect.left) / rect.width - 0.5) * 8)
  }
  return (
    <div style={{ perspective: '900px', ...style }}>
      <motion.div ref={ref} style={{ rotateX: sRotX, rotateY: sRotY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMove} onMouseLeave={() => { rotX.set(0); rotY.set(0) }} whileHover={{ scale: 1.01 }}>
        {children}
      </motion.div>
    </div>
  )
}

// ─── Tier 1 Visual Scenes ─────────────────────────────────────────────────────

// CT-Scan: dot grid + sweeping scan line + lung outlines
function CTScanScene({ a }: { a: string }) {
  const COLS = 10, ROWS = 7
  return (
    <svg viewBox="0 0 260 160" width="100%" height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {Array.from({ length: ROWS * COLS }, (_, i) => {
        const col = i % COLS, row = Math.floor(i / COLS)
        return (
          <motion.circle key={i}
            cx={13 + col * 24} cy={12 + row * 22} r={1.6} fill={a}
            animate={{ opacity: [0.08, 0.5, 0.08] }}
            transition={{ duration: 4, delay: (row * 0.14 + col * 0.06) % 3.8, repeat: Infinity }}
          />
        )
      })}
      {/* Sweeping scan bar */}
      <motion.rect
        x={8} width={244} height={2} fill={a}
        animate={{ y: [8, 148, 8] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: `drop-shadow(0 0 5px ${a})`, opacity: 0.7 }}
      />
      {/* Lung outlines */}
      <motion.ellipse cx={110} cy={82} rx={18} ry={26} fill="none" stroke={a} strokeWidth={1}
        animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2.8, repeat: Infinity }} />
      <motion.ellipse cx={150} cy={82} rx={18} ry={26} fill="none" stroke={a} strokeWidth={1}
        animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2.8, delay: 0.4, repeat: Infinity }} />
      <motion.line x1={130} y1={50} x2={130} y2={68} stroke={a} strokeWidth={1.5}
        animate={{ opacity: [0.15, 0.55, 0.15] }} transition={{ duration: 2.8, repeat: Infinity }} />
      {/* Accuracy readout */}
      <text x={196} y={152} fontSize="9" fill={a} opacity={0.55} fontFamily="monospace">93.7% acc</text>
    </svg>
  )
}

// Régulateur glycémie: sine curve + bounds + animated dot
function GlycemieScene({ a }: { a: string }) {
  const PATH = 'M0,82 C26,62 26,62 52,82 C78,102 78,102 104,82 C130,62 130,62 156,82 C182,102 182,102 208,82 C234,62 234,62 260,82'
  const dotCX = [0, 26, 52, 78, 104, 130, 156, 182, 208, 234, 260]
  const dotCY = [82, 62, 82, 102, 82, 62, 82, 102, 82, 62, 82]
  const t = dotCX.map((_, i) => i / (dotCX.length - 1))
  return (
    <svg viewBox="0 0 260 160" width="100%" height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* Normal range band */}
      <rect x={0} y={62} width={260} height={40} fill={a} fillOpacity={0.07} />
      <line x1={0} x2={260} y1={62} y2={62} stroke={a} strokeWidth={0.8} strokeDasharray="5 4" strokeOpacity={0.4} />
      <line x1={0} x2={260} y1={102} y2={102} stroke={a} strokeWidth={0.8} strokeDasharray="5 4" strokeOpacity={0.4} />
      {/* Labels */}
      <text x={4} y={58} fontSize="7" fill={a} opacity={0.45} fontFamily="monospace">HYPER</text>
      <text x={4} y={114} fontSize="7" fill={a} opacity={0.45} fontFamily="monospace">HYPO</text>
      {/* Wave path */}
      <path d={PATH} fill="none" stroke={a} strokeWidth={2} strokeOpacity={0.75} />
      {/* Animated dot following the wave */}
      <motion.circle r={5} fill={a}
        animate={{ cx: dotCX, cy: dotCY }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'linear', times: t }}
        style={{ filter: `drop-shadow(0 0 4px ${a})` }}
      />
      {/* Trailing path draw */}
      <motion.path d={PATH} fill="none" stroke={a} strokeWidth={3} strokeOpacity={0.22}
        animate={{ pathLength: [0, 1, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <text x={200} y={152} fontSize="8" fill={a} opacity={0.6} fontFamily="monospace">PID ↓</text>
    </svg>
  )
}

// Main robotique EMG: 3-channel signal + hand silhouette
function EMGScene({ a }: { a: string }) {
  const channels = [
    { y: 45, delay: 0 },
    { y: 82, delay: 0.45 },
    { y: 119, delay: 0.9 },
  ]
  const sig = (cy: number) =>
    `M0,${cy} L22,${cy} L24,${cy - 4} L26,${cy - 17} L28,${cy - 4} L30,${cy + 8} L32,${cy}` +
    ` L56,${cy} L58,${cy - 3} L60,${cy - 14} L62,${cy - 3} L64,${cy + 6} L66,${cy}` +
    ` L96,${cy} L98,${cy - 5} L100,${cy - 21} L102,${cy - 5} L104,${cy + 9} L106,${cy}` +
    ` L130,${cy} L132,${cy - 3} L134,${cy - 13} L136,${cy - 3} L138,${cy + 5} L140,${cy} L162,${cy}`
  return (
    <svg viewBox="0 0 260 160" width="100%" height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {channels.map(({ y, delay }, i) => (
        <g key={i}>
          <line x1={0} x2={164} y1={y} y2={y} stroke={a} strokeWidth={0.4} strokeOpacity={0.18} />
          <text x={3} y={y + 3} fontSize="6" fill={a} opacity={0.3} fontFamily="monospace">CH{i + 1}</text>
          <motion.path d={sig(y)} fill="none" stroke={a} strokeWidth={1.3}
            animate={{ strokeOpacity: [0, 0.85, 0.85, 0] }}
            transition={{ duration: 3, delay, repeat: Infinity, repeatDelay: 0.6 }}
          />
        </g>
      ))}
      {/* Hand silhouette */}
      <motion.g animate={{ opacity: [0.18, 0.42, 0.18] }} transition={{ duration: 2.6, repeat: Infinity }}>
        <rect x={192} y={68} width={26} height={20} rx={5} fill={a} />
        {[0, 6, 12, 18].map(off => (
          <rect key={off} x={194 + off} y={52} width={5} height={19} rx={3} fill={a} />
        ))}
        <rect x={184} y={74} width={9} height={5} rx={3} fill={a} />
      </motion.g>
      <text x={4} y={152} fontSize="7" fill={a} opacity={0.45} fontFamily="monospace">EMG SURFACE</text>
    </svg>
  )
}

// ─── Tier 2 Visual Scenes ─────────────────────────────────────────────────────

// Mon Wallet Médical: hexagonal blockchain network
function WalletScene({ a }: { a: string }) {
  const hex = (cx: number, cy: number, r = 14) =>
    Array.from({ length: 6 }, (_, i) => {
      const rad = (Math.PI / 3) * i - Math.PI / 6
      return `${cx + r * Math.cos(rad)},${cy + r * Math.sin(rad)}`
    }).join(' ')
  const nodes = [
    { cx: 58, cy: 42, d: 0 }, { cx: 92, cy: 42, d: 0.35 },
    { cx: 41, cy: 68, d: 0.7 }, { cx: 75, cy: 68, d: 1.05 }, { cx: 109, cy: 68, d: 1.4 },
    { cx: 58, cy: 94, d: 1.75 }, { cx: 92, cy: 94, d: 2.1 },
  ]
  const edges = [[0, 1], [0, 2], [0, 3], [1, 3], [1, 4], [2, 5], [3, 5], [3, 6], [4, 6]]
  return (
    <svg viewBox="0 0 150 120" width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {edges.map(([s, e], i) => (
        <motion.line key={i}
          x1={nodes[s].cx} y1={nodes[s].cy} x2={nodes[e].cx} y2={nodes[e].cy}
          stroke={a} strokeWidth={0.8}
          animate={{ strokeOpacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
        />
      ))}
      {nodes.map(({ cx, cy, d }, i) => (
        <motion.polygon key={i} points={hex(cx, cy)}
          fill={a} stroke={a} strokeWidth={0.8}
          animate={{ fillOpacity: [0.04, 0.18, 0.04], strokeOpacity: [0.28, 0.7, 0.28] }}
          transition={{ duration: 2.6, delay: d, repeat: Infinity }}
        />
      ))}
      {/* Lock icon at center node */}
      <rect x={70} y={62} width={10} height={8} rx={1.5} fill={a} opacity={0.55} />
      <path d="M72,62 Q72,57 75,57 Q78,57 78,62" fill="none" stroke={a} strokeWidth={1.5} strokeOpacity={0.55} />
      <circle cx={75} cy={66} r={1.5} fill={a} opacity={0.85} />
    </svg>
  )
}

// Éthylomètre: device outline + OLED bar + breath expand circle
function EthylScene({ a }: { a: string }) {
  return (
    <svg viewBox="0 0 150 120" width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* Device body */}
      <rect x={45} y={14} width={60} height={80} rx={9} fill="none" stroke={a} strokeWidth={1.5} strokeOpacity={0.5} />
      {/* OLED screen */}
      <rect x={53} y={22} width={44} height={20} rx={3} fill={a} fillOpacity={0.09} stroke={a} strokeWidth={0.8} strokeOpacity={0.38} />
      <motion.rect x={55} y={26} height={12} rx={2} fill={a} fillOpacity={0.65}
        animate={{ width: [0, 36, 14, 4, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* LEDs */}
      {[0, 1, 2].map(i => (
        <motion.circle key={i} cx={58 + i * 12} cy={60} r={3.5}
          fill={i === 0 ? colors.olive : i === 1 ? colors.textLight : colors.rust}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.6, delay: i * 0.5, repeat: Infinity }}
        />
      ))}
      {/* Mouthpiece */}
      <rect x={63} y={94} width={24} height={10} rx={5} fill={a} fillOpacity={0.28} stroke={a} strokeWidth={1} strokeOpacity={0.45} />
      {/* Breath expanding circles */}
      <motion.circle cx={75} cy={60} r={12} fill="none" stroke={a}
        animate={{ r: [12, 38, 12], strokeOpacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2.8, repeat: Infinity }}
      />
      <motion.circle cx={75} cy={60} r={8} fill="none" stroke={a}
        animate={{ r: [8, 26, 8], strokeOpacity: [0.2, 0, 0.2] }}
        transition={{ duration: 2.8, delay: 0.5, repeat: Infinity }}
      />
    </svg>
  )
}

// Anémomètre: compass dial + rotating blades
function AnemScene({ a }: { a: string }) {
  const CX = 75, CY = 58
  return (
    <svg viewBox="0 0 150 120" width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* Outer ring */}
      <circle cx={CX} cy={CY} r={48} fill="none" stroke={a} strokeWidth={1} strokeOpacity={0.28} />
      <circle cx={CX} cy={CY} r={36} fill="none" stroke={a} strokeWidth={0.6} strokeOpacity={0.18} />
      {/* Tick marks */}
      {Array.from({ length: 8 }, (_, i) => {
        const deg = i * 45, rad = (deg * Math.PI) / 180
        const isCard = deg % 90 === 0
        return (
          <line key={deg}
            x1={CX + 40 * Math.cos(rad)} y1={CY + 40 * Math.sin(rad)}
            x2={CX + 48 * Math.cos(rad)} y2={CY + 48 * Math.sin(rad)}
            stroke={a} strokeWidth={isCard ? 1.5 : 0.7} strokeOpacity={isCard ? 0.6 : 0.28}
          />
        )
      })}
      {/* Rotating blades */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      >
        {[0, 90, 180, 270].map(deg => {
          const rad = (deg * Math.PI) / 180
          const bx = CX + 18 * Math.cos(rad), by = CY + 18 * Math.sin(rad)
          return (
            <ellipse key={deg}
              cx={bx} cy={by} rx={9} ry={4}
              transform={`rotate(${deg}, ${bx}, ${by})`}
              fill={a} fillOpacity={0.5}
            />
          )
        })}
      </motion.g>
      {/* Hub */}
      <circle cx={CX} cy={CY} r={5} fill={a} opacity={0.65} />
      {/* Speed readout */}
      <motion.text x={CX} y={112} fontSize="9" fill={a} opacity={0.6} textAnchor="middle" fontFamily="monospace"
        animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
        52 km/h
      </motion.text>
    </svg>
  )
}

// Eaux résiduaires: chromatography peaks
function EauxScene({ a }: { a: string }) {
  const BASE = 90
  const peaks = [
    { x: 42, h: 62, label: 'HAP', delay: 0 },
    { x: 78, h: 42, label: 'MTBE', delay: 0.5 },
    { x: 112, h: 54, label: 'Irgarol', delay: 1 },
  ]
  return (
    <svg viewBox="0 0 150 115" width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <line x1={18} x2={132} y1={BASE} y2={BASE} stroke={a} strokeWidth={1} strokeOpacity={0.4} />
      <line x1={18} x2={18} y1={18} y2={BASE} stroke={a} strokeWidth={1} strokeOpacity={0.4} />
      <text x={75} y={110} fontSize="7" fill={a} opacity={0.38} textAnchor="middle" fontFamily="monospace">t retention</text>
      {peaks.map(({ x, h, label, delay }) => {
        const peakPath = `M${x - 13},${BASE} Q${x - 5},${BASE - h * 0.65} ${x},${BASE - h} Q${x + 5},${BASE - h * 0.65} ${x + 13},${BASE}`
        return (
          <g key={x}>
            <motion.path d={peakPath} fill="none" stroke={a} strokeWidth={1.6}
              animate={{ pathLength: [0, 1, 1, 0] }}
              transition={{ duration: 1.2, delay, repeat: Infinity, repeatDelay: 3.5, times: [0, 0.45, 0.8, 1] }}
            />
            <motion.path d={`${peakPath} Z`} fill={a}
              animate={{ fillOpacity: [0, 0.16, 0.16, 0] }}
              transition={{ duration: 1.2, delay, repeat: Infinity, repeatDelay: 3.5, times: [0, 0.45, 0.8, 1] }}
            />
            <text x={x} y={BASE + 9} fontSize="6.5" fill={a} opacity={0.48} textAnchor="middle" fontFamily="monospace">{label}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── Scene selectors ──────────────────────────────────────────────────────────

function Tier1Visual({ slug, accent }: { slug: string; accent: string }) {
  const p = { a: accent }
  if (slug === 'austral-omics') {
    return (
      <Suspense fallback={null}>
        <AustralCanvas />
      </Suspense>
    )
  }
  if (slug === 'ct-scan-deep-learning') {
    return (
      <ThreeBoundary fallback={<CTScanScene {...p} />}>
        <Suspense fallback={<CTScanScene {...p} />}>
          <CTScanCanvas />
        </Suspense>
      </ThreeBoundary>
    )
  }
  if (slug === 'regulateur-glycemie') {
    return (
      <ThreeBoundary fallback={<GlycemieScene {...p} />}>
        <Suspense fallback={<GlycemieScene {...p} />}>
          <GlycemieCanvas titleInset={72} />
        </Suspense>
      </ThreeBoundary>
    )
  }
  if (slug === 'main-robotique-emg') {
    return (
      <ThreeBoundary fallback={<EMGScene {...p} />}>
        <Suspense fallback={<EMGScene {...p} />}>
          <HandCanvasOnly />
        </Suspense>
      </ThreeBoundary>
    )
  }
  switch (slug) {
    default: return null
  }
}

function Tier2Visual({ slug, accent }: { slug: string; accent: string }) {
  const p = { a: accent }
  if (slug === 'ethylometre') {
    return (
      <ThreeBoundary fallback={<EthylScene {...p} />}>
        <Suspense fallback={<EthylScene {...p} />}>
          <EthylCanvas />
        </Suspense>
      </ThreeBoundary>
    )
  }
  if (slug === 'anemometre') {
    return (
      <ThreeBoundary fallback={<AnemScene {...p} />}>
        <Suspense fallback={<AnemScene {...p} />}>
          <AnemCanvas />
        </Suspense>
      </ThreeBoundary>
    )
  }
  switch (slug) {
    case 'institut-curie':     return <CurieField {...p} />
    case 'mon-wallet-medical': return <WalletScene {...p} />
    case 'eaux-residuaires':   return <EauxScene {...p} />
    default: return null
  }
}

// ─── Context badge ────────────────────────────────────────────────────────────

function CtxBadge({ label, accent, pos = 'left' }: { label: string; accent: string; pos?: 'left' | 'right' }) {
  return (
    <div style={{
      position: 'absolute', top: 16, [pos]: 16,
      padding: '4px 11px', borderRadius: '7px',
      background: `${accent}1A`, border: `1px solid ${accent}35`,
      fontFamily: fonts.body, fontSize: '10px', fontWeight: 700, color: accent, letterSpacing: '0.07em',
    }}>
      {label}
    </div>
  )
}

// ─── Section separator ────────────────────────────────────────────────────────

function SectionLabel({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
      <span style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: colors.borderLight }} />
    </div>
  )
}

// ─── Tier 1 Card ──────────────────────────────────────────────────────────────

function Tier1Card({ project, index }: { project: ReturnType<typeof useProjects>['data'][0]; index: number }) {
  const narrow = useMediaQuery(NARROW)   // téléphone : une colonne, visuel au-dessus du texte
  const isReversed = index % 2 === 1 && !narrow
  const accent = CTX_COLOR[project.context]
  const [hovered, setHovered] = useState(false)

  const visualZone = (
    <div style={{
      height: narrow ? 'clamp(240px, 70vw, 320px)' : '420px',
      background: `linear-gradient(145deg, ${accent}06 0%, ${accent}18 100%)`,
      position: 'relative', overflow: 'hidden', flexShrink: 0,
    }}>
      {/* Dot grid overlay */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        backgroundImage: `radial-gradient(circle, ${accent}28 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
      }} />
      {project.cover && !TIER1_ANIMATED.has(project.slug) ? (
        <div style={{ position: 'absolute', inset: '18px', zIndex: 1, background: colors.bgCard, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}>
          <img src={project.cover} alt={project.figures?.[0]?.alt ?? ''} loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </div>
      ) : (
        <Tier1Visual slug={project.slug} accent={accent} />
      )}
      <CtxBadge label={project.context} accent={accent} />
      <div style={{
        position: 'absolute', bottom: 14, right: 16, zIndex: 2,
        fontFamily: fonts.mono, fontSize: '11px',
        color: hovered ? 'rgba(255,255,255,0.35)' : accent,
        opacity: hovered ? 1 : 0.3,
        letterSpacing: '0.06em',
        transition: 'color 0.4s, opacity 0.4s',
      }}>
        0{index + 1}
      </div>
    </div>
  )

  const textZone = (
    <div style={{
      position: 'relative', zIndex: 1,
      padding: narrow ? '24px 20px 28px' : '44px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
    }}>
      <div style={{
        fontFamily: fonts.mono, fontSize: '11px', letterSpacing: '0.08em', marginBottom: '14px',
        color: hovered ? 'rgba(255,255,255,0.55)' : colors.textLight,
        transition: 'color 0.35s',
      }}>
        {project.context}
      </div>
      <h3 style={{
        fontFamily: fonts.heading, fontSize: 'clamp(22px, 2.4vw, 30px)', fontWeight: 400,
        margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.18,
        color: hovered ? colors.bg : colors.text,
        transition: 'color 0.35s',
      }}>
        {project.title}
      </h3>
      <p style={{
        fontFamily: fonts.body, fontSize: '14px', fontWeight: 600, margin: '0 0 18px',
        color: hovered ? 'rgba(255,255,255,0.85)' : accent,
        transition: 'color 0.35s',
      }}>
        {project.subtitle}
      </p>
      <p style={{
        fontFamily: fonts.body, fontSize: '14px', lineHeight: 1.78, margin: '0 0 24px', ...justify,
        color: hovered ? 'rgba(255,255,255,0.65)' : colors.textMuted,
        transition: 'color 0.35s',
      }}>
        {project.description}
      </p>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {project.tags.map(tag => (
          <span key={tag} style={{
            fontFamily: fonts.body, fontSize: '11px', fontWeight: 500,
            padding: '3px 10px', borderRadius: '20px',
            background: hovered ? 'rgba(255,255,255,0.15)' : `${accent}0F`,
            color: hovered ? colors.bg : accent,
            border: `1px solid ${hovered ? 'rgba(255,255,255,0.22)' : `${accent}22`}`,
            transition: 'background 0.35s, color 0.35s, border-color 0.35s',
          }}>
            {tag}
          </span>
        ))}
      </div>
      <span style={{
        fontFamily: fonts.body, fontSize: '13px', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: '6px',
        color: hovered ? colors.bg : accent,
        transform: hovered ? 'translateX(6px)' : 'translateX(0)',
        transition: 'color 0.35s, transform 0.3s cubic-bezier(0.22,1,0.36,1)',
      }}>
        Voir le projet →
      </span>
    </div>
  )

  return (
    <Reveal delay={index * 0.08}>
      <Link to={`/projets/${project.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr' : isReversed ? '1fr 1.15fr' : '1.15fr 1fr',
            borderRadius: '18px', overflow: 'hidden', cursor: 'pointer',
            border: `1px solid ${hovered ? accent + '60' : colors.border}`,
            background: colors.bgCard,
            boxShadow: hovered
              ? `0 24px 64px ${accent}1a, 0 2px 8px ${accent}10`
              : `0 4px 18px ${ca.text(0.05)}`,
            transition: 'box-shadow 0.4s, border-color 0.4s',
            position: 'relative',
          }}
        >
          {/* Full-card color wipe on hover */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, zIndex: 0, borderRadius: '18px',
            background: accent,
            clipPath: hovered ? 'inset(0 0% 0 0 round 18px)' : 'inset(0 100% 0 0 round 18px)',
            transition: 'clip-path 0.65s cubic-bezier(0.76, 0, 0.24, 1)',
          }} />
          {isReversed ? <>{textZone}{visualZone}</> : <>{visualZone}{textZone}</>}
        </div>
      </Link>
    </Reveal>
  )
}

// ─── Tier 2 Card ──────────────────────────────────────────────────────────────

function Tier2Card({ project }: { project: ReturnType<typeof useProjects>['data'][0] }) {
  const accent = CTX_COLOR[project.context]
  const [hovered, setHovered] = useState(false)
  return (
    <Reveal>
      <TiltCard>
        <Link to={`/projets/${project.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              background: colors.bgCard,
              border: `1px solid ${hovered ? accent + '55' : colors.border}`,
              borderRadius: '14px', overflow: 'hidden', cursor: 'pointer',
              boxShadow: hovered
                ? `0 18px 48px ${accent}22, 0 2px 8px ${accent}10`
                : `0 2px 12px ${ca.text(0.05)}`,
              transition: 'box-shadow 0.35s, border-color 0.35s',
            }}
          >
            <div style={{
              height: '240px',
              background: `linear-gradient(135deg, ${accent}07 0%, ${accent}18 100%)`,
              position: 'relative', overflow: 'hidden',
            }}>
              <Tier2Visual slug={project.slug} accent={accent} />
              <CtxBadge label={project.context} accent={accent} />
            </div>
            <div style={{ padding: '20px 22px 24px' }}>
              <h3 style={{
                fontFamily: fonts.heading, fontSize: '19px', fontWeight: 500,
                color: hovered ? accent : colors.text,
                margin: '0 0 5px', letterSpacing: '-0.01em',
                transition: 'color 0.3s',
              }}>
                {project.title}
              </h3>
              <p style={{ fontFamily: fonts.body, fontSize: '13px', color: colors.textMuted, margin: '0 0 14px' }}>
                {project.subtitle}
              </p>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {project.tags.slice(0, 3).map(tag => (
                  <span key={tag} style={{
                    fontFamily: fonts.body, fontSize: '11px', fontWeight: 500,
                    padding: '3px 9px', borderRadius: '20px',
                    background: hovered ? `${accent}18` : `${accent}0F`,
                    color: accent, border: `1px solid ${accent}1E`,
                    transition: 'background 0.3s',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
              <span style={{
                fontFamily: fonts.body, fontSize: '12px', fontWeight: 600,
                color: hovered ? accent : colors.textLight,
                display: 'flex', alignItems: 'center', gap: '4px',
                transform: hovered ? 'translateX(4px)' : 'translateX(0)',
                transition: 'color 0.3s, transform 0.3s cubic-bezier(0.22,1,0.36,1)',
              }}>
                Voir le projet →
              </span>
            </div>
          </div>
        </Link>
      </TiltCard>
    </Reveal>
  )
}

// ─── Tier 3 Row ───────────────────────────────────────────────────────────────

function Tier3Row({ project, index }: { project: ReturnType<typeof useProjects>['data'][0]; index: number }) {
  const accent = CTX_COLOR[project.context]
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
    >
      <Link to={`/projets/${project.slug}`} style={{ textDecoration: 'none' }}>
        <motion.div
          whileHover={{ x: 6, background: colors.bgCard }}
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '18px 20px', borderRadius: '10px',
            borderBottom: `1px solid ${colors.borderLight}`, cursor: 'pointer',
            transition: 'background 0.15s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontFamily: fonts.body, fontSize: '10px', fontWeight: 700, color: accent, background: `${accent}12`, padding: '3px 9px', borderRadius: '6px', letterSpacing: '0.07em' }}>
              {project.context}
            </span>
            <span style={{ fontFamily: fonts.heading, fontSize: '16px', fontWeight: 500, color: colors.text }}>{project.title}</span>
            <span style={{ fontFamily: fonts.body, fontSize: '13px', color: colors.textMuted }}>{project.subtitle}</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {project.tags.slice(0, 2).map(tag => (
              <span key={tag} style={{ fontFamily: fonts.body, fontSize: '11px', color: colors.textLight }}>{tag}</span>
            ))}
            <span style={{ color: colors.textLight, marginLeft: '8px', fontSize: '14px' }}>→</span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

// ─── Page Projets ─────────────────────────────────────────────────────────────

export default function Projets() {
  const [activeFilter, setActiveFilter] = useState<Filter>('tous')
  const { data: projects } = useProjects()

  const h1Ref      = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const filtersRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (h1Ref.current) {
      animate(h1Ref.current, {
        translateY: ['110%', '0%'],
        opacity: [0, 1],
        duration: 1000,
        ease: 'outExpo',
        delay: 100,
      })
    }
    const fadeEls = [subtitleRef.current, filtersRef.current].filter(Boolean) as HTMLElement[]
    if (fadeEls.length) {
      animate(fadeEls, {
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 800,
        ease: 'outExpo',
        delay: stagger(80, { start: 450 }),
      })
    }
  }, [])

  const filtered = projects.filter(p => activeFilter === 'tous' || p.context === activeFilter)
  const tier1 = filtered.filter(p => p.tier === 1)
  const tier2 = filtered.filter(p => p.tier === 2)
  const tier3 = filtered.filter(p => p.tier === 3)

  return (
    <PageTransition>
      <div style={{ paddingTop: '64px', background: colors.bg, minHeight: '100svh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px, 5vw, 48px)' }}>

          {/* ── Header ── */}
          <section style={{ padding: '80px 0 56px' }}>
            {/* Mask reveal H1 */}
            <div style={{ overflow: 'hidden', marginBottom: '12px' }}>
              <h1 ref={h1Ref} style={{
                fontFamily: fonts.heading, fontSize: 'clamp(52px, 7.5vw, 94px)',
                fontWeight: 400, color: colors.text, margin: 0,
                letterSpacing: '-0.03em', lineHeight: 1.02,
                opacity: 0, transform: 'translateY(110%)',
              }}>
                Projets
              </h1>
            </div>
            <p ref={subtitleRef} style={{
              fontFamily: fonts.body, fontSize: '17px', color: colors.textMuted,
              margin: '0 0 36px', lineHeight: 1.7, opacity: 0, ...justify,
            }}>
              {projects.length} projets · du prototype embarqué au modèle de deep learning.
            </p>

            {/* Filtres */}
            <div ref={filtersRef} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', opacity: 0 }}
            >
              {FILTERS.map(f => {
                const isActive = activeFilter === f.key
                const accent = f.key !== 'tous' ? CTX_COLOR[f.key as ProjectContext] : colors.accent
                return (
                  <motion.button key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    animate={{
                      background: isActive ? accent : colors.bgCard,
                      color: isActive ? colors.bg : colors.textMuted,
                      borderColor: isActive ? accent : colors.border,
                      boxShadow: isActive ? `0 4px 16px ${accent}30` : 'none',
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ padding: '9px 20px', borderRadius: '10px', border: `1.5px solid ${colors.border}`, fontSize: '13px', fontFamily: fonts.body, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.02em' }}
                  >
                    {f.label}
                    {f.key !== 'tous' && (
                      <span style={{ marginLeft: '6px', opacity: 0.65, fontSize: '11px' }}>
                        {projects.filter(p => p.context === f.key).length}
                      </span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </section>

          {/* ── Tier 1 ── */}
          <AnimatePresence mode="wait">
            {tier1.length > 0 && (
              <motion.section key={`t1-${activeFilter}`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ paddingBottom: '80px' }}
              >
                <SectionLabel label="Projets principaux" color={colors.accent} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {tier1.map((p, i) => <Tier1Card key={p.slug} project={p} index={i} />)}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* ── Tier 2 ── */}
          <AnimatePresence mode="wait">
            {tier2.length > 0 && (
              <motion.section key={`t2-${activeFilter}`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                style={{ paddingBottom: '80px' }}
              >
                <SectionLabel label="Autres projets" color={colors.textMuted} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: '16px' }}>
                  {tier2.map(p => <Tier2Card key={p.slug} project={p} />)}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* ── Tier 3 ── */}
          <AnimatePresence mode="wait">
            {tier3.length > 0 && (
              <motion.section key={`t3-${activeFilter}`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{ paddingBottom: '80px' }}
              >
                <SectionLabel label="En bref" color={colors.textLight} />
                <div>
                  {tier3.map((p, i) => <Tier3Row key={p.slug} project={p} index={i} />)}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {tier1.length === 0 && tier2.length === 0 && tier3.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ padding: '80px 0', textAlign: 'center', color: colors.textMuted, fontFamily: fonts.body }}>
                Aucun projet pour ce filtre.
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </PageTransition>
  )
}
