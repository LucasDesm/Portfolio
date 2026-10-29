import { useParams, Link } from 'react-router'
import { useRef, useEffect, lazy, Suspense } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react'
import { animate, stagger } from 'animejs'
import PageTransition from '@/components/PageTransition'
import ThreeBoundary from '@/components/ThreeBoundary'
import { ChainDiagram } from '@/components/ChainDiagram'
import ProjectEvidence from '@/components/ProjectEvidence'
import { colors, fonts, ca, contextColors, justify } from '@/lib/tokens'
import { useProjects } from '@/hooks/useProjects'
import { useParcours } from '@/hooks/useParcours'

const GlycemieExtras = lazy(() => import('@/sections/GlycemieExtras'))

const HandCanvas     = lazy(() => import('@/three/HandCanvas'))
const EthylCanvas    = lazy(() => import('@/three/EthylCanvas'))
const AnemCanvas     = lazy(() => import('@/three/AnemCanvas'))
const CTScanCanvas   = lazy(() => import('@/three/CTScanCanvas'))
const GlycemieCanvas = lazy(() => import('@/three/GlycemieCanvas'))
const AustralCanvas  = lazy(() => import('@/three/AustralCanvas'))
const CTX_COLOR: Record<string, string> = contextColors

// Projets dont le haut de page est une animation (sinon : figure de couverture)
const SCENES: Record<string, React.ReactNode> = {
  'austral-omics':         <AustralCanvas />,
  'ct-scan-deep-learning': <CTScanCanvas />,
  'regulateur-glycemie':   <GlycemieCanvas />,
  'main-robotique-emg':    <HandCanvas />,
  'ethylometre':           <EthylCanvas />,
  'anemometre':            <AnemCanvas />,
}

const TIER_LABEL: Record<number, string> = {
  1: 'Projet phare',
  2: 'Projet solide',
  3: 'Mention',
}

// ─── Scene selector ───────────────────────────────────────────────────────────

function SceneFallback({ ctxColor }: { ctxColor: string }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {[280, 190, 110, 60].map((size, i) => (
        <motion.div key={i}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 20 + i * 8, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', width: size, height: size, borderRadius: '50%', border: `1px solid ${ctxColor}${['12', '1a', '28', '40'][i]}` }}
        />
      ))}
    </div>
  )
}

function ProjectScene({ slug, ctxColor, cover, coverAlt }: { slug: string; ctxColor: string; cover?: string; coverAlt?: string }) {
  const fallback = <SceneFallback ctxColor={ctxColor} />
  const canvas = SCENES[slug]
  if (!canvas && cover) {
    // Figure réelle : rendue dans le flux, la boîte parente prend sa hauteur
    return (
      <div style={{ position: 'relative', zIndex: 2, background: colors.bgCard, padding: 'clamp(12px, 3vw, 32px)' }}>
        <img src={cover} alt={coverAlt ?? ''} style={{ display: 'block', width: '100%', height: 'auto' }} />
      </div>
    )
  }
  if (!canvas) return fallback

  return (
    <ThreeBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        {canvas}
      </Suspense>
    </ThreeBoundary>
  )
}

// ─── ProjetDetail ─────────────────────────────────────────────────────────────

