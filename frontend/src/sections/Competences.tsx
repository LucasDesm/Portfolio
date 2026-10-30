import { useRef, useEffect } from 'react'
import { motion, useInView, useScroll, useSpring, useTransform } from 'motion/react'
import { animate, stagger } from 'animejs'
import { Link } from 'react-router'
import PageTransition from '@/components/PageTransition'
import { colors, fonts, ca, domainColors, justify } from '@/lib/tokens'

// ─── Données ──────────────────────────────────────────────────────────────────

const RADAR_AXES = [
  { label: 'ML & IA',         shortLabel: 'ML / IA',       score: 0.82, color: domainColors.ml,         sublabel: 'PyTorch · CNN · Transfer learning' },
  { label: 'Embarqué',        shortLabel: 'Embarqué',      score: 0.88, color: domainColors.embarque,   sublabel: 'Arduino · MATLAB · Métrologie' },
  { label: 'Biomédical',      shortLabel: 'Biomédical',    score: 0.80, color: domainColors.biomedical, sublabel: 'DM · Qualité · Métrologie' },
  { label: 'Conception CAO',  shortLabel: 'CAO',           score: 0.65, color: domainColors.cao,        sublabel: 'SolidWorks · Blender · Proto.' },
  { label: 'Web & Logiciel',  shortLabel: 'Web',           score: 0.72, color: domainColors.web,        sublabel: 'React · Spring Boot · Rust' },
]

const SKILLS_GROUPS = [
  {
    label: 'Machine Learning & IA',
    color: domainColors.ml,
    score: 82,
    skills: [
      { name: 'PyTorch', level: 85 },
      { name: 'Scikit-learn', level: 88 }, { name: 'Python', level: 90 },
      { name: 'CNN', level: 80 }, { name: 'Transfer Learning', level: 78 },
      { name: 'Pandas / NumPy', level: 88 },
    ],
  },
  {
    label: 'Embarqué & Instrumentation',
    color: domainColors.embarque,
    score: 88,
    skills: [
      { name: 'Arduino / C++', level: 90 }, { name: 'MATLAB', level: 85 },
      { name: 'LabVIEW', level: 75 }, { name: 'Simulink', level: 72 },
      { name: 'Métrologie ISO 17025', level: 82 }, { name: 'Capteurs', level: 88 },
      { name: 'Électronique', level: 78 }, { name: 'Traitement du signal', level: 80 },
    ],
  },
  {
    label: 'Web & Développement',
    color: domainColors.web,
    score: 72,
    skills: [
      { name: 'React / TypeScript', level: 75 }, { name: 'Spring Boot', level: 70 },
      { name: 'Rust / Axum', level: 62 }, { name: 'Three.js / R3F', level: 65 },
      { name: 'REST API', level: 78 }, { name: 'PostgreSQL', level: 65 },
      { name: 'Tailwind CSS', level: 72 }, { name: 'Git', level: 82 },
    ],
  },
  {
    label: 'Conception & Fabrication',
    color: domainColors.cao,
    score: 65,
    skills: [
      { name: 'SolidWorks', level: 72 }, { name: 'CAO 3D', level: 70 },
      { name: 'Impression 3D', level: 68 }, { name: 'Blender', level: 60 },
      { name: 'Prototypage', level: 75 }, { name: 'Dessin technique', level: 65 },
    ],
  },
  {
    label: 'Biomédical & Réglementaire',
    color: domainColors.biomedical,
    score: 80,
    skills: [
      { name: 'Dispositifs médicaux', level: 82 },
      { name: 'RGPD', level: 72 },
      { name: 'BizzMine / QMS', level: 65 }, { name: 'Qualité / Audit', level: 78 },
    ],
  },
]

// ─── Radar chart SVG ──────────────────────────────────────────────────────────

const N   = RADAR_AXES.length
const CX  = 185
const CY  = 190
const R   = 128
const LABEL_R = R + 30

function radarPoint(i: number, r: number) {
  const angle = -Math.PI / 2 + (2 * Math.PI / N) * i
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) }
}

