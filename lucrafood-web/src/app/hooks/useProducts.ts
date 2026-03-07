import { useQuery } from '@tanstack/react-query'
import { productService } from '@/app/services/productService'

export function useProducts(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getAll(params),
  })
}
