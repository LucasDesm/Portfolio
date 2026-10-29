import { useState, useEffect, type ReactElement } from 'react'

type Piste = 'A' | 'B' | 'C'

const PISTES: Piste[] = ['A', 'B', 'C']

const LABELS: Record<Piste, string> = {
  A: 'A — Imagerie médicale',
  B: 'B — Instrumentation',
  C: 'C — Éditorial scientifique',
}

// ─── Tokens par piste ────────────────────────────────────────────────────────

const tokens = {
  A: {
    bg: '#faf9f7',
    bgCard: '#ffffff',
    bgSubtle: '#f0f3f8',
    text: '#1c2b3a',
    textMuted: '#5a7080',
    accent: '#2a6db5',
    accentBg: '#e8f0fb',
    accent2: '#2d8c5f',
    border: '#d8e2ec',
    navBg: 'rgba(250,249,247,0.92)',
    fontHeading: "'Newsreader', Georgia, serif",
    fontBody: "'Inter', system-ui, sans-serif",
    tagStyle: { background: '#e8f0fb', color: '#2a6db5', borderRadius: '4px', fontFamily: "'Inter', sans-serif" },
  },
  B: {
    bg: '#14161c',
    bgCard: '#1e2130',
    bgSubtle: '#1a1d27',
    text: '#d4dbe8',
    textMuted: '#6b7a94',
    accent: '#00e5a0',
    accentBg: 'rgba(0,229,160,0.1)',
    accent2: '#00c4f0',
    border: '#2a2f40',
    navBg: 'rgba(20,22,28,0.95)',
    fontHeading: "'JetBrains Mono', 'Courier New', monospace",
    fontBody: "'Inter', system-ui, sans-serif",
    tagStyle: { background: 'rgba(0,229,160,0.12)', color: '#00e5a0', borderRadius: '2px', border: '1px solid rgba(0,229,160,0.3)', fontFamily: "'JetBrains Mono', monospace" },
  },
  C: {
    bg: '#ffffff',
    bgCard: '#fafafa',
    bgSubtle: '#f5f5f5',
    text: '#0a0a0a',
    textMuted: '#737373',
    accent: '#c0392b',
    accentBg: '#fef2f1',
    accent2: '#0a0a0a',
    border: '#e5e5e5',
    navBg: 'rgba(255,255,255,0.95)',
    fontHeading: "'Playfair Display', Georgia, serif",
    fontBody: "'Inter', system-ui, sans-serif",
    tagStyle: { background: '#f5f5f5', color: '#0a0a0a', borderRadius: '0px', border: '1px solid #e5e5e5', fontFamily: "'Inter', sans-serif" },
  },
}

// ─── Composants preview ───────────────────────────────────────────────────────

