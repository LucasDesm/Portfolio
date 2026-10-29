import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { colors, ca } from '@/lib/tokens'

export default function CustomCursor() {
  const [isTouch, setIsTouch] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [visible, setVisible] = useState(false)

  const mx = useMotionValue(-200)
  const my = useMotionValue(-200)

  // Ring: lent + springy
  const rx = useSpring(mx, { stiffness: 160, damping: 22, mass: 0.4 })
  const ry = useSpring(my, { stiffness: 160, damping: 22, mass: 0.4 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(hover: none)').matches) return
    setIsTouch(false)

    const move = (e: MouseEvent) => {
      mx.set(e.clientX)
      my.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      setHovered(!!t.closest('a, button, [role="button"], input, textarea, select, label'))
    }

    const down = () => setClicked(true)
    const up   = () => setClicked(false)
    const enter = () => setVisible(true)
    const leave = () => setVisible(false)

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.documentElement.addEventListener('mouseleave', leave)
    document.documentElement.addEventListener('mouseenter', enter)

    document.body.style.cursor = 'none'

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.documentElement.removeEventListener('mouseleave', leave)
      document.documentElement.removeEventListener('mouseenter', enter)
    }
  }, [])

  if (isTouch) return null

  const ringSize = clicked ? 20 : hovered ? 44 : 30

  return (
    <>
      {/* Ring — suit avec délai */}
      <motion.div
        style={{
          position: 'fixed',
          left: rx,
          top: ry,
          x: '-50%',
          y: '-50%',
          pointerEvents: 'none',
          zIndex: 99997,
          borderRadius: '50%',
          border: `1.5px solid ${ca.accent(hovered ? 0.65 : 0.45)}`,
          background: hovered ? ca.accent(0.07) : 'transparent',
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      />

      {/* Dot — suit immédiatement */}
      <motion.div
        style={{
          position: 'fixed',
          left: mx,
          top: my,
          x: '-50%',
          y: '-50%',
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: colors.accent,
          pointerEvents: 'none',
          zIndex: 99998,
        }}
        animate={{
          opacity: visible && !hovered ? 1 : 0,
          scale: clicked ? 0.5 : 1,
        }}
        transition={{ duration: 0.12 }}
      />
    </>
  )
}
