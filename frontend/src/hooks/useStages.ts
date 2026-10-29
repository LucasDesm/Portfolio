import { useQuery } from '@tanstack/react-query'
import { portfolioApi, API_ENABLED } from '@/lib/api'
import { STAGES } from '@/lib/data'

export function useStages() {
  return useQuery({
    queryKey: ['stages'],
    queryFn: portfolioApi.getStages,
    initialData: STAGES,
    // Le contenu local s'affiche tout de suite ; l'API (si déployée) le confirme en arrière-plan
    initialDataUpdatedAt: 0,
    enabled: API_ENABLED,
    staleTime: 10 * 60 * 1000,
  })
}

export function useStage(slug: string) {
  return useQuery({
    queryKey: ['stages', slug],
    queryFn: () => portfolioApi.getStage(slug),
    initialData: () => STAGES.find(s => s.slug === slug),
    // Le contenu local s'affiche tout de suite ; l'API (si déployée) le confirme en arrière-plan
    initialDataUpdatedAt: 0,
    enabled: API_ENABLED,
    staleTime: 10 * 60 * 1000,
  })
}
