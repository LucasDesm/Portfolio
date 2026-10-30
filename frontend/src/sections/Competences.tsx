import { Link } from 'react-router'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import PageTransition from '@/components/PageTransition'
import { colors, fonts, ca, domainColors, justify } from '@/lib/tokens'

// Compétences prouvées : chaque outil renvoie au projet ou au stage où il a servi.
// Pas de niveau auto-évalué, la preuve remplace le pourcentage.

// ─── Preuves : projets et stages présentés sur le site ────────────────────────

type ProofKey =
  | 'austral' | 'quantum' | 'excell' | 'ctscan' | 'curie' | 'glycemie'
  | 'emg' | 'ethylometre' | 'anemometre' | 'eaux' | 'wallet' | 'portfolio'

const PROOFS: Record<ProofKey, { label: string; note?: string; to?: string }> = {
  austral:     { label: 'Austral-Omics',      note: 'stage INSERM', to: '/projets/austral-omics' },
  quantum:     { label: 'Quantum Surgical',   note: 'stage',        to: '/stages/quantum-surgical' },
  excell:      { label: 'Laboratoire Excell', note: 'stage',        to: '/stages/laboratoire-excell' },
  ctscan:      { label: 'CT-Scan',                                  to: '/projets/ct-scan-deep-learning' },
  curie:       { label: 'Institut Curie',     note: 'en cours',     to: '/projets/institut-curie' },
  glycemie:    { label: 'Régulation glycémie',                      to: '/projets/regulateur-glycemie' },
  emg:         { label: 'Main EMG',                                 to: '/projets/main-robotique-emg' },
  ethylometre: { label: 'Éthylomètre',                              to: '/projets/ethylometre' },
  anemometre:  { label: 'Anémomètre',                               to: '/projets/anemometre' },
  eaux:        { label: 'Eaux résiduaires',                         to: '/projets/eaux-residuaires' },
  wallet:      { label: 'Mon Wallet Médical',                       to: '/projets/mon-wallet-medical' },
  portfolio:   { label: 'Ce portfolio' },
}

const PROOF_ORDER: ProofKey[] = [
  'austral', 'quantum', 'excell', 'ctscan', 'curie', 'glycemie',
  'emg', 'ethylometre', 'anemometre', 'eaux', 'wallet', 'portfolio',
]

// ─── Domaines et outils, chacun relié à ses preuves ───────────────────────────

type Domain = { short: string; label: string; color: string; tools: { name: string; proofs: ProofKey[] }[] }

