import { httpClient } from './httpClient'
import type {
  CreateIngredientParams,
  Ingredient,
  IngredientsResponse,
  RegisterPurchaseParams,
} from '@/app/types/ingredient'

export const ingredientService = {
  async getAll(
    params?: { page?: number; limit?: number },
  ): Promise<IngredientsResponse> {
    const { data } = await httpClient.get('/ingredients', { params })
    return data
  },

  async create(
    params: CreateIngredientParams,
  ): Promise<{ ingredient: Ingredient }> {
    const { data } = await httpClient.post('/ingredients', params)
    return data
  },

  async registerPurchase(params: RegisterPurchaseParams): Promise<void> {
    const { ingredientId, ...body } = params
    await httpClient.post(`/ingredients/${ingredientId}/purchases`, body)
  },

  async getById(id: string): Promise<IngredientDetailResponse> {
    const { data } = await httpClient.get(`/ingredients/${id}`)
    return data
  },
}

export interface IngredientStats {
  currentPrice: number
  minPrice: number
  maxPrice: number
  avgPrice: number
}

export interface IngredientHistoryItem {
  id: string
  totalPrice: number
  packageQty: number
  packageUnit: string
  unitCost: number
  storeName: string | null
  createdAt: string
}

export interface IngredientDetailResponse {
  ingredient: Ingredient & {
    stats: IngredientStats
    history: IngredientHistoryItem[]
  }
}
