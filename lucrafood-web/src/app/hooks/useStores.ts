import { useQuery } from '@tanstack/react-query'
import { storeService } from '../services/storeService'

export function useStores() {
  return useQuery({
    queryKey: ['stores'],
    queryFn: storeService.getAll,
    staleTime: Infinity,
  })
}
