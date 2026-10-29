import { useQuery } from '@tanstack/react-query'
import { portfolioApi } from '@/lib/api'
import { PROJECTS } from '@/lib/data'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: portfolioApi.getProjects,
    initialData: PROJECTS,
    staleTime: 5 * 60 * 1000,
  })
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ['projects', slug],
    queryFn: () => portfolioApi.getProject(slug),
    initialData: () => PROJECTS.find(p => p.slug === slug),
    staleTime: 5 * 60 * 1000,
  })
}
