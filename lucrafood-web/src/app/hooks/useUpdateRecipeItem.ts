import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '@/app/services/productService'
import type { UpdateRecipeItemParams } from '@/app/types/product'

export function useUpdateRecipeItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: UpdateRecipeItemParams) => productService.updateRecipeItem(params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}
