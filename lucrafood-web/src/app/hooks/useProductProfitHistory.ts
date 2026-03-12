import { useQuery } from '@tanstack/react-query'
import { productService } from '@/app/services/productService'

export function useProductProfitHistory(productId: string | null) {
  return useQuery({
    queryKey: ['products', productId, 'profit-history'],
    queryFn: () => productService.getProfitHistory(productId!),
    enabled: !!productId,
  })
}
