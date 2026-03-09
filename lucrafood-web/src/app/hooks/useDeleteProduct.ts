import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '@/app/services/productService'

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: string) => productService.remove(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