function labelAnchor(i: number): { anchor: 'start' | 'middle' | 'end'; dy: number } {
  const angle = -Math.PI / 2 + (2 * Math.PI / N) * i
  const cosA  = Math.cos(angle)
  if (cosA > 0.25)  return { anchor: 'start', dy: 0 }
  if (cosA < -0.25) return { anchor: 'end', dy: 0 }
  return { anchor: 'middle', dy: Math.sin(angle) < 0 ? -4 : 6 }
}

function RadarChart() {
  const svgRef  = useRef<SVGSVGElement>(null)
  const inView  = useInView(svgRef, { once: true, margin: '-15% 0px' })
  const progress = useSpring(0, { stiffness: 52, damping: 18, mass: 0.5 })

  useEffect(() => { if (inView) progress.set(1) }, [inView])

  const filledPoints = useTransform(progress, p =>
    RADAR_AXES.map((ax, i) => {
      const pt = radarPoint(i, R * ax.score * p)
      return `${pt.x},${pt.y}`
    }).join(' ')
  )

  const gridLevels = [0.25, 0.5, 0.75, 1.0]

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 370 380"
      style={{ width: '100%', maxWidth: 370, overflow: 'visible' }}
    >
      {/* Grid polygons */}
      {gridLevels.map(level => {
        const pts = RADAR_AXES.map((_, i) => {
          const p = radarPoint(i, R * level)
          return `${p.x},${p.y}`
        }).join(' ')
        return (
          <polygon key={level} points={pts}
            fill="none"
            stroke={ca.border(level === 1.0 ? 0.5 : 0.3)}
            strokeWidth={level === 1.0 ? 1 : 0.6}
            strokeDasharray={level < 1.0 ? '3 3' : undefined}
          />
        )
      })}

      {/* Axis lines */}
      {RADAR_AXES.map((_, i) => {
        const p = radarPoint(i, R)
        return (
          <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y}
            stroke={ca.border(0.35)} strokeWidth={0.7} />
        )
      })}

      {/* Grid level labels (25%, 50%, 75%) */}
      {[0.25, 0.5, 0.75].map(level => {
        const p = radarPoint(0, R * level)
        return (
          <text key={level}
            x={p.x + 6} y={p.y}
            fontSize={9} fill={colors.textMuted} fontFamily={fonts.mono}
            dominantBaseline="middle"
          >
            {Math.round(level * 100)}%
          </text>
        )
      })}

      {/* Filled area — animated */}
      <motion.polygon
        points={filledPoints}
        fill={ca.accent(0.10)}
        stroke={colors.accent}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Vertex dots */}
      {RADAR_AXES.map((ax, i) => {
        const pt = radarPoint(i, R * ax.score)
        return (
          <motion.circle key={i}
            cx={pt.x} cy={pt.y} r={5}
            fill={ax.color}
            stroke={colors.bgCard}
            strokeWidth={2}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.35, delay: 0.7 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
          />
        )
      })}

      {/* Labels */}
      {RADAR_AXES.map((ax, i) => {
        const pt   = radarPoint(i, LABEL_R)
        const { anchor, dy } = labelAnchor(i)
        const score = radarPoint(i, R * ax.score)
        return (
          <g key={i}>
            <motion.text
              x={pt.x} y={pt.y + dy}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize={11.5}
              fontWeight={650}
              fontFamily={fonts.body}
              fill={ax.color}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.07 }}
            >
              {ax.label}
            </motion.text>
            <motion.text
              x={pt.x} y={pt.y + dy + 15}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize={9}
              fontFamily={fonts.body}
              fill={colors.textMuted}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.07 }}
            >
              {ax.sublabel}
            </motion.text>
            {/* Score badge near vertex */}
            <motion.text
              x={score.x + (Math.cos(-Math.PI/2 + 2*Math.PI/N*i) > 0 ? 10 : -10)}
              y={score.y + (Math.sin(-Math.PI/2 + 2*Math.PI/N*i) > 0 ? 10 : -6)}
              textAnchor={Math.cos(-Math.PI/2 + 2*Math.PI/N*i) > 0 ? 'start' : 'end'}
              fontSize={9.5}
              fontWeight={700}
              fontFamily={fonts.mono}
              fill={ax.color}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.9 + i * 0.06 }}
            >
              {Math.round(ax.score * 100)}%
            </motion.text>
          </g>
        )
      })}

      {/* Center dot */}
      <circle cx={CX} cy={CY} r={3} fill={ca.accent(0.4)} />
    </svg>
  )
}

