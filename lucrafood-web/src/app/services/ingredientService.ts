import type {
  CreateIngredientParams,
  CreatePurchaseParams,
  Ingredient,
  IngredientsResponse,
  IngredientWithStats,
  PurchasesResponse,
} from '@/app/types/ingredient';
import { httpClient } from './httpClient';

export const ingredientService = {
  async getAll(params?: { page?: number; limit?: number }): Promise<IngredientsResponse> {

    const { data } = await httpClient.get('/ingredients', {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10
      }
    })

    return data
  },

  async getById(ingredientId: string): Promise<IngredientWithStats> {
    const { data } = await httpClient.get(`/ingredients/${ingredientId}`)
    return data
  },

  async create(params: CreateIngredientParams): Promise<{ ingredient: Ingredient }> {
    const { data } = await httpClient.post('/ingredients', params)
    return data
  },

  async getPurchases(
    ingredientId: string,
    params?: { page?: number; limit?: number },
  ): Promise<PurchasesResponse> {
    const { data } = await httpClient.get(`/ingredients/${ingredientId}/purchases`, { params })
    return data
  },

  async createPurchase(params: CreatePurchaseParams): Promise<void> {
    const { ingredientId, ...body } = params
    await httpClient.post(`/ingredients/${ingredientId}/purchases`, body)
  },
}
