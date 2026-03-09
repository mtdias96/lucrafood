import { useQuery } from '@tanstack/react-query'
import { ingredientService } from '@/app/services/ingredientService'

export function useIngredients(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['ingredients', params],
    queryFn: () => ingredientService.getAll(params),
  })
}
