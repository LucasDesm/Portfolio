/**
 * useAnimeCounter — Compteur animé avec anime.js v4.
 * Spring avec léger overshoot : le chiffre dépasse légèrement la cible
 * puis revient, ce qui donne un effet "slot machine de précision".
 */
import { useRef, useEffect, useState } from 'react'
import { animate } from 'animejs'

interface Options {
  /** Nombre de décimales affichées */
  decimals?: number
  /** Durée totale en ms (spring duration auto si non défini) */
  duration?: number
  /** Seuil d'intersection pour déclencher (0–1) */
  threshold?: number
}

export function useAnimeCounter(target: number, options: Options = {}) {
  const { decimals = 0, duration = 1600, threshold = 0.4 } = options

  const [val, setVal]         = useState(0)
  const ref                   = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)
  const proxy                 = useRef({ value: 0 })

  // Démarrer quand l'élément entre dans le viewport
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !triggered) setTriggered(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [triggered, threshold])

  // Lancer l'animation
  useEffect(() => {
    if (!triggered) return
    proxy.current.value = 0

    animate(proxy.current, {
      value: target,
      duration,
      // décélération franche, sans dépassement de la valeur cible
      ease: 'outExpo',
      onUpdate: () => {
        const raw = proxy.current.value
        const rounded =
          decimals > 0
            ? Math.round(raw * 10 ** decimals) / 10 ** decimals
            : Math.round(raw)
        setVal(rounded)
      },
    })
  }, [triggered, target, duration, decimals])

  return { ref, val }
}