// ─── Carte groupe de compétences ──────────────────────────────────────────────

function SkillGroupCard({ group, index }: { group: typeof SKILLS_GROUPS[0]; index: number }) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const fillsRef = useRef<HTMLDivElement>(null)
  const inView   = useInView(cardRef, { once: true, margin: '-10% 0px' })
  const inViewFills = useInView(fillsRef, { once: true, margin: '-5% 0px' })

  // Stagger entrée des barres avec anime.js
  useEffect(() => {
    if (!inViewFills || !fillsRef.current) return
    const fills = fillsRef.current.querySelectorAll<HTMLElement>('.bar-fill')
    animate(fills, {
      width: (el: HTMLElement) => el.dataset.level + '%',
      ease: 'outExpo',
      duration: 850,
      delay: stagger(55, { start: 120 }),
    })
  }, [inViewFills])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 }}
      style={{
        background: colors.bgCard,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        padding: '28px 28px',
        boxShadow: `0 2px 12px ${ca.text(0.04)}`,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.07 + 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: 28, height: 3, borderRadius: 2, background: group.color, transformOrigin: 'left' }}
          />
          <span style={{ fontFamily: fonts.body, fontSize: '14px', fontWeight: 700, color: colors.text }}>
            {group.label}
          </span>
        </div>
        <span style={{
          fontFamily: fonts.mono, fontSize: '11px', fontWeight: 700,
          color: group.color, background: `${group.color}14`,
          padding: '3px 10px', borderRadius: '20px',
          border: `1px solid ${group.color}28`,
        }}>
          {group.score}%
        </span>
      </div>

      {/* Barres — stagger anime.js coordonné */}
      <div ref={fillsRef} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {group.skills.map((skill) => (
          <div key={skill.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: fonts.body, fontSize: '12px', fontWeight: 500, color: colors.textMuted, width: '140px', flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {skill.name}
            </span>
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: ca.border(0.35), position: 'relative', overflow: 'hidden' }}>
              <div
                className="bar-fill"
                data-level={skill.level}
                style={{ position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 2, background: group.color, width: '0%' }}
              />
            </div>
            <span style={{ fontFamily: fonts.mono, fontSize: '10px', color: group.color, width: '30px', textAlign: 'right', flexShrink: 0 }}>
              {skill.level}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const { scrollYProgress } = useScroll()
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  const stats = [
    { value: '5', label: 'domaines' },
    { value: '30+', label: 'outils utilisés en projet' },
    { value: '6 ans', label: "d'apprentissage" },
    { value: '2027', label: 'objectif PFE' },
  ]

  return (
    <section style={{ paddingTop: '130px', paddingBottom: '80px' }}>
      {/* Barre de lecture */}
      <motion.div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 100,
        background: `linear-gradient(to right, ${domainColors.ml}, ${domainColors.embarque}, ${domainColors.biomedical}, ${domainColors.web})`,
        scaleX: lineScale, transformOrigin: 'left',
      }} />

      {/* Badges */}
      <motion.div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
        {['5 domaines', '30+ outils utilisés', 'ML · Embarqué · Biomédical', 'PFE 2027'].map((s, i) => (
          <motion.span key={s}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.07, duration: 0.45 }}
            style={{ fontFamily: fonts.body, fontSize: '12px', fontWeight: 600, color: colors.accent, background: colors.accentLight, padding: '4px 12px', borderRadius: '20px', border: `1px solid ${ca.accent(0.2)}` }}
          >
            {s}
          </motion.span>
        ))}
      </motion.div>

      {/* Titre */}
      <div style={{ overflow: 'hidden', marginBottom: '6px' }}>
        <motion.h1
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          style={{ fontFamily: fonts.heading, fontSize: 'clamp(52px, 7.5vw, 96px)', fontWeight: 400, color: colors.text, margin: 0, letterSpacing: '-0.035em', lineHeight: 1.02 }}
        >
          Compétences
        </motion.h1>
      </div>
      <div style={{ overflow: 'hidden', marginBottom: '36px' }}>
        <motion.h1
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{ fontFamily: fonts.heading, fontSize: 'clamp(52px, 7.5vw, 96px)', fontWeight: 300, fontStyle: 'italic', color: colors.textMuted, margin: 0, letterSpacing: '-0.035em', lineHeight: 1.02 }}
        >
          & outils.
        </motion.h1>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.6 }}
        style={{ fontFamily: fonts.body, fontSize: '17px', lineHeight: 1.8, color: colors.textMuted, maxWidth: '500px', margin: '0 0 56px', ...justify }}
      >
        De la mesure physique à l'intelligence artificielle médicale : cinq domaines
        construits à travers chaque formation et chaque stage.
      </motion.p>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.6 }}
        style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}
      >
        {stats.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + i * 0.06 }}
          >
            <div style={{ fontFamily: fonts.heading, fontSize: '28px', fontWeight: 400, color: colors.text, letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontFamily: fonts.body, fontSize: '11px', color: colors.textMuted, fontWeight: 500, marginTop: '2px' }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

// ─── Section radar + légende ──────────────────────────────────────────────────

function RadarSection() {
  return (
    <section style={{ padding: '80px 0', borderTop: `1px solid ${colors.borderLight}` }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '48px' }}
      >
        <h2 style={{ fontFamily: fonts.heading, fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 400, color: colors.text, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Vue d'ensemble
        </h2>
        <p style={{ fontFamily: fonts.body, fontSize: '14px', color: colors.textMuted, margin: 0, ...justify }}>
          Niveau relatif par domaine, autoévalué honnêtement.
        </p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 370px) 1fr',
        gap: '64px',
        alignItems: 'center',
      }}>
        {/* Radar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <RadarChart />
        </motion.div>

        {/* Barres résumé */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {RADAR_AXES.map((ax, i) => (
            <RadarLegendRow key={ax.label} axis={ax} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function RadarLegendRow({ axis, index }: { axis: typeof RADAR_AXES[0]; index: number }) {
  const ref     = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const inView  = useInView(ref, { once: true, margin: '-5% 0px' })

  useEffect(() => {
    if (!inView || !fillRef.current) return
    animate(fillRef.current, {
      width: `${Math.round(axis.score * 100)}%`,
      ease: 'outExpo',
      duration: 1000,
      delay: index * 70,
    })
  }, [inView])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
        <span style={{ fontFamily: fonts.body, fontSize: '13px', fontWeight: 600, color: colors.text }}>
          {axis.label}
        </span>
        <span style={{ fontFamily: fonts.mono, fontSize: '12px', fontWeight: 700, color: axis.color }}>
          {Math.round(axis.score * 100)}%
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: ca.border(0.3), overflow: 'hidden', position: 'relative' }}>
        <div
          ref={fillRef}
          style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            borderRadius: 3,
            background: `linear-gradient(to right, ${axis.color}cc, ${axis.color})`,
            width: '0%',
          }}
        />
      </div>
      <p style={{ fontFamily: fonts.body, fontSize: '11px', color: colors.textLight, margin: '6px 0 0' }}>
        {axis.sublabel}
      </p>
    </motion.div>
  )
}

