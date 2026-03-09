import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ingredientService } from '@/app/services/ingredientService'
import type { RegisterPurchaseParams } from '@/app/types/ingredient'

export function useRegisterPurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: RegisterPurchaseParams) =>
      ingredientService.registerPurchase(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      queryClient.invalidateQueries({
        queryKey: ['ingredients', variables.ingredientId],
      })
    },
  })
}
