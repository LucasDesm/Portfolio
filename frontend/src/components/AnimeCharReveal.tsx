/**
 * AnimeCharReveal — Révèle le texte lettre par lettre avec un spring anime.js v4.
 * Chaque caractère est masqué dans un wrapper overflow:hidden, puis sort vers le haut
 * avec un stagger + physique spring (léger rebond).
 */
import { useRef, useEffect } from 'react'
import { animate, stagger, spring } from 'animejs'
import { useReducedMotion } from 'motion/react'

interface Props {
  text: string
  /** délai avant le début (ms) */
  delay?: number
  /** décalage entre chaque lettre (ms) */
  staggerMs?: number
  /** wrapper style */
  style?: React.CSSProperties
  className?: string
  /** paramètres spring : mass, stiffness, damping, velocity */
  springParams?: { mass?: number; stiffness?: number; damping?: number; velocity?: number }
}

export default function AnimeCharReveal({
  text,
  delay = 0,
  staggerMs = 38,
  style,
  className,
  springParams,
}: Props) {
  const wrapRef    = useRef<HTMLSpanElement>(null)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    if (shouldReduce) {
      // Pas d'animation — texte visible immédiatement
      el.textContent = text
      return
    }

    // ── Construire la structure DOM ──────────────────────────────────────────
    el.innerHTML = ''
    const innerChars: HTMLElement[] = []

    for (const ch of text) {
      if (ch === ' ') {
        const spacer = document.createElement('span')
        spacer.style.cssText = 'display:inline-block;width:0.28em'
        el.appendChild(spacer)
        continue
      }

      // Masque : overflow hidden, empêche de voir la lettre hors de sa boîte
      const mask = document.createElement('span')
      mask.style.cssText =
        'display:inline-block;overflow:hidden;vertical-align:bottom;line-height:1.15;padding-top:0.38em;margin-top:-0.38em'

      // Lettre animable
      const char = document.createElement('span')
      char.style.cssText = 'display:inline-block;will-change:transform'
      char.textContent = ch

      mask.appendChild(char)
      el.appendChild(mask)
      innerChars.push(char)
    }

    if (!innerChars.length) return

    // ── Animer ──────────────────────────────────────────────────────────────
    animate(innerChars, {
      translateY: ['110%', '0%'],
      ease: spring({
        mass:      springParams?.mass      ?? 0.85,
        stiffness: springParams?.stiffness ?? 95,
        damping:   springParams?.damping   ?? 13,
        velocity:  springParams?.velocity  ?? 0,
      }),
      delay: stagger(staggerMs, { start: delay }),
    })

    return () => {
      // Restaurer le texte brut si le composant est démonté
      if (el) el.textContent = text
    }
  }, [text, delay, staggerMs, shouldReduce])

  return (
    <span ref={wrapRef} style={style} className={className}>
      {/* Rendu initial SSR / no-JS */}
      {text}
    </span>
  )
}