function PreviewA() {
  const t = tokens.A
  return (
    <div style={{ fontFamily: t.fontBody, background: t.bg, color: t.text, minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: t.navBg, backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${t.border}`,
        padding: '0 48px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: t.fontHeading, fontWeight: 600, fontSize: '16px', color: t.accent }}>
          L. Desmartin
        </span>
        <div style={{ display: 'flex', gap: '32px', fontSize: '14px', color: t.textMuted }}>
          {['Parcours', 'Projets', 'Compétences', 'Contact'].map(l => (
            <span key={l} style={{ cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '96px 48px 80px', maxWidth: '900px' }}>
        <div style={{
          display: 'inline-block', marginBottom: '20px',
          background: t.accentBg, color: t.accent,
          fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em',
          padding: '5px 12px', borderRadius: '4px', textTransform: 'uppercase',
        }}>
          Ingénieur biomédical · ESME Paris
        </div>
        <h1 style={{
          fontFamily: t.fontHeading, fontSize: '64px', fontWeight: 400,
          lineHeight: 1.05, margin: '0 0 24px',
          letterSpacing: '-0.02em', color: t.text,
        }}>
          Du capteur<br />au modèle.
        </h1>
        <p style={{ fontSize: '18px', color: t.textMuted, maxWidth: '480px', lineHeight: 1.6, marginBottom: '40px' }}>
          Instrumentation · Machine Learning · Dispositifs médicaux.
          Je construis des systèmes qui mesurent le vivant et le comprennent.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            background: t.accent, color: '#fff', border: 'none',
            padding: '12px 28px', borderRadius: '6px', fontSize: '15px',
            fontWeight: 500, cursor: 'pointer',
          }}>Voir les projets</button>
          <button style={{
            background: 'transparent', color: t.accent, border: `1.5px solid ${t.border}`,
            padding: '12px 28px', borderRadius: '6px', fontSize: '15px',
            fontWeight: 500, cursor: 'pointer',
          }}>Télécharger le CV</button>
        </div>
      </section>

      {/* Projets */}
      <section style={{ padding: '0 48px 80px' }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: '16px',
          marginBottom: '32px', borderBottom: `1px solid ${t.border}`, paddingBottom: '16px',
        }}>
          <h2 style={{ fontFamily: t.fontHeading, fontSize: '28px', fontWeight: 400, margin: 0 }}>Projets</h2>
          <span style={{ fontSize: '13px', color: t.textMuted }}>sélection</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {[
            { title: 'CT-Scan & Deep Learning', desc: 'Détection cancer du poumon — EfficientNet-B0, 87,6% accuracy', tags: ['PyTorch', 'Transfer Learning', 'Python'] },
            { title: 'Main robotique EMG', desc: 'Commande myoélectrique — capteurs EMG surface → servos SolidWorks', tags: ['Arduino', 'CAO', 'Électronique'] },
          ].map(p => (
            <div key={p.title} style={{
              background: t.bgCard, border: `1px solid ${t.border}`,
              borderRadius: '8px', padding: '24px',
            }}>
              <div style={{
                width: '100%', height: '140px', marginBottom: '16px',
                background: t.bgSubtle, borderRadius: '4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', color: t.textMuted,
              }}>
                [ visualisation 3D / image ]
              </div>
              <h3 style={{ fontFamily: t.fontHeading, fontSize: '18px', fontWeight: 500, margin: '0 0 8px' }}>{p.title}</h3>
              <p style={{ fontSize: '14px', color: t.textMuted, margin: '0 0 16px', lineHeight: 1.5 }}>{p.desc}</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {p.tags.map(tag => (
                  <span key={tag} style={{ ...t.tagStyle, fontSize: '12px', padding: '3px 8px' }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function PreviewB() {
  const t = tokens.B
  return (
    <div style={{
      fontFamily: t.fontBody, background: t.bg, color: t.text, minHeight: '100vh',
      backgroundImage: `
        linear-gradient(rgba(42,47,64,0.4) 1px, transparent 1px),
        linear-gradient(90deg, rgba(42,47,64,0.4) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: t.navBg, backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${t.border}`,
        padding: '0 48px', height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: t.fontHeading, fontSize: '14px', color: t.accent, letterSpacing: '0.05em' }}>
          LUCAS_DESMARTIN
        </span>
        <div style={{ display: 'flex', gap: '24px', fontSize: '12px', color: t.textMuted, fontFamily: t.fontHeading, letterSpacing: '0.04em' }}>
          {['PARCOURS', 'PROJETS', 'SKILLS', 'CONTACT'].map(l => (
            <span key={l} style={{ cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '88px 48px 72px', maxWidth: '860px' }}>
        <div style={{ color: t.accent2, fontSize: '12px', fontFamily: t.fontHeading, letterSpacing: '0.12em', marginBottom: '16px' }}>
          <span style={{ color: t.textMuted }}>$</span> whoami
        </div>
        <h1 style={{
          fontFamily: t.fontHeading, fontSize: '56px', fontWeight: 700,
          lineHeight: 1.08, margin: '0 0 8px',
          color: t.text,
        }}>
          <span style={{ color: t.accent }}>{'>'}</span> ingénieur_biomédical
        </h1>
        <h2 style={{
          fontFamily: t.fontHeading, fontSize: '24px', fontWeight: 400,
          margin: '0 0 28px', color: t.accent2,
        }}>
          du_capteur.to(modèle)
        </h2>
        <p style={{ fontSize: '15px', color: t.textMuted, maxWidth: '500px', lineHeight: 1.7, marginBottom: '40px', fontFamily: t.fontBody }}>
          Instrumentation · ML · IoT médical · Rust · Spring Boot
          <br />
          <span style={{ color: t.accent, fontFamily: t.fontHeading, fontSize: '13px' }}>// ESME Paris — spécialisation Biotech & Numérique</span>
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            background: t.accent, color: '#0a0a0a', border: 'none',
            padding: '11px 24px', borderRadius: '3px', fontSize: '13px',
            fontFamily: t.fontHeading, fontWeight: 700, letterSpacing: '0.05em', cursor: 'pointer',
          }}>PROJETS →</button>
          <button style={{
            background: 'transparent', color: t.accent, border: `1px solid ${t.accent}`,
            padding: '11px 24px', borderRadius: '3px', fontSize: '13px',
            fontFamily: t.fontHeading, letterSpacing: '0.05em', cursor: 'pointer',
          }}>CV.pdf</button>
        </div>
      </section>

      {/* Projets */}
      <section style={{ padding: '0 48px 80px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          marginBottom: '24px',
        }}>
          <span style={{ color: t.accent, fontFamily: t.fontHeading, fontSize: '13px' }}>{'>'}</span>
          <h2 style={{ fontFamily: t.fontHeading, fontSize: '14px', fontWeight: 700, margin: 0, letterSpacing: '0.1em', color: t.text }}>
            PROJETS / VITRINE
          </h2>
          <div style={{ flex: 1, height: '1px', background: t.border }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { title: 'ct_scan_lung_cancer.py', desc: 'EfficientNet-B0 · 87,6% acc · F1=0.885', tags: ['PyTorch', 'Transfer Learning', 'Python'] },
            { title: 'emg_robotic_hand.ino', desc: 'Commande myoélectrique · SolidWorks · Arduino', tags: ['Arduino', 'CAO', 'EMG'] },
          ].map(p => (
            <div key={p.title} style={{
              background: t.bgCard, border: `1px solid ${t.border}`,
              borderRadius: '4px', padding: '20px',
            }}>
              <div style={{
                width: '100%', height: '120px', marginBottom: '14px',
                background: t.bgSubtle, borderRadius: '2px',
                border: `1px solid ${t.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', color: t.textMuted, fontFamily: t.fontHeading,
              }}>
                [ RENDER_3D ]
              </div>
              <p style={{ fontFamily: t.fontHeading, fontSize: '13px', color: t.accent, margin: '0 0 6px', letterSpacing: '0.02em' }}>{p.title}</p>
              <p style={{ fontSize: '13px', color: t.textMuted, margin: '0 0 14px', lineHeight: 1.5 }}>{p.desc}</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {p.tags.map(tag => (
                  <span key={tag} style={{ ...t.tagStyle, fontSize: '11px', padding: '2px 7px' }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function PreviewC() {
  const t = tokens.C
  return (
    <div style={{ fontFamily: t.fontBody, background: t.bg, color: t.text, minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: t.navBg, backdropFilter: 'blur(4px)',
        borderBottom: `1px solid ${t.border}`,
        padding: '0 64px', height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: t.fontHeading, fontWeight: 700, fontSize: '15px', fontStyle: 'italic' }}>
          Lucas Desmartin
        </span>
        <div style={{ display: 'flex', gap: '36px', fontSize: '13px', color: t.textMuted, letterSpacing: '0.02em' }}>
          {['Parcours', 'Projets', 'Compétences', 'Contact'].map(l => (
            <span key={l} style={{ cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </nav>

      {/* Hero — asymétrique */}
      <section style={{ padding: '120px 64px 96px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'end', maxWidth: '1100px' }}>
        <div>
          <p style={{ fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', color: t.textMuted, marginBottom: '20px', margin: '0 0 20px' }}>
            Ingénieur biomédical
          </p>
          <h1 style={{
            fontFamily: t.fontHeading, fontSize: '72px', fontWeight: 700,
            lineHeight: 1.0, margin: '0 0 32px',
            letterSpacing: '-0.03em',
          }}>
            Du capteur<br />
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>au modèle.</span>
          </h1>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{
              background: t.text, color: '#fff', border: 'none',
              padding: '13px 32px', borderRadius: '2px', fontSize: '14px',
              letterSpacing: '0.04em', cursor: 'pointer',
            }}>Projets →</button>
            <button style={{
              background: 'transparent', color: t.text, border: `1px solid ${t.border}`,
              padding: '13px 32px', borderRadius: '2px', fontSize: '14px',
              letterSpacing: '0.02em', cursor: 'pointer',
            }}>CV</button>
          </div>
        </div>
        <div style={{ paddingBottom: '8px' }}>
          <p style={{ fontSize: '17px', lineHeight: 1.75, color: t.textMuted, margin: 0 }}>
            BUT Mesures Physiques · DU Santé & Tech · ESME Biotech & Numérique.
            Je construis des systèmes qui mesurent le vivant — de l'électronique embarquée aux modèles de deep learning.
          </p>
          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${t.border}`, display: 'flex', gap: '32px' }}>
            {[['87,6%', 'accuracy CT-scan'], ['16 sem.', 'stage Quantum Surgical'], ['3', 'backends déployés']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: t.fontHeading, fontSize: '28px', fontWeight: 700, color: t.accent }}>{n}</div>
                <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '2px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projets */}
      <section style={{ padding: '0 64px 96px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '24px', marginBottom: '40px', borderTop: `2px solid ${t.text}`, paddingTop: '20px' }}>
          <h2 style={{ fontFamily: t.fontHeading, fontSize: '32px', fontWeight: 700, margin: 0 }}>Projets</h2>
          <span style={{ fontSize: '13px', color: t.textMuted }}>sélection · 2022–2026</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: t.border }}>
          {[
            { title: 'CT-Scan & Deep Learning', desc: 'Détection cancer du poumon — EfficientNet-B0, 87,6% accuracy, F1=0,885. Transfer learning sur dataset Chest CT-Scan Kaggle.', tags: ['PyTorch', 'Transfer Learning', 'Python'], year: '2026' },
            { title: 'Main robotique EMG', desc: 'Commande myoélectrique — capteurs EMG surface avant-bras vers servos. Modèle CAO SolidWorks, électronique Arduino custom.', tags: ['Arduino', 'SolidWorks', 'Électronique'], year: '2023' },
          ].map(p => (
            <div key={p.title} style={{ background: t.bg, padding: '32px' }}>
              <div style={{
                width: '100%', height: '160px', marginBottom: '20px',
                background: t.bgSubtle,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', color: t.textMuted,
              }}>
                [ visualisation 3D / image ]
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <h3 style={{ fontFamily: t.fontHeading, fontSize: '20px', fontWeight: 700, margin: 0 }}>{p.title}</h3>
                <span style={{ fontSize: '12px', color: t.textMuted }}>{p.year}</span>
              </div>
              <p style={{ fontSize: '14px', color: t.textMuted, margin: '0 0 16px', lineHeight: 1.65 }}>{p.desc}</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {p.tags.map(tag => (
                  <span key={tag} style={{ ...t.tagStyle, fontSize: '11px', padding: '3px 8px' }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ─── App preview ──────────────────────────────────────────────────────────────

const COMPONENTS: Record<Piste, () => ReactElement> = {
  A: PreviewA,
  B: PreviewB,
  C: PreviewC,
}

export default function DesignPreview() {
  const [active, setActive] = useState<Piste>('A')

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=Inter:wght@400;500;600&display=swap'
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

  const Preview = COMPONENTS[active]

  return (
    <div>
      {/* Sélecteur de piste */}
      <div style={{
        position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, display: 'flex', gap: '8px',
        background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)',
        padding: '8px', borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}>
        {PISTES.map(p => (
          <button key={p} onClick={() => setActive(p)} style={{
            padding: '8px 20px', borderRadius: '8px', border: 'none',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.15s',
            background: active === p ? '#ffffff' : 'transparent',
            color: active === p ? '#0a0a0a' : '#9ca3af',
          }}>
            {LABELS[p]}
          </button>
        ))}
      </div>

      <Preview />
    </div>
  )
}
