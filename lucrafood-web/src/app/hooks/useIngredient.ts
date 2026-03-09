import { useQuery } from '@tanstack/react-query'
import { ingredientService } from '../services/ingredientService'

export function useIngredient(id: string) {
  return useQuery({
    queryKey: ['ingredients', id],
    queryFn: () => ingredientService.getById(id),
    enabled: !!id,
  })
}
