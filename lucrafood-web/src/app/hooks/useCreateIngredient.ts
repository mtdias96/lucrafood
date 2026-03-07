import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ingredientService } from '@/app/services/ingredientService'
import type { CreateIngredientParams } from '@/app/types/ingredient'

export function useCreateIngredient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreateIngredientParams) => ingredientService.create(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
    },
  })
}