const DOMAINS: Domain[] = [
  {
    short: 'IA', label: 'Machine Learning & IA', color: domainColors.ml,
    tools: [
      { name: 'Python',                  proofs: ['ctscan', 'austral'] },
      { name: 'PyTorch',                 proofs: ['ctscan', 'austral'] },
      { name: 'Réseaux convolutifs (CNN)', proofs: ['ctscan', 'austral'] },
      { name: 'Transfer learning',       proofs: ['ctscan'] },
      { name: 'Ensemble learning',       proofs: ['ctscan'] },
      { name: 'Apprentissage contrastif', proofs: ['austral'] },
      { name: 'Analyse d\'images',       proofs: ['ctscan', 'curie'] },
    ],
  },
  {
    short: 'Bio-info', label: 'Bio-informatique', color: domainColors.bio,
    tools: [
      { name: 'Séquençage Nanopore',     proofs: ['austral'] },
      { name: 'Metabarcoding 16S / COI', proofs: ['austral'] },
      { name: 'vsearch · SINTAX',        proofs: ['austral'] },
      { name: 'Banques SILVA · BOLD',    proofs: ['austral'] },
      { name: 'R',                       proofs: ['austral'] },
      { name: 'Linux · Slurm',           proofs: ['austral'] },
    ],
  },
  {
    short: 'Embarqué', label: 'Instrumentation & embarqué', color: domainColors.embarque,
    tools: [
      { name: 'Arduino (C/C++)',         proofs: ['glycemie', 'emg', 'ethylometre', 'anemometre'] },
      { name: 'Capteurs',                proofs: ['glycemie', 'emg', 'ethylometre', 'anemometre'] },
      { name: 'Électronique',            proofs: ['emg', 'ethylometre'] },
      { name: 'MATLAB · Simulink',       proofs: ['glycemie'] },
      { name: 'Automatique',             proofs: ['glycemie'] },
      { name: 'Bluetooth (BLE)',         proofs: ['glycemie'] },
      { name: 'Chimie analytique (HPLC, GC-FID)', proofs: ['eaux'] },
    ],
  },
  {
    short: 'Qualité', label: 'Métrologie, qualité & réglementaire', color: domainColors.biomedical,
    tools: [
      { name: 'Métrologie · ISO/IEC 17025', proofs: ['excell', 'quantum'] },
      { name: 'Gestion de parc métrologique', proofs: ['quantum'] },
      { name: 'Qualité · BizzMine',      proofs: ['quantum'] },
      { name: 'Dispositifs médicaux',    proofs: ['quantum'] },
      { name: 'Validation contre une vérité connue', proofs: ['austral'] },
      { name: 'RGPD · données de santé', proofs: ['wallet'] },
    ],
  },
  {
    short: 'CAO', label: 'Conception & fabrication', color: domainColors.cao,
    tools: [
      { name: 'SolidWorks',              proofs: ['emg', 'anemometre'] },
      { name: 'Impression 3D',           proofs: ['emg', 'ethylometre', 'anemometre'] },
      { name: 'Prototypage',             proofs: ['ethylometre', 'anemometre'] },
    ],
  },
  {
    short: 'Web', label: 'Web & logiciel', color: domainColors.web,
    tools: [
      { name: 'React · TypeScript',      proofs: ['portfolio', 'wallet'] },
      { name: 'Next.js · Fastify',       proofs: ['wallet'] },
      { name: 'Spring Boot (Java)',      proofs: ['portfolio'] },
      { name: 'Rust (Axum)',             proofs: ['portfolio'] },
      { name: 'Three.js',                proofs: ['portfolio', 'ethylometre'] },
      { name: 'API REST · FastAPI',      proofs: ['portfolio', 'austral'] },
      { name: 'PostgreSQL',              proofs: ['wallet', 'portfolio'] },
      { name: 'Chiffrement · blockchain', proofs: ['wallet'] },
      { name: 'Git',                     proofs: ['portfolio'] },
    ],
  },
]

const TOOL_COUNT = DOMAINS.reduce((n, d) => n + d.tools.length, 0)
const usesDomain = (p: ProofKey, d: Domain) => d.tools.some(t => t.proofs.includes(p))

// ─── Pastille de preuve ───────────────────────────────────────────────────────

