import { useQuery } from '@tanstack/react-query'
import { productService } from '@/app/services/productService'

export function useProductsFinancials(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['products', 'financials', params],
    queryFn: () => productService.getAllWithFinancials(params),
  })
}
