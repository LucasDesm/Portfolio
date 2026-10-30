import { useSyncExternalStore } from 'react'

/**
 * useMediaQuery — vrai tant que la media query correspond (suit le redimensionnement).
 * Les styles étant en ligne, c'est ce hook qui porte les adaptations mobiles.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    onChange => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Écran étroit (téléphone) : une colonne, menu repliable */
export const NARROW = '(max-width: 767px)'

const onResize = (cb: () => void) => {
  window.addEventListener('resize', cb)
  return () => window.removeEventListener('resize', cb)
}

/** Taille de la fenêtre, pour mettre à l'échelle une composition à dimensions fixes */
export function useViewportSize(): { width: number; height: number } {
  const width = useSyncExternalStore(onResize, () => window.innerWidth, () => 1440)
  const height = useSyncExternalStore(onResize, () => window.innerHeight, () => 900)
  return { width, height }
}