function ProofChip({ k, color }: { k: ProofKey; color: string }) {
  const p = PROOFS[k]
  const style: React.CSSProperties = {
    fontFamily: fonts.body, fontSize: '11px', fontWeight: 500, lineHeight: 1.4,
    padding: '2px 9px', borderRadius: '20px', whiteSpace: 'nowrap', textDecoration: 'none',
    color, background: `${color}10`, border: `1px ${k === 'curie' ? 'dashed' : 'solid'} ${color}33`,
  }
  const text = p.note === 'en cours' ? `${p.label} · en cours` : p.label
  return p.to ? <Link to={p.to} style={style}>{text}</Link> : <span style={style}>{text}</span>
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const { scrollYProgress } = useScroll()
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  const stats = [
    { value: String(DOMAINS.length), label: 'domaines' },
    { value: String(TOOL_COUNT), label: 'outils, chacun relié à une preuve' },
    { value: '6 ans', label: "d'apprentissage" },
    { value: '2027', label: 'objectif PFE' },
  ]

  return (
    <section style={{ paddingTop: '130px', paddingBottom: '80px' }}>
      {/* Barre de lecture */}
      <motion.div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 100,
        background: `linear-gradient(to right, ${domainColors.ml}, ${domainColors.bio}, ${domainColors.biomedical}, ${domainColors.web})`,
        scaleX: lineScale, transformOrigin: 'left',
      }} />

      {/* Badges */}
      <motion.div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
        {[`${DOMAINS.length} domaines`, `${TOOL_COUNT} outils`, 'chacun relié à un projet ou un stage', 'PFE 2027'].map((s, i) => (
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
        style={{ fontFamily: fonts.body, fontSize: '17px', lineHeight: 1.8, color: colors.textMuted, maxWidth: '520px', margin: '0 0 56px', ...justify }}
      >
        De la mesure physique à l'intelligence artificielle médicale : six domaines construits à travers chaque formation et chaque stage. Chaque outil renvoie au projet ou au stage où je l'ai utilisé.
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

// ─── Vue d'ensemble : quels projets mobilisent quels domaines ────────────────

function SectionTitle({ title, intro }: { title: string; intro: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ marginBottom: '40px' }}
    >
      <h2 style={{ fontFamily: fonts.heading, fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 400, color: colors.text, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
        {title}
      </h2>
      <p style={{ fontFamily: fonts.body, fontSize: '14px', lineHeight: 1.75, color: colors.textMuted, margin: 0, maxWidth: '640px', ...justify }}>
        {intro}
      </p>
    </motion.div>
  )
}

function OverviewSection() {
  const cols = `minmax(130px, 1fr) repeat(${DOMAINS.length}, minmax(28px, 96px))`
  return (
    <section style={{ padding: '80px 0', borderTop: `1px solid ${colors.borderLight}` }}>
      <SectionTitle title="Vue d'ensemble" intro="Les domaines mobilisés par chaque stage et chaque projet. Un point = au moins un outil du domaine utilisé." />

      <div role="table" aria-label="Domaines mobilisés par projet et par stage" style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: 'clamp(12px, 3vw, 24px)' }}>
        <div role="row" style={{ display: 'grid', gridTemplateColumns: cols, alignItems: 'end', paddingBottom: '10px' }}>
          <span role="columnheader" />
          {DOMAINS.map(d => (
            <span key={d.short} role="columnheader" title={d.label} style={{ justifySelf: 'center', writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: fonts.body, fontSize: '11px', fontWeight: 700, color: d.color, letterSpacing: '0.02em' }}>
              {d.short}
            </span>
          ))}
        </div>
        {PROOF_ORDER.map((k, ri) => {
          const p = PROOFS[k]
          return (
            <div key={k} role="row" style={{ display: 'grid', gridTemplateColumns: cols, alignItems: 'center', minHeight: '34px', padding: '4px 0', borderTop: `1px solid ${colors.borderLight}` }}>
              <span role="rowheader" style={{ fontFamily: fonts.body, fontSize: '13px', fontWeight: 600, color: colors.text, paddingRight: '8px', minWidth: 0 }}>
                {p.to ? <Link to={p.to} style={{ color: 'inherit', textDecoration: 'none' }}>{p.label}</Link> : p.label}
                {p.note && <span style={{ fontWeight: 400, fontSize: '11px', color: colors.textLight }}> · {p.note}</span>}
              </span>
              {DOMAINS.map((d, ci) => (
                <span key={d.short} role="cell" aria-label={usesDomain(k, d) ? d.label : undefined} style={{ justifySelf: 'center' }}>
                  {usesDomain(k, d) && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: ri * 0.04 + ci * 0.03, ease: [0.22, 1, 0.36, 1] }}
                      style={{ display: 'block', width: 10, height: 10, borderRadius: '50%', background: d.color }}
                    />
                  )}
                </span>
              ))}
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ─── Détail par domaine : chaque outil et ses preuves ────────────────────────

function DomainSection() {
  return (
    <section style={{ padding: '0 0 100px' }}>
      <SectionTitle title="Détail par domaine" intro="Chaque outil renvoie au projet ou au stage où je l'ai utilisé." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '20px' }}>
        {DOMAINS.map((d, i) => (
          <motion.div key={d.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: (i % 2) * 0.07 }}
            style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '26px 26px 22px', boxShadow: `0 2px 12px ${ca.text(0.04)}` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <span style={{ width: 28, height: 3, borderRadius: 2, background: d.color, flexShrink: 0 }} />
              <span style={{ fontFamily: fonts.body, fontSize: '14px', fontWeight: 700, color: colors.text }}>{d.label}</span>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {d.tools.map(t => (
                <li key={t.name} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '6px 10px' }}>
                  <span style={{ flex: '1 1 150px', fontFamily: fonts.body, fontSize: '13px', fontWeight: 500, color: colors.text }}>{t.name}</span>
                  <span style={{ flex: '2 1 180px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {t.proofs.map(k => <ProofChip key={k} k={k} color={d.color} />)}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─── Où j'en suis : frise de la formation jusqu'au PFE ────────────────────────

const T = {
  start: Date.UTC(2025, 8, 1),   // Ingé2, sept. 2025
  ing3:  Date.UTC(2026, 8, 1),   // Ingé3, sept. 2026
  pfe:   Date.UTC(2027, 3, 7),   // PFE, 7 avril 2027
  end:   Date.UTC(2027, 9, 7),   // fin du PFE, 6 mois plus tard
}
const pct = (t: number) => ((t - T.start) / (T.end - T.start)) * 100

const PHASES = [
  { label: 'Ingé2', from: T.start, to: T.ing3, color: colors.olive },
  { label: 'Ingé3', from: T.ing3, to: T.pfe, color: colors.accent },
  { label: 'PFE',   from: T.pfe,  to: T.end, color: colors.rust },
]
const MILESTONES = [
  { at: T.start, label: 'sept. 2025' },
  { at: T.ing3,  label: 'sept. 2026' },
  { at: T.pfe,   label: '7 avril 2027' },
]

// Position d'aujourd'hui sur la frise, calculée au chargement de la page
const TODAY = Math.min(100, Math.max(0, pct(Date.now())))

function ProgressTimeline() {
  const reduce = useReducedMotion()
  const today = TODAY
  return (
    <section style={{ padding: '80px 0 0', borderTop: `1px solid ${colors.borderLight}` }}>
      <SectionTitle title="Où j'en suis" intro="Ingé2 terminée, Ingé3 en cours, disponible pour un PFE de 6 mois à partir du 7 avril 2027." />

      <div style={{ position: 'relative', paddingTop: '28px' }}>
        {/* Aujourd'hui */}
        <motion.span
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 1.1 }}
          style={{ position: 'absolute', top: 0, left: `${today}%`, transform: 'translateX(-50%)', fontFamily: fonts.mono, fontSize: '11px', fontWeight: 700, color: colors.accent, whiteSpace: 'nowrap' }}
        >
          aujourd'hui
        </motion.span>

        {/* Phases */}
        <div style={{ position: 'relative', height: '32px', borderRadius: '16px', overflow: 'hidden', background: colors.bgCard, border: `1px solid ${colors.border}` }}>
          {PHASES.map(p => (
            <div key={p.label} style={{
              position: 'absolute', top: 0, bottom: 0, left: `${pct(p.from)}%`, width: `${pct(p.to) - pct(p.from)}%`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${p.color}14`, borderLeft: p.from > T.start ? `1px solid ${colors.border}` : 'none',
              fontFamily: fonts.body, fontSize: '12px', fontWeight: 700, color: p.color,
            }}>
              {p.label}
            </div>
          ))}
          {/* Progression jusqu'à aujourd'hui */}
          <motion.div
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{ position: 'absolute', left: 0, bottom: 0, height: '4px', width: `${today}%`, originX: 0, background: `linear-gradient(to right, ${colors.olive}, ${colors.accent})` }}
          />
        </div>

        {/* Repère : aujourd'hui */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 1.1 }}
          style={{ position: 'absolute', top: '18px', left: `${today}%`, width: '2px', height: '46px', marginLeft: '-1px', background: colors.accent }}
        >
          <motion.span
            animate={reduce ? undefined : { scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            style={{ position: 'absolute', top: '-4px', left: '-4px', width: '10px', height: '10px', borderRadius: '50%', background: colors.accent }}
          />
          <span style={{ position: 'absolute', top: '-4px', left: '-4px', width: '10px', height: '10px', borderRadius: '50%', background: colors.accent }} />
        </motion.div>

        {/* Dates */}
        <div style={{ position: 'relative', height: '22px', marginTop: '10px' }}>
          {MILESTONES.map((m, i) => (
            <span key={m.label} style={{
              position: 'absolute', top: 0, left: `${pct(m.at)}%`, transform: i === 0 ? 'none' : 'translateX(-50%)',
              fontFamily: fonts.mono, fontSize: '11px', color: colors.textLight, whiteSpace: 'nowrap',
            }}>
              {m.label}
            </span>
          ))}
        </div>
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
      <ProgressTimeline />
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
        <div style={{ maxWidth: '1020px', margin: '0 auto', padding: '0 clamp(16px, 5vw, 48px)' }}>
          <Hero />
          <OverviewSection />
          <DomainSection />
          <CurriculumSections />
        </div>
      </div>
    </PageTransition>
  )
}
