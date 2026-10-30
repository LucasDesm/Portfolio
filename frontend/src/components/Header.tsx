import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react'
import { colors, fonts, ca } from '@/lib/tokens'
import { useMediaQuery, NARROW } from '@/hooks/useMediaQuery'

const NAV_LINKS = [
  { label: 'Parcours',     to: '/parcours' },
  { label: 'Stages',       to: '/stages' },
  { label: 'Projets',      to: '/projets' },
  { label: 'Compétences',  to: '/competences' },
  { label: 'Contact',      to: '/contact' },
]

// Bouton menu (mobile) : trois traits qui deviennent une croix
function MenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  const bar = { display: 'block', width: 22, height: 2, borderRadius: 1, background: colors.text }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
      aria-expanded={open}
      aria-controls="menu-mobile"
      style={{ width: 44, height: 44, marginRight: -10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, background: 'transparent', border: 'none', cursor: 'pointer' }}
    >
      <motion.span animate={{ y: open ? 7 : 0, rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }} style={bar} />
      <motion.span animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.15 }} style={bar} />
      <motion.span animate={{ y: open ? -7 : 0, rotate: open ? -45 : 0 }} transition={{ duration: 0.2 }} style={bar} />
    </button>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const narrow = useMediaQuery(NARROW)
  const location = useLocation()
  const { scrollY } = useScroll()

  const headerBg = useTransform(
    scrollY,
    [0, 60],
    [ca.bg(0), ca.bg(0.95)]
  )
  const headerShadow = useTransform(
    scrollY,
    [0, 60],
    ['0 0 0 rgba(0,0,0,0)', `0 1px 0 ${colors.border}`]
  )

  useEffect(() => {
    const unsub = scrollY.on('change', v => setScrolled(v > 40))
    return unsub
  }, [scrollY])

  // Échap ferme le menu mobile
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const open = narrow && menuOpen
  const close = () => setMenuOpen(false)

  return (
    <motion.header
      style={{
        backgroundColor: open ? colors.bg : headerBg,
        boxShadow: headerShadow,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'backdrop-filter 0.3s',
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 clamp(16px, 4vw, 40px)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <NavLink to="/" onClick={close} style={{ textDecoration: 'none' }}>
          <motion.span
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              fontFamily: fonts.heading,
              fontSize: '17px',
              fontWeight: 600,
              color: colors.text,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            Lucas Desmartin
          </motion.span>
        </NavLink>

        {narrow ? (
          <MenuButton open={open} onClick={() => setMenuOpen(o => !o)} />
        ) : (
          /* Nav */
          <motion.nav
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            style={{ display: 'flex', gap: '4px', alignItems: 'center' }}
          >
            {NAV_LINKS.map(({ label, to }) => {
              const isContact = to === '/contact'
              const isActive  = location.pathname === to || (!isContact && location.pathname.startsWith(to) && to !== '/')

              return isContact ? (
                <NavLink
                  key={label}
                  to={to}
                  style={{
                    textDecoration: 'none',
                    padding: '7px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: fonts.body,
                    fontWeight: 600,
                    color: isActive ? colors.bg : colors.accent,
                    background: isActive ? colors.accent : 'transparent',
                    border: `1.5px solid ${colors.accent}`,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = colors.accentLight
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = 'transparent'
                    }
                  }}
                >
                  {label}
                </NavLink>
              ) : (
                <NavLink
                  key={label}
                  to={to}
                  style={{
                    textDecoration: 'none',
                    padding: '7px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: fonts.body,
                    fontWeight: 500,
                    color: isActive ? colors.accent : colors.textMuted,
                    background: isActive ? colors.accentLight : 'transparent',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      const el = e.currentTarget as HTMLElement
                      el.style.color = colors.text
                      el.style.background = colors.borderLight
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      const el = e.currentTarget as HTMLElement
                      el.style.color = colors.textMuted
                      el.style.background = 'transparent'
                    }
                  }}
                >
                  {label}
                </NavLink>
              )
            })}

            {/* Bouton CV */}
            <motion.a
              href="/lucas-desmartin-cv.pdf"
              download
              whileHover={{ scale: 1.04, boxShadow: `0 4px 16px ${ca.text(0.12)}` }}
              whileTap={{ scale: 0.97 }}
              style={{
                textDecoration: 'none',
                padding: '7px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontFamily: fonts.body,
                fontWeight: 600,
                color: colors.text,
                background: colors.bgSubtle,
                border: `1.5px solid ${colors.border}`,
                display: 'flex', alignItems: 'center', gap: '5px',
                marginLeft: '4px',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = colors.bgCard }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = colors.bgSubtle }}
            >
              <span style={{ fontSize: '11px' }}>↓</span> CV
            </motion.a>
          </motion.nav>
        )}
      </div>

      {/* Menu mobile : panneau plein écran sous l'en-tête */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-mobile"
            aria-label="Menu principal"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              position: 'fixed', top: '64px', left: 0, right: 0, height: 'calc(100svh - 64px)',
              overflowY: 'auto', background: colors.bg, borderTop: `1px solid ${colors.border}`,
              padding: '16px clamp(16px, 5vw, 40px) 32px', display: 'flex', flexDirection: 'column',
            }}
          >
            {NAV_LINKS.filter(l => l.to !== '/contact').map(({ label, to }) => {
              const isActive = location.pathname.startsWith(to)
              return (
                <NavLink key={label} to={to} onClick={close} style={{
                  textDecoration: 'none', padding: '14px 0', borderBottom: `1px solid ${colors.borderLight}`,
                  fontFamily: fonts.heading, fontSize: '30px', fontWeight: 400, letterSpacing: '-0.02em',
                  color: isActive ? colors.accent : colors.text,
                }}>
                  {label}
                </NavLink>
              )
            })}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '28px' }}>
              <NavLink to="/contact" onClick={close} style={{
                flex: '1 1 140px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', padding: '14px 20px', borderRadius: '14px',
                fontFamily: fonts.body, fontSize: '15px', fontWeight: 600, color: colors.bg, background: colors.accent,
                boxShadow: `0 6px 24px ${ca.accent(0.22)}`,
              }}>
                Contact
              </NavLink>
              <a href="/lucas-desmartin-cv.pdf" download onClick={close} style={{
                flex: '1 1 140px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', padding: '14px 20px', borderRadius: '14px',
                fontFamily: fonts.body, fontSize: '15px', fontWeight: 600, color: colors.text, border: `1.5px solid ${colors.border}`,
              }}>
                ↓ CV (PDF)
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
