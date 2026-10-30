import { useEffect } from 'react'

const SITE = 'Lucas Desmartin'

/** Titre de l'onglet propre à chaque page (« Projets · Lucas Desmartin ») ; sans argument : titre de l'accueil */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : `${SITE} · Élève-ingénieur biomédical`
  }, [title])
}
