import { motion } from 'motion/react'
import { colors, fonts } from '@/lib/tokens'
import type { Project, ResultTable } from '@/lib/data'

// Rôle, récit, résultats chiffrés et figures réelles d'un projet.
// Mise en page en une colonne fluide : lisible sans media query, du mobile au desktop.

const SECTION_STYLE: React.CSSProperties = {
  padding: '80px clamp(20px, 5vw, 48px) 0',
  maxWidth: '1100px',
  margin: '0 auto',
}

function Heading({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <h2 style={{ fontFamily: fonts.heading, fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 400, color: colors.text, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
        {children}
      </h2>
      <div style={{ height: 1, maxWidth: '200px', background: `linear-gradient(to right, ${accent}50, transparent)` }} />
    </div>
  )
}

function Table({ table }: { table: ResultTable }) {
  return (
    <figure style={{ margin: '0 0 40px' }}>
      <h3 style={{ fontFamily: fonts.body, fontSize: '15px', fontWeight: 600, color: colors.text, margin: '0 0 12px', lineHeight: 1.5 }}>
        {table.title}
      </h3>
      <div style={{ overflowX: 'auto', border: `1px solid ${colors.borderLight}`, borderRadius: '12px', background: colors.bgCard }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: fonts.body, fontSize: 'clamp(13px, 1.6vw, 14px)' }}>
          <thead>
            <tr>
              {table.columns.map((col, i) => (
                <th key={col} scope="col" style={{ textAlign: i === 0 ? 'left' : 'right', padding: 'clamp(9px, 2vw, 12px) clamp(10px, 2.5vw, 16px)', fontSize: '12px', fontWeight: 600, color: colors.textMuted, borderBottom: `1px solid ${colors.borderLight}`, background: colors.bgSubtle, whiteSpace: 'nowrap' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => ci === 0 ? (
                  <th key={ci} scope="row" style={{ textAlign: 'left', fontWeight: 500, color: colors.text, padding: 'clamp(9px, 2vw, 11px) clamp(10px, 2.5vw, 16px)', borderTop: ri ? `1px solid ${colors.borderLight}` : 'none', lineHeight: 1.45 }}>
                    {cell}
                  </th>
                ) : (
                  <td key={ci} style={{ textAlign: 'right', color: colors.text, padding: 'clamp(9px, 2vw, 11px) clamp(10px, 2.5vw, 16px)', borderTop: ri ? `1px solid ${colors.borderLight}` : 'none', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.caption && (
        <figcaption style={{ fontFamily: fonts.body, fontSize: '13px', color: colors.textMuted, lineHeight: 1.65, marginTop: '10px' }}>
          {table.caption}
        </figcaption>
      )}
    </figure>
  )
}

export default function ProjectEvidence({ project, accent }: { project: Project; accent: string }) {
  const { role, sections, tables } = project
  // La figure de couverture est déjà affichée (avec sa légende) en haut de page
  const figures = project.figures?.filter(f => f.src !== project.cover)
  if (!role && !sections?.length && !tables?.length && !figures?.length) return null

  return (
    <>
      {role && (
        <section style={SECTION_STYLE}>
          <Heading accent={accent}>Mon rôle</Heading>
          <p style={{ fontFamily: fonts.body, fontSize: '16px', lineHeight: 1.85, color: colors.textMuted, margin: 0, maxWidth: '760px' }}>
            {role}
          </p>
        </section>
      )}

      {sections && sections.length > 0 && (
        <section style={SECTION_STYLE}>
          <Heading accent={accent}>Le projet en détail</Heading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '760px' }}>
            {sections.map(s => (
              <motion.article key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 style={{ fontFamily: fonts.heading, fontSize: '21px', fontWeight: 500, color: colors.text, margin: '0 0 8px', letterSpacing: '-0.01em' }}>
                  {s.title}
                </h3>
                <p style={{ fontFamily: fonts.body, fontSize: '15.5px', lineHeight: 1.85, color: colors.textMuted, margin: 0 }}>
                  {s.body}
                </p>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      {tables && tables.length > 0 && (
        <section style={SECTION_STYLE}>
          <Heading accent={accent}>Résultats</Heading>
          {tables.map(t => <Table key={t.title} table={t} />)}
        </section>
      )}

      {figures && figures.length > 0 && (
        <section style={SECTION_STYLE}>
          <Heading accent={accent}>Figures</Heading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {figures.map(f => (
              <figure key={f.src} style={{ margin: 0 }}>
                <div style={{ background: colors.bgCard, border: `1px solid ${colors.borderLight}`, borderRadius: '14px', padding: 'clamp(10px, 2vw, 20px)' }}>
                  <img src={f.src} alt={f.alt} loading="lazy" style={{ display: 'block', width: '100%', height: 'auto' }} />
                </div>
                <figcaption style={{ fontFamily: fonts.body, fontSize: '13px', color: colors.textMuted, lineHeight: 1.65, marginTop: '10px', maxWidth: '760px' }}>
                  {f.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
