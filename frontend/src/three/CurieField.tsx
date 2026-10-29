import { motion } from 'motion/react'

// Projet Institut Curie, en schéma de principe : champ d'orientation des cellules
// (segments) et champ de vitesse (flèches) sur une piste. Aucune donnée réelle.
// Utilisé en vignette (page Projets) et en haut de la page projet.

const COLS = 9
const ROWS = 4

export default function CurieField({ a }: { a: string }) {
  return (
    <svg viewBox="0 0 150 120" width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet"
      role="img" aria-label="Schéma animé : orientation locale et déplacement de cellules sur une piste"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* Bords de la piste */}
      <line x1={8} x2={142} y1={32} y2={32} stroke={a} strokeWidth={1} strokeOpacity={0.45} />
      <line x1={8} x2={142} y1={88} y2={88} stroke={a} strokeWidth={1} strokeOpacity={0.45} />
      {/* Orientation locale des cellules, alignées près des bords */}
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const col = i % COLS, row = Math.floor(i / COLS)
        const cx = 19 + col * 14, cy = 42 + row * 12
        const edge = row === 0 || row === ROWS - 1 ? 0.3 : 1
        const base = Math.sin(col * 0.7 + row) * 35 * edge
        return (
          <motion.line key={i}
            x1={cx - 4.5} y1={cy} x2={cx + 4.5} y2={cy}
            stroke={a} strokeWidth={1.5} strokeLinecap="round" strokeOpacity={0.75}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            animate={{ rotate: [base, base + 20 * edge, base] }}
            transition={{ duration: 4, delay: (col * 0.15 + row * 0.2) % 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )
      })}
      {/* Vitesse : flèches qui avancent le long de la piste */}
      {[{ y: 48, d: 0 }, { y: 60, d: 1.2 }, { y: 72, d: 0.6 }].map(({ y, d }) => (
        <motion.g key={y}
          animate={{ x: [0, 34], opacity: [0, 0.6, 0] }}
          transition={{ duration: 3, delay: d, repeat: Infinity, ease: 'linear' }}
        >
          <line x1={40} x2={52} y1={y} y2={y} stroke={a} strokeWidth={1.2} />
          <path d={`M52,${y - 3} L57,${y} L52,${y + 3} Z`} fill={a} />
        </motion.g>
      ))}
      <text x={75} y={108} fontSize="7" fill={a} textAnchor="middle" fontFamily="monospace">orientation · vitesse</text>
    </svg>
  )
}
