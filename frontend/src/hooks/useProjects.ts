import { useQuery } from '@tanstack/react-query'
import { portfolioApi, API_ENABLED } from '@/lib/api'
import { PROJECTS } from '@/lib/data'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: portfolioApi.getProjects,
    initialData: PROJECTS,
    // Le contenu local s'affiche tout de suite ; l'API (si déployée) le confirme en arrière-plan
    initialDataUpdatedAt: 0,
    enabled: API_ENABLED,
    staleTime: 5 * 60 * 1000,
  })
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ['projects', slug],
    queryFn: () => portfolioApi.getProject(slug),
    initialData: () => PROJECTS.find(p => p.slug === slug),
    // Le contenu local s'affiche tout de suite ; l'API (si déployée) le confirme en arrière-plan
    initialDataUpdatedAt: 0,
    enabled: API_ENABLED,
    staleTime: 5 * 60 * 1000,
  })
}
