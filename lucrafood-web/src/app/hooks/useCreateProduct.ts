import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '@/app/services/productService'
import type { CreateProductParams } from '@/app/types/product'

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreateProductParams) => productService.create(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