// ─── Section détail ────────────────────────────────────────────────────────────

function DetailSection() {
  return (
    <section style={{ padding: '80px 0 100px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '48px' }}
      >
        <h2 style={{ fontFamily: fonts.heading, fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 400, color: colors.text, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Détail par domaine
        </h2>
        <p style={{ fontFamily: fonts.body, fontSize: '14px', color: colors.textMuted, margin: 0, ...justify }}>
          Outils et technologies utilisés en projet ou en stage.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '20px' }}>
        {SKILLS_GROUPS.map((group, i) => (
          <SkillGroupCard key={group.label} group={group} index={i} />
        ))}
      </div>
    </section>
  )
}

// ─── Majeure Biotech & Numérique : modules du syllabus ESME ──────────────────
// Ingé2 : modules suivis (acquis). Ingé3 : en cours d'acquisition.
// Pas de niveau chiffré : ce sont des contenus de formation, distincts des compétences prouvées plus haut.

type Unit = { ue: string; label: string; color: string; modules: { name: string; notions: string }[] }

const INGE2: Unit[] = [
  {
    ue: 'UE1',
    label: 'Imagerie, vision et Big Data',
    color: domainColors.ml,
    modules: [
      { name: 'Techniques d\'imagerie biomédicale', notions: 'IRM, scanner, radiologie X, échographie, TEP ; imagerie morphologique et fonctionnelle' },
      { name: 'Traitement et analyse d\'images', notions: 'morphologie mathématique, filtrage, histogrammes, format DICOM' },
      { name: 'Machine Learning', notions: 'choix et évaluation de modèles, méthodes d\'ensemble, Python' },
      { name: 'Introduction au Big Data', notions: 'Hadoop, HDFS, MapReduce, fouille de données' },
      { name: 'Données non structurées', notions: 'NoSQL : MongoDB, Cassandra, Neo4j, Redis' },
    ],
  },
  {
    ue: 'UE2',
    label: 'E-santé et santé connectée',
    color: domainColors.embarque,
    modules: [
      { name: 'Capteurs et signaux physiologiques', notions: 'conditionnement du signal, étalonnage et calcul d\'incertitude, Arduino, Python' },
      { name: 'Dispositifs médicaux pour l\'e-santé', notions: 'réglementation, RGPD, normes, recommandations de la HAS' },
      { name: 'E-santé et santé mobile', notions: 'réseaux de communication, chiffrement, confidentialité des données' },
      { name: 'Interfaces cerveau-ordinateur', notions: 'acquisition EEG, classification supervisée' },
      { name: 'UX design et IHM en santé', notions: 'processus UX appliqué aux applications de santé' },
      { name: 'Ingénierie des dispositifs cardiaques', notions: 'conception d\'un dispositif médical actif implantable' },
    ],
  },
]

const INGE3: Unit[] = [
  {
    ue: 'UE1',
    label: 'Vision, réalité virtuelle et réalité augmentée',
    color: domainColors.embarque,
    modules: [
      { name: 'Modélisation et simulation', notions: 'démarche ASME V&V40, jumeaux numériques, simulation sous SolidWorks' },
      { name: 'Vision et réalité augmentée', notions: 'détection et suivi d\'objets, calibration de caméra, reconstruction 3D' },
      { name: 'Réalité virtuelle immersive', notions: 'interaction 3D, déploiement sur casque de réalité virtuelle' },
      { name: 'Thérapie par le jeu', notions: 'informatique physiologique, interfaces cerveau-ordinateur' },
    ],
  },
  {
    ue: 'UE2',
    label: 'Data Analytics',
    color: domainColors.ml,
    modules: [
      { name: 'Deep Learning', notions: 'réseaux de neurones, vision par ordinateur, réglage des hyperparamètres' },
      { name: 'Apprentissage non supervisé', notions: 'ACP, k-means, DBSCAN, classification hiérarchique' },
      { name: 'NLP en santé', notions: 'vectorisation de texte, modèles ML et DL, explicabilité' },
      { name: 'Modèles formels pour le Big Data', notions: 'fondements de l\'apprentissage supervisé, langage R' },
      { name: 'Big Data et microbiote', notions: 'stratégies thérapeutiques, enjeux réglementaires et éthiques' },
    ],
  },
  {
    ue: 'UE3',
    label: 'Écosystème, SI et sécurité en santé',
    color: domainColors.biomedical,
    modules: [
      { name: 'Gestion du risque patient', notions: 'analyse de risque d\'un dispositif médical, matériovigilance' },
      { name: 'Cybersécurité de la santé', notions: 'réseaux de soins, sécurité des données' },
      { name: 'Systèmes d\'information hospitaliers', notions: 'SIH, PACS' },
      { name: 'Systèmes de santé et modèles économiques', notions: 'acteurs, financement, projet entrepreneurial en santé' },
      { name: 'Qualité en entreprise', notions: 'objectifs qualité, interaction avec le département qualité' },
    ],
  },
]

function CurriculumSection({ title, status, statusColor, intro, units, links }: {
  title: string
  status: string
  statusColor: string
  intro: string
  units: Unit[]
  links: { kicker: string; label: string; to: string; color: string }[]
}) {
  return (
    <section style={{ padding: '80px 0 0', borderTop: `1px solid ${colors.borderLight}` }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '48px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', margin: '0 0 8px' }}>
          <h2 style={{ fontFamily: fonts.heading, fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 400, color: colors.text, margin: 0, letterSpacing: '-0.02em' }}>
            {title}
          </h2>
          <span style={{ fontFamily: fonts.body, fontSize: '12px', fontWeight: 600, color: statusColor, background: `${statusColor}14`, padding: '4px 12px', borderRadius: '20px', border: `1px solid ${statusColor}33` }}>
            {status}
          </span>
        </div>
        <p style={{ fontFamily: fonts.body, fontSize: '14px', lineHeight: 1.75, color: colors.textMuted, margin: 0, maxWidth: '640px', ...justify }}>
          {intro}
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))', gap: '20px' }}>
        {units.map((ue, i) => (
          <motion.div key={ue.ue}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
            style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '26px 26px 22px', boxShadow: `0 2px 12px ${ca.text(0.04)}` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ width: 28, height: 3, borderRadius: 2, background: ue.color, flexShrink: 0 }} />
              <span style={{ fontFamily: fonts.mono, fontSize: '11px', fontWeight: 700, color: ue.color, letterSpacing: '0.08em' }}>{ue.ue}</span>
            </div>
            <h3 style={{ fontFamily: fonts.body, fontSize: '15px', fontWeight: 700, color: colors.text, margin: '0 0 16px', lineHeight: 1.35 }}>
              {ue.label}
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ue.modules.map(m => (
                <li key={m.name}>
                  <div style={{ fontFamily: fonts.body, fontSize: '13px', fontWeight: 600, color: colors.text }}>{m.name}</div>
                  <div style={{ fontFamily: fonts.body, fontSize: '12px', lineHeight: 1.55, color: colors.textMuted, marginTop: '2px' }}>{m.notions}</div>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Mise en pratique : projet et stage de l'année */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
        {links.map(l => (
          <Link key={l.to} to={l.to} style={{ flex: '1 1 min(100%, 300px)', textDecoration: 'none', padding: '16px 20px', borderRadius: '14px', background: colors.bgCard, border: `1px solid ${colors.border}` }}>
            <div style={{ fontFamily: fonts.mono, fontSize: '10px', color: colors.textLight, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>{l.kicker}</div>
            <div style={{ fontFamily: fonts.body, fontSize: '14px', fontWeight: 600, color: l.color }}>{l.label} →</div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function CurriculumSections() {
  return (
    <div style={{ paddingBottom: '100px', display: 'flex', flexDirection: 'column', gap: '80px' }}>
      <CurriculumSection
        title="L'an dernier"
        status="acquis · 2025–2026"
        statusColor={colors.olive}
        intro="Première année de la majeure Biotech & Numérique à l'ESME : modules suivis, mis en pratique dans le projet CT-Scan et le stage à l'INSERM."
        units={INGE2}
        links={[
          { kicker: 'Projet d\'application', label: 'CT-Scan & Deep Learning', to: '/projets/ct-scan-deep-learning', color: colors.accent },
          { kicker: 'Stage d\'application', label: 'Bio-informatique · INSERM', to: '/stages/inserm-mrgm', color: colors.rust },
        ]}
      />
      <CurriculumSection
        title="Cette année"
        status="en cours · 2026–2027"
        statusColor={colors.accent}
        intro="Dernière année de la majeure Biotech & Numérique à l'ESME : compétences en cours d'acquisition, en parallèle du projet de recherche mené avec l'Institut Curie."
        units={INGE3}
        links={[
          { kicker: 'Projet d\'innovation et de recherche', label: 'Analyse d\'images de cellules · Institut Curie', to: '/projets/institut-curie', color: colors.accent },
          { kicker: 'Stage ingénieur', label: 'PFE de 6 mois à partir du 7 avril 2027', to: '/contact', color: colors.rust },
        ]}
      />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Competences() {
  return (
    <PageTransition>
      <div style={{ paddingTop: '64px', background: colors.bg, minHeight: '100svh' }}>
        <div style={{ maxWidth: '1020px', margin: '0 auto', padding: '0 48px' }}>
          <Hero />
          <RadarSection />
          <DetailSection />
          <CurriculumSections />
        </div>
      </div>
    </PageTransition>
  )
}
