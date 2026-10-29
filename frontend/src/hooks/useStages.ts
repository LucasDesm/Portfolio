import { useQuery } from '@tanstack/react-query'
import { portfolioApi } from '@/lib/api'
import { STAGES } from '@/lib/data'

export function useStages() {
  return useQuery({
    queryKey: ['stages'],
    queryFn: portfolioApi.getStages,
    initialData: STAGES,
    staleTime: 10 * 60 * 1000,
  })
}

export function useStage(slug: string) {
  return useQuery({
    queryKey: ['stages', slug],
    queryFn: () => portfolioApi.getStage(slug),
    initialData: () => STAGES.find(s => s.slug === slug),
    staleTime: 10 * 60 * 1000,
  })
}
