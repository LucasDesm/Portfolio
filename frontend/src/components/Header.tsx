import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { motion, useScroll, useTransform } from 'motion/react'
import { colors, fonts, ca } from '@/lib/tokens'

const NAV_LINKS = [
  { label: 'Parcours',     to: '/parcours' },
  { label: 'Stages',       to: '/stages' },
  { label: 'Projets',      to: '/projets' },
  { label: 'Compétences',  to: '/competences' },
  { label: 'Contact',      to: '/contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
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

  return (
    <motion.header
      style={{
        backgroundColor: headerBg,
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
        padding: '0 40px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <NavLink to="/" style={{ textDecoration: 'none' }}>
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
            }}
          >
            Lucas Desmartin
          </motion.span>
        </NavLink>

        {/* Nav */}
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
      </div>
    </motion.header>
  )
}