export default function ProjetDetail() {
  const { slug } = useParams()
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: allProjects } = useProjects()
  const { data: parcours } = useParcours()

  const project = allProjects.find(p => p.slug === slug)
  const currentIdx = allProjects.findIndex(p => p.slug === slug)
  const prevProject = currentIdx > 0 ? allProjects[currentIdx - 1] : null
  const nextProject = currentIdx < allProjects.length - 1 ? allProjects[currentIdx + 1] : null

  const linkedStep = project?.linkedParcoursId
    ? parcours?.find(s => s.id === project.linkedParcoursId)
    : null

  const titleRef   = useRef<HTMLHeadingElement>(null)
  const heroRef    = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: containerRef })
  const readingProgress = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  // Anime.js entrance on project load
  useEffect(() => {
    if (!titleRef.current) return
    animate(titleRef.current, {
      translateY: ['100%', '0%'],
      opacity: [0, 1],
      duration: 1100,
      ease: 'outExpo',
      delay: 200,
    })
    const heroEl = heroRef.current
    if (!heroEl) return
    animate(heroEl.querySelectorAll('.ph'), {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      ease: 'outExpo',
      delay: stagger(80, { start: 350 }),
    })
  }, [slug])

  if (!project) {
    return (
      <PageTransition>
        <div style={{ paddingTop: '64px', minHeight: '100svh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontFamily: fonts.heading, fontSize: '48px', fontWeight: 400, color: colors.text, margin: '0 0 16px' }}>Projet introuvable</h1>
            <Link to="/projets" style={{ fontFamily: fonts.body, color: colors.accent, fontSize: '15px', fontWeight: 600 }}>← Retour aux projets</Link>
          </div>
        </div>
      </PageTransition>
    )
  }

  const ctxColor = CTX_COLOR[project.context] ?? colors.textMuted
  const showCover = !SCENES[project.slug] && !!project.cover

  return (
    <PageTransition>
      {/* Barre de lecture */}
      <motion.div style={{ position: 'fixed', top: 0, left: 0, height: 2, width: readingProgress, background: ctxColor, zIndex: 100, transformOrigin: 'left' }} />

      <div ref={containerRef} style={{ paddingTop: '64px', minHeight: '100svh', background: colors.bg }}>

        {/* ── Hero centré ── */}
        <section style={{ padding: '72px 48px 0', maxWidth: '1100px', margin: '0 auto' }}>

          {/* Retour */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            style={{ marginBottom: '64px' }}>
            <Link to="/projets" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: fonts.body, fontSize: '13px', fontWeight: 600, color: colors.textMuted, textDecoration: 'none' }}>
              <motion.span whileHover={{ x: -4 }} transition={{ duration: 0.2 }} style={{ display: 'inline-block' }}>←</motion.span>
              Tous les projets
            </Link>
          </motion.div>

          {/* Bloc centré */}
          <div ref={heroRef} style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto' }}>

            {/* Badges */}
            <div className="ph" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px', opacity: 0 }}>
              <span style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color: ctxColor, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '5px 14px', borderRadius: '20px', background: `${ctxColor}14`, border: `1px solid ${ctxColor}28` }}>
                {project.context}
              </span>
              <span style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 600, color: colors.textMuted, padding: '5px 14px', borderRadius: '20px', background: colors.bgSubtle, border: `1px solid ${colors.border}` }}>
                {TIER_LABEL[project.tier]}
              </span>
            </div>

            {/* Titre — mask reveal anime.js */}
            <div style={{ overflow: 'hidden', marginBottom: '18px' }}>
              <h1 ref={titleRef} style={{
                fontFamily: fonts.heading, fontSize: 'clamp(44px, 5.5vw, 78px)', fontWeight: 400,
                lineHeight: 1.02, letterSpacing: '-0.03em', margin: 0, color: colors.text, hyphens: 'auto', overflowWrap: 'break-word',
                opacity: 0, transform: 'translateY(100%)',
              }}>
                {project.title}
              </h1>
            </div>

            {/* Sous-titre */}
            <p className="ph" style={{
              fontFamily: fonts.body, fontSize: '19px', color: ctxColor,
              margin: '0 0 36px', fontWeight: 500, lineHeight: 1.4, opacity: 0,
            }}>
              {project.subtitle}
            </p>

            {/* Liens */}
            {project.links && project.links.length > 0 && (
              <div className="ph" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', opacity: 0 }}>
                {project.links.map(link => (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <motion.span
                      whileHover={{ scale: 1.04, background: ctxColor, color: colors.bg, borderColor: ctxColor }}
                      whileTap={{ scale: 0.97 }}
                      style={{ display: 'inline-block', fontFamily: fonts.body, fontSize: '13px', fontWeight: 600, color: ctxColor, padding: '10px 22px', borderRadius: '12px', border: `1.5px solid ${ctxColor}40`, background: `${ctxColor}0e`, cursor: 'pointer', transition: 'background 0.18s, color 0.18s, border-color 0.18s' }}>
                      {link.label} ↗
                    </motion.span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Simulation 3D ── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          style={{ padding: '56px 48px 0', maxWidth: '1100px', margin: '0 auto' }}
        >
          <div style={{
            height: showCover ? 'auto' : 'clamp(420px, 52vh, 560px)',
            borderRadius: '20px',
            overflow: 'hidden',
            background: `linear-gradient(145deg, ${ctxColor}07 0%, ${ctxColor}18 60%, ${ctxColor}0a 100%)`,
            border: `1px solid ${ctxColor}25`,
            position: 'relative',
            boxShadow: `0 32px 80px ${ctxColor}18, 0 2px 8px ${ctxColor}0e`,
          }}>
            {/* Dot grid overlay */}
            <div aria-hidden style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
              backgroundImage: `radial-gradient(circle, ${ctxColor}22 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
              maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)',
            }} />
            <ProjectScene slug={project.slug} ctxColor={ctxColor} cover={project.cover} coverAlt={project.figures?.[0]?.alt} />
          </div>
          {showCover && (
            <p style={{ fontFamily: fonts.body, fontSize: '13px', color: colors.textMuted, lineHeight: 1.65, margin: '12px 0 0', maxWidth: '760px', ...justify }}>
              {project.figures?.find(f => f.src === project.cover)?.caption}
            </p>
          )}
        </motion.section>

        {/* ── Highlights ── */}
        {project.highlights && project.highlights.length > 0 && (
          <section style={{ padding: '32px 48px 0', maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${project.highlights.length}, 1fr)`, gap: '14px' }}>
              {project.highlights.map((h, i) => (
                <motion.div key={h.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                  style={{ padding: '26px 22px', borderRadius: '16px', background: colors.bgCard, border: `1px solid ${colors.border}`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, ${ctxColor}, transparent)`, borderRadius: '16px 16px 0 0' }} />
                  <div style={{ fontFamily: fonts.heading, fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 400, color: i === 0 ? ctxColor : colors.text, lineHeight: 1, marginBottom: '6px', letterSpacing: '-0.02em' }}>
                    {h.value}
                  </div>
                  <div style={{ fontFamily: fonts.body, fontSize: '13px', color: colors.textMuted }}>
                    {h.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Chaîne de mesure ── */}
        {project.chain && project.chain.length > 0 && (
          <section style={{ padding: '80px 48px 0', maxWidth: '1100px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 style={{ fontFamily: fonts.heading, fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 400, color: colors.text, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                {project.chainLabel ?? 'Chaîne de mesure'}
              </h2>
              <motion.div
                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
                style={{ height: 1, background: `linear-gradient(to right, ${ctxColor}50, transparent)`, transformOrigin: 'left', marginBottom: '36px', maxWidth: '200px' }}
              />
            </motion.div>
            <ChainDiagram
              steps={project.chain}
              ctxColor={ctxColor}
              feedback={project.chainFeedback}
              label={project.chainLabel}
            />
          </section>
        )}

        {/* ── Extras projet-spécifiques ── */}
        {project.slug === 'regulateur-glycemie' && (
          <Suspense fallback={null}>
            <GlycemieExtras ctxColor={ctxColor} />
          </Suspense>
        )}

        {/* ── Description longue + Technologies ── */}
        {project.longDescription && (
          <section style={{ padding: '80px 48px 0', maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>

              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <h2 style={{ fontFamily: fonts.heading, fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 400, color: colors.text, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                  Détails du projet
                </h2>
                <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
                  style={{ height: 1, background: `linear-gradient(to right, ${ctxColor}50, transparent)`, transformOrigin: 'left', marginBottom: '24px', maxWidth: '200px' }} />
                <p style={{ fontFamily: fonts.body, fontSize: '15.5px', lineHeight: 1.9, color: colors.textMuted, margin: 0, ...justify }}>
                  {project.longDescription}
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
                <h2 style={{ fontFamily: fonts.heading, fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 400, color: colors.text, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                  Technologies
                </h2>
                <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
                  style={{ height: 1, background: `linear-gradient(to right, ${ctxColor}50, transparent)`, transformOrigin: 'left', marginBottom: '24px', maxWidth: '200px' }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {project.tags.map((tag, ti) => (
                    <motion.span key={tag}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: ti * 0.05 }}
                      whileHover={{ scale: 1.06, background: ctxColor, color: colors.bg }}
                      style={{ fontFamily: fonts.body, fontSize: '13px', fontWeight: 500, padding: '8px 16px', borderRadius: '22px', background: `${ctxColor}10`, color: ctxColor, border: `1px solid ${ctxColor}25`, cursor: 'default', transition: 'background 0.18s, color 0.18s' }}>
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

            </div>
          </section>
        )}

        {/* ── Rôle, récit, résultats, figures ── */}
        <ProjectEvidence project={project} accent={ctxColor} coverShown={showCover} />

        {/* ── Parcours lié ── */}
        {linkedStep && (
          <section style={{ padding: '80px 48px 0', maxWidth: '1100px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}>
              <h2 style={{ fontFamily: fonts.heading, fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 400, color: colors.text, margin: '0 0 24px', letterSpacing: '-0.02em' }}>
                Contexte du parcours
              </h2>
              <Link to="/parcours" style={{ textDecoration: 'none' }}>
                <motion.div whileHover={{ boxShadow: `0 20px 56px ${ctxColor}18`, y: -4 }}
                  style={{ padding: '28px 32px', borderRadius: '20px', background: colors.bgCard, border: `1px solid ${colors.border}`, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '14px', background: `${ctxColor}14`, border: `1px solid ${ctxColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.mono, fontWeight: 800, fontSize: '11px', color: ctxColor, flexShrink: 0, letterSpacing: '0.05em' }}>
                      {linkedStep.period.slice(0, 4)}
                    </div>
                    <div>
                      <div style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color: ctxColor, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                        {linkedStep.type === 'formation' ? 'Formation' : linkedStep.type === 'stage' ? 'Stage' : linkedStep.type === 'echange' ? 'Séjour international' : 'Objectif'}
                      </div>
                      <div style={{ fontFamily: fonts.heading, fontSize: '20px', fontWeight: 400, color: colors.text, letterSpacing: '-0.01em', marginBottom: '4px' }}>
                        {linkedStep.title}
                      </div>
                      <div style={{ fontFamily: fonts.body, fontSize: '13px', color: colors.textMuted }}>
                        {linkedStep.institution} · {linkedStep.period} · {linkedStep.location}
                      </div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontFamily: fonts.body, fontSize: '18px', color: ctxColor, flexShrink: 0 }}>→</div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </section>
        )}

        {/* ── Navigation Projets ── */}
        <section style={{ padding: '80px 48px 120px', maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', gap: '16px' }}>

            <div style={{ flex: 1 }}>
              <AnimatePresence>
                {prevProject && (
                  <Link to={`/projets/${prevProject.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <motion.div whileHover={{ x: -6, boxShadow: `0 12px 36px ${ca.text(0.1)}` }}
                      style={{ padding: '20px 24px', borderRadius: '16px', border: `1px solid ${colors.border}`, background: colors.bgCard, cursor: 'pointer', height: '100%', boxSizing: 'border-box' }}>
                      <div style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>← Précédent</div>
                      <div style={{ fontFamily: fonts.heading, fontSize: '17px', fontWeight: 400, color: colors.text }}>{prevProject.title}</div>
                      <div style={{ fontFamily: fonts.body, fontSize: '12px', color: colors.textMuted, marginTop: '4px' }}>{prevProject.subtitle}</div>
                    </motion.div>
                  </Link>
                )}
              </AnimatePresence>
            </div>

            <Link to="/projets" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <motion.div
                whileHover={{ scale: 1.06, background: colors.accent, color: colors.bg, borderColor: colors.accent }}
                style={{ padding: '16px 22px', borderRadius: '14px', border: `1.5px solid ${colors.border}`, background: 'transparent', cursor: 'pointer', fontFamily: fonts.body, fontSize: '13px', fontWeight: 600, color: colors.textMuted, whiteSpace: 'nowrap', transition: 'background 0.18s, color 0.18s, border-color 0.18s' }}>
                Tous ⊞
              </motion.div>
            </Link>

            <div style={{ flex: 1, textAlign: 'right' }}>
              <AnimatePresence>
                {nextProject && (
                  <Link to={`/projets/${nextProject.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <motion.div whileHover={{ x: 6, boxShadow: `0 12px 36px ${ca.text(0.1)}` }}
                      style={{ padding: '20px 24px', borderRadius: '16px', border: `1px solid ${colors.border}`, background: colors.bgCard, cursor: 'pointer', height: '100%', boxSizing: 'border-box' }}>
                      <div style={{ fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Suivant →</div>
                      <div style={{ fontFamily: fonts.heading, fontSize: '17px', fontWeight: 400, color: colors.text }}>{nextProject.title}</div>
                      <div style={{ fontFamily: fonts.body, fontSize: '12px', color: colors.textMuted, marginTop: '4px' }}>{nextProject.subtitle}</div>
                    </motion.div>
                  </Link>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        </section>

      </div>
    </PageTransition>
  )
}
