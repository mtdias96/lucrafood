import { useMutation, useQueryClient } from '@tanstack/react-query'
import { storeService } from '../services/storeService'

export function useCreateStore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: storeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] })
    },
  })
}
