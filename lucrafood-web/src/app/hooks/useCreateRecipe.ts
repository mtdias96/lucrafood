import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '@/app/services/productService'
import type { CreateRecipeParams } from '@/app/types/product'

export function useCreateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreateRecipeParams) => productService.createRecipe(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
