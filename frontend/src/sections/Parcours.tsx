import { useRef, useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router'
import { motion, useScroll, useTransform, useInView } from 'motion/react'
import PageTransition from '@/components/PageTransition'
import { colors, fonts, ca, typeColors, domainColors, justify } from '@/lib/tokens'
import { type ParcoursStep } from '@/lib/data'
import { useParcours } from '@/hooks/useParcours'
import { useProjects } from '@/hooks/useProjects'
import { useMediaQuery, NARROW } from '@/hooks/useMediaQuery'

// ─── Tokens ───────────────────────────────────────────────────────────────────

const TYPE_COLOR: Record<string, string> = typeColors
const TYPE_LABEL: Record<string, string> = {
  formation: 'Formation',
  stage:     'Stage',
  echange:   'Séjour international',
  cible:     'Prochain objectif',
}

const STEP_LOGOS: Record<string, string> = {
  'but':           '/logos/mesures-physiques.png',
  'du-sante':      '/logos/iut-bordeaux.png',
  'stage-quantum': '/logos/quantum-surgical.png',
  'stage-excell':  '/logos/logo_excell.png',
  'esme':          '/logos/Esme-sudria-logo.png',
  'coree':         '/logos/knu.png',
  'stage-inserm':  '/logos/inserm.png',
}

const STEP_HIGHLIGHTS: Record<string, { value: string; label: string }[]> = {
  'but':           [{ value: '3 ans',      label: 'formation' },        { value: '4',          label: 'projets majeurs' }],
  'du-sante':      [{ value: '2021–2023',  label: 'en parallèle du BUT' }],
  'stage-excell':  [{ value: '12 sem.',    label: 'durée' },            { value: 'Floirac',    label: 'Bordeaux' }],
  'stage-quantum': [{ value: '16 sem.',    label: 'durée' },            { value: 'ISO 17025',  label: 'norme' }],
  'esme':          [{ value: '3 ans',      label: '2024 – 2027' },      { value: 'Biotech',    label: 'spécialisation' }],
  'coree':         [{ value: 'S3 ESME',    label: 'semestre' },         { value: 'Daegu',      label: 'Corée du Sud' }],
  'stage-inserm':  [{ value: '12 sem.',    label: 'durée' },            { value: '61,8 %',     label: 'familles hors banque' }],
  'pfe':           [{ value: '7 avril 2027', label: 'début' },         { value: '6 mois',     label: 'durée visée' }],
}

// ─── Projet mini-card ─────────────────────────────────────────────────────────

function ProjectMiniCard({ slug, accent }: { slug: string; accent: string }) {
  const { data: projects } = useProjects()
  const project = projects.find(p => p.slug === slug)
  if (!project) return null
  return (
    <Link to={`/projets/${project.slug}`} style={{ textDecoration: 'none' }}>
      <motion.div
        whileHover={{ x: 5, boxShadow: `0 6px 24px ${accent}18` }}
        transition={{ duration: 0.18 }}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 15px', borderRadius: '10px', background: colors.bgCard, border: `1px solid ${colors.border}`, cursor: 'pointer' }}
      >
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: accent, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: fonts.body, fontSize: '13px', fontWeight: 600, color: colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {project.title}
          </div>
          <div style={{ fontFamily: fonts.body, fontSize: '11px', color: colors.textMuted }}>{project.subtitle}</div>
        </div>
        <span style={{ fontSize: '13px', color: accent, flexShrink: 0 }}>→</span>
      </motion.div>
    </Link>
  )
}

// ─── Chapitre ─────────────────────────────────────────────────────────────────

function Chapter({ step, index, total, onActive }: {
  step: ParcoursStep; index: number; total: number; onActive: (i: number) => void
}) {
  const ref       = useRef<HTMLDivElement>(null)
  const accent    = TYPE_COLOR[step.type]
  const inView    = useInView(ref, { margin: '-35% 0px -35% 0px', once: false })
  const logo      = STEP_LOGOS[step.id]
  const highlights = STEP_HIGHLIGHTS[step.id] ?? []
  const flip      = index % 2 === 1   // alternance layout
  const narrow    = useMediaQuery(NARROW)   // téléphone : texte puis visuel, sans colonne collante

  useEffect(() => { if (inView) onActive(index) }, [inView, index, onActive])

  return (
    <article
      ref={ref}
      id={`step-${step.id}`}
      style={{ padding: '0 0 72px', position: 'relative' }}
    >
      {/* ── En-tête pleine largeur ── */}
      <div style={{ marginBottom: '36px' }}>

        {/* Ligne de méta : numéro / total + type */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}
        >
          <span style={{ fontFamily: fonts.mono, fontSize: '11px', color: colors.textLight, letterSpacing: '0.14em' }}>
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <motion.span
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.12em', padding: '4px 12px', borderRadius: '20px', background: `${accent}12`, border: `1px solid ${accent}28` }}
          >
            {TYPE_LABEL[step.type]}
          </motion.span>
        </motion.div>

        {/* Titre — wipe gauche→droite */}
        <div style={{ overflow: 'hidden', marginBottom: '14px' }}>
          <motion.h2
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.07 }}
            style={{ fontFamily: fonts.heading, fontSize: 'clamp(38px, 5.5vw, 70px)', fontWeight: 400, color: colors.text, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.04 }}
          >
            {step.title}
          </motion.h2>
        </div>

        {/* Sous-ligne institution + période + lieu */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}
        >
          <span style={{ fontFamily: fonts.body, fontSize: '16px', fontWeight: 600, color: accent }}>{step.institution}</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: colors.border, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontFamily: fonts.mono, fontSize: '13px', color: colors.textLight }}>{step.period}</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: colors.border, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontFamily: fonts.body, fontSize: '13px', color: colors.textLight }}>{step.location}</span>
        </motion.div>

        {/* Ligne de séparation colorée — draw */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          style={{ height: 2, background: `linear-gradient(to right, ${accent}, ${accent}30)`, transformOrigin: 'left', marginTop: '24px', borderRadius: 1 }}
        />
      </div>

      {/* ── Corps : description | visuel (layout alterné) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: narrow ? '1fr' : '1fr 260px',
        gap: narrow ? '28px' : '56px',
        direction: flip && !narrow ? 'rtl' : 'ltr',
      }}>

        {/* Colonne texte */}
        <div style={{ direction: 'ltr' }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            style={{ fontFamily: fonts.body, fontSize: '15.5px', lineHeight: 1.85, color: colors.textMuted, margin: '0 0 28px', ...justify }}
          >
            {step.description}
          </motion.p>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: step.projects?.length ? '28px' : 0 }}>
            {step.tags.map((tag, i) => (
              <motion.span key={tag}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.04, duration: 0.28 }}
                whileHover={{ y: -3, background: `${accent}1c`, color: accent }}
                style={{ fontFamily: fonts.body, fontSize: '12px', fontWeight: 500, padding: '5px 12px', borderRadius: '20px', background: `${accent}0c`, color: accent, border: `1px solid ${accent}1e`, cursor: 'default', transition: 'all 0.15s' }}
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Projets liés */}
          {step.projects && step.projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p style={{ fontFamily: fonts.body, fontSize: '10px', fontWeight: 700, color: colors.textLight, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>
                Projets réalisés
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {step.projects.map(s => <ProjectMiniCard key={s} slug={s} accent={accent} />)}
              </div>
            </motion.div>
          )}
        </div>

        {/* Colonne visuelle */}
        <div style={{ direction: 'ltr', position: narrow ? 'static' : 'sticky', top: '100px', alignSelf: 'start' }}>
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            whileHover={{ y: -4, boxShadow: `0 20px 56px ${accent}1a` }}
            style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '20px', height: '168px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', marginBottom: '10px', boxShadow: `0 4px 18px ${ca.text(0.06)}` }}
          >
            <motion.div animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.65, 0.4] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, ${accent}0e, transparent 65%)` }} />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', width: 170, height: 170, borderRadius: '50%', border: `1px solid ${accent}14`, pointerEvents: 'none' }} />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', width: 110, height: 110, borderRadius: '50%', border: `1px solid ${accent}20`, pointerEvents: 'none' }} />

            {logo ? (
              <img src={logo} alt={step.institution}
                style={{ maxWidth: '140px', maxHeight: '80px', objectFit: 'contain', position: 'relative', zIndex: 1 }}
              />
            ) : (
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{ fontFamily: fonts.heading, fontSize: '44px', fontWeight: 300, color: accent, opacity: 0.3, lineHeight: 1 }}>
                  {step.type === 'cible' ? '◎' : step.type === 'stage' ? '◆' : '○'}
                </div>
              </div>
            )}
          </motion.div>

          {/* Highlights */}
          {highlights.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(highlights.length, 2)}, 1fr)`, gap: '7px' }}>
              {highlights.map((h, i) => (
                <motion.div key={h.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                  style={{ background: `${accent}08`, border: `1px solid ${accent}18`, borderRadius: '12px', padding: '12px 10px', textAlign: 'center' }}
                >
                  <div style={{ fontFamily: fonts.heading, fontSize: '18px', fontWeight: 400, color: accent, letterSpacing: '-0.01em', lineHeight: 1 }}>{h.value}</div>
                  <div style={{ fontFamily: fonts.body, fontSize: '10px', color: colors.textMuted, marginTop: '2px' }}>{h.label}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Séparateur entre chapitres ── */}
      {index < total - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '72px' }}
        >
          <div style={{ flex: 1, height: 1, background: colors.borderLight }} />
          <span style={{ fontFamily: fonts.mono, fontSize: '10px', color: colors.textLight, letterSpacing: '0.14em' }}>
            {String(index + 2).padStart(2, '0')}
          </span>
          <div style={{ flex: 1, height: 1, background: colors.borderLight }} />
        </motion.div>
      )}
    </article>
  )
}

