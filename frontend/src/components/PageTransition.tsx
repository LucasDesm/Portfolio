import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface Props { children: ReactNode }

const variants = {
  initial: { opacity: 0, y: 18 },
  enter:   { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12 },
}

export default function PageTransition({ children }: Props) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
