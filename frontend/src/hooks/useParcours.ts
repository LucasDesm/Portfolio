import { useQuery } from '@tanstack/react-query'
import { portfolioApi, API_ENABLED } from '@/lib/api'
import { PARCOURS } from '@/lib/data'

export function useParcours() {
  return useQuery({
    queryKey: ['parcours'],
    queryFn: portfolioApi.getParcours,
    initialData: PARCOURS,
    // Le contenu local s'affiche tout de suite ; l'API (si déployée) le confirme en arrière-plan
    initialDataUpdatedAt: 0,
    enabled: API_ENABLED,
    staleTime: 10 * 60 * 1000,
  })
}
