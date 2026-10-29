import { useQuery } from '@tanstack/react-query'
import { portfolioApi } from '@/lib/api'
import { PARCOURS } from '@/lib/data'

export function useParcours() {
  return useQuery({
    queryKey: ['parcours'],
    queryFn: portfolioApi.getParcours,
    initialData: PARCOURS,
    staleTime: 10 * 60 * 1000,
  })
}
