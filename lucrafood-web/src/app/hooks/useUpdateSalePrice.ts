import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '@/app/services/productService'
import type { UpdateSalePriceParams } from '@/app/types/product'

export function useUpdateSalePrice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: UpdateSalePriceParams) =>
      productService.updateSalePrice(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
