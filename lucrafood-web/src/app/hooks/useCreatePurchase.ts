import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ingredientService } from '@/app/services/ingredientService'
import type { CreatePurchaseParams } from '@/app/types/ingredient'

export function useCreatePurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreatePurchaseParams) => ingredientService.createPurchase(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
    },
  })
}