// ─── Compétences ─────────────────────────────────────────────────────────────

const SKILLS_GROUPS = [
  { label: 'Machine Learning & IA',        color: domainColors.ml,         skills: ['PyTorch', 'Scikit-learn', 'Transfer Learning', 'CNN', 'Python', 'Pandas'] },
  { label: 'Bio-informatique',             color: domainColors.bio,        skills: ['Séquençage Nanopore', 'Metabarcoding 16S / COI', 'vsearch', 'SILVA / BOLD', 'R', 'Linux · Slurm'] },
  { label: 'Embarqué & Instrumentation',   color: domainColors.embarque,   skills: ['Arduino', 'C/C++', 'MATLAB', 'Simulink', 'LabVIEW', 'Capteurs', 'Métrologie ISO 17025', 'Électronique'] },
  { label: 'Développement web & logiciel', color: domainColors.web,        skills: ['React', 'TypeScript', 'Vite', 'Spring Boot', 'Rust', 'Three.js', 'REST API', 'PostgreSQL'] },
  { label: 'Conception & Fabrication',     color: domainColors.cao,        skills: ['SolidWorks', 'CAO 3D', 'Impression 3D', 'Blender', 'Prototypage'] },
  { label: 'Biomédical & Réglementaire',   color: domainColors.biomedical, skills: ['Dispositifs médicaux', 'RGPD', 'BizzMine', 'Qualité', 'Métrologie'] },
]

