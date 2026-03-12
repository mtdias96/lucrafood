import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '@/app/services/productService'

interface RemoveRecipeItemParams {
  productId: string
  recipeItemId: string
}

export function useRemoveRecipeItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, recipeItemId }: RemoveRecipeItemParams) =>
      productService.removeRecipeItem(productId, recipeItemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}
