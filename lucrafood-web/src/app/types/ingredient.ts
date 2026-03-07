import type { PackageUnit, PaginationMeta } from './product'

export interface Ingredient {
  id: string
  name: string
  baseUnit: PackageUnit
  createdAt: string
}

export interface IngredientWithStats {
  ingredient: Ingredient
  priceStats: {
    currentPrice: number | null
    minPrice: number | null
    maxPrice: number | null
    avgPrice: number | null
    purchaseCount: number
  }
}

export interface CreateIngredientParams {
  ingredients: {
    name: string
    baseUnit: PackageUnit
  }
}

export interface IngredientPurchase {
  id: string
  packageQty: number
  packageUnit: PackageUnit
  totalPrice: number
  unitPrice: number
  storeId: string | null
  purchasedAt: string
}

export interface CreatePurchaseParams {
  ingredientId: string
  ingredientPurchase: {
    packageQty: number
    packageUnit: PackageUnit
    totalPrice: number
    purchasedAt?: string
  }
}

export interface IngredientsResponse {
  ingredients: Ingredient[]
  meta: PaginationMeta & { totalIngredients: number }
}

export interface PurchasesResponse {
  purchases: IngredientPurchase[]
  meta: PaginationMeta & { totalPurchases: number }
}
