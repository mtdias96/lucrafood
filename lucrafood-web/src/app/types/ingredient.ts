import type { PaginationMeta } from './product'

export interface Ingredient {
  id: string
  name: string
  baseUnit: string
  createdAt: string
}

export interface IngredientsResponse {
  ingredients: Ingredient[]
  meta: PaginationMeta & { totalIngredients: number }
}

export interface CreateIngredientParams {
  ingredients: {
    name: string
    baseUnit: string
  }
}

export interface RegisterPurchaseParams {
  ingredientId: string
  ingredientPurchase: {
    storeId: string | null
    packageQty: number
    packageUnit: string
    totalPrice: number
  }
}
