import { motion } from 'motion/react'
import type { ReactNode, CSSProperties } from 'react'

interface Props {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  style?: CSSProperties
  className?: string
}

export default function Reveal({
  children,
  delay = 0,
  direction = 'up',
  style,
  className,
}: Props) {
  const offset = { up: { y: 32 }, left: { x: -32 }, right: { x: 32 }, none: {} }[direction]

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  )
}