function Competences() {
  return (
    <section style={{ padding: '100px 0 100px', borderTop: `2px solid ${colors.border}` }}>
      <div style={{ marginBottom: '60px' }}>
        <motion.div
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 style={{ fontFamily: fonts.heading, fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 400, color: colors.text, margin: '0 0 10px', letterSpacing: '-0.025em' }}>
            Compétences
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ fontFamily: fonts.body, fontSize: '15px', color: colors.textMuted, margin: 0 }}
        >
          Construites à travers chaque étape du parcours.
        </motion.p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {SKILLS_GROUPS.map((group, gi) => (
          <motion.div key={group.label}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: gi * 0.06 }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 32px', alignItems: 'flex-start' }}>
              <div style={{ flex: '0 0 200px' }}>
                <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: gi * 0.06 }}
                  style={{ width: 24, height: 2, borderRadius: 1, background: group.color, marginBottom: '8px', transformOrigin: 'left' }} />
                <span style={{ fontFamily: fonts.body, fontSize: '13px', fontWeight: 600, color: colors.text, lineHeight: 1.4 }}>
                  {group.label}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', paddingTop: '2px' }}>
                {group.skills.map((skill, i) => (
                  <motion.span key={skill}
                    initial={{ opacity: 0, scale: 0.88 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: gi * 0.04 + i * 0.03, duration: 0.26 }}
                    whileHover={{ y: -3, background: `${group.color}1c`, color: group.color, borderColor: `${group.color}35` }}
                    style={{ fontFamily: fonts.body, fontSize: '12.5px', fontWeight: 500, padding: '6px 14px', borderRadius: '8px', background: colors.bgSubtle, color: colors.textMuted, border: `1px solid ${colors.borderLight}`, cursor: 'default', transition: 'all 0.15s' }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─── Sidebar indicator ────────────────────────────────────────────────────────

function SidebarIndicator({ active, steps }: { active: number; steps: ParcoursStep[] }) {
  return (
    <div style={{ position: 'fixed', right: '36px', top: '50%', transform: 'translateY(-50%)', zIndex: 40, display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
      {steps.map((step, i) => {
        const accent = TYPE_COLOR[step.type]
        const isActive = i === active
        return (
          <a key={step.id} href={`#step-${step.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={e => { e.preventDefault(); document.getElementById(`step-${step.id}`)?.scrollIntoView({ behavior: 'smooth' }) }}>
            <motion.span animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 10 }} transition={{ duration: 0.22 }}
              style={{ fontFamily: fonts.mono, fontSize: '10px', color: accent, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
              {step.period.split('–')[0].trim()}
            </motion.span>
            <motion.div
              animate={{ width: isActive ? 24 : 6, background: isActive ? accent : colors.borderLight }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: 2, borderRadius: 1 }} />
          </a>
        )
      })}
    </div>
  )
}

// ─── Intro ────────────────────────────────────────────────────────────────────

function Intro() {
  const { scrollYProgress } = useScroll()
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])
  const { data: parcours } = useParcours()

  return (
    <section style={{ paddingTop: '130px', paddingBottom: '80px' }}>
      {/* Barre de lecture dégradée */}
      <motion.div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 100,
        background: `linear-gradient(to right, ${typeColors.formation}, ${typeColors.stage}, ${typeColors.echange}, ${typeColors.cible})`,
        scaleX: lineScale, transformOrigin: 'left',
      }} />

      {/* Badges */}
      <motion.div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
        {['3 formations', '3 stages', '1 séjour international', '6 ans'].map((s, i) => (
          <motion.span key={s}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.45 }}
            style={{ fontFamily: fonts.body, fontSize: '12px', fontWeight: 600, color: colors.accent, background: colors.accentLight, padding: '4px 12px', borderRadius: '20px', border: `1px solid ${ca.accent(0.2)}` }}
          >
            {s}
          </motion.span>
        ))}
      </motion.div>

      {/* Titre — wipe */}
      <div style={{ overflow: 'hidden', marginBottom: '6px' }}>
        <motion.h1
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          style={{ fontFamily: fonts.heading, fontSize: 'clamp(52px, 7.5vw, 96px)', fontWeight: 400, color: colors.text, margin: 0, letterSpacing: '-0.035em', lineHeight: 1.02 }}
        >
          Un parcours
        </motion.h1>
      </div>
      <div style={{ overflow: 'hidden', marginBottom: '32px' }}>
        <motion.h1
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{ fontFamily: fonts.heading, fontSize: 'clamp(52px, 7.5vw, 96px)', fontWeight: 300, fontStyle: 'italic', color: colors.textMuted, margin: 0, letterSpacing: '-0.035em', lineHeight: 1.02 }}
        >
          en trois actes.
        </motion.h1>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ fontFamily: fonts.body, fontSize: '17px', lineHeight: 1.8, color: colors.textMuted, maxWidth: '520px', margin: '0 0 56px', ...justify }}
      >
        De la mesure physique à l'intelligence artificielle médicale : trois formations complémentaires, trois stages, un semestre en Corée du Sud.
      </motion.p>

      {/* Frise des étapes */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.6 }}
        style={{ display: 'flex', alignItems: 'center', gap: 0 }}
      >
        {parcours.map((step, i) => {
          const c = TYPE_COLOR[step.type]
          return (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
              <a href={`#step-${step.id}`} style={{ textDecoration: 'none' }}
                onClick={e => { e.preventDefault(); document.getElementById(`step-${step.id}`)?.scrollIntoView({ behavior: 'smooth' }) }}>
                <motion.div whileHover={{ scale: 1.4, y: -5 }} transition={{ duration: 0.18 }}
                  title={step.title}
                  style={{ width: 12, height: 12, borderRadius: '50%', background: step.done ? c : 'transparent', border: `2px solid ${c}`, cursor: 'pointer', boxShadow: step.done ? `0 0 0 3px ${c}1e` : 'none' }} />
              </a>
              {i < parcours.length - 1 && (
                <div style={{ width: 36, height: 1, background: `linear-gradient(to right, ${c}50, ${TYPE_COLOR[parcours[i + 1].type]}50)` }} />
              )}
            </div>
          )
        })}
      </motion.div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Parcours() {
  const [activeStep, setActiveStep] = useState(0)
  const handleActive = useCallback((i: number) => setActiveStep(i), [])
  const { data: parcours } = useParcours()
  const narrow = useMediaQuery(NARROW)

  return (
    <PageTransition>
      <div style={{ paddingTop: '64px', background: colors.bg, minHeight: '100svh' }}>
        {!narrow && <SidebarIndicator active={activeStep} steps={parcours} />}

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 clamp(16px, 5vw, 48px)' }}>
          <Intro />

          {/* Séparateur d'entrée */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px' }}>
            <div style={{ flex: 1, height: 1, background: colors.borderLight }} />
            <span style={{ fontFamily: fonts.mono, fontSize: '10px', color: colors.textLight, letterSpacing: '0.14em' }}>01</span>
            <div style={{ flex: 1, height: 1, background: colors.borderLight }} />
          </div>

          <div>
            {parcours.map((step, i) => (
              <Chapter key={step.id} step={step} index={i} total={parcours.length} onActive={handleActive} />
            ))}
          </div>

          <Competences />
        </div>
      </div>
    </PageTransition>
  )
}
