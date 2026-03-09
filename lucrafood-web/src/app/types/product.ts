export type PackageUnit = 'g' | 'kg' | 'ml' | 'l' | 'un'

export interface RecipeIngredient {
  ingredientId: string
  ingredientName: string
  quantityUsed: number
  unitUsed: PackageUnit
}

export interface Product {
  id: string
  name: string
  yieldQty: number
  yieldUnit: PackageUnit
  createdAt: string
  items: RecipeItem[]
}

export interface RecipeItem {
  ingredientId: string
  ingredientName: string | null
  quantity: string
  unit: string
}

export interface RecipeItemWithCost extends RecipeItem {
  cost: number | null
}

export interface ProductFinancials {
  totalCost: number
  unitCost: number
  grossProfit: number
  profitMargin: number
  suggestedPrice: number | null
}

export interface ProductWithFinancials {
  id: string
  name: string
  yieldQty: number
  yieldUnit: string
  salePrice: number
  targetMargin: number | null
  createdAt: string
  items: RecipeItemWithCost[]
  financials: ProductFinancials
}

export interface CreateProductParams {
  product: {
    name: string
    yieldQty: number
    yieldUnit: PackageUnit
    salePrice: number
    targetMargin?: number
  }
}

export interface UpdateProductParams {
  productId: string
  product: {
    name?: string
    yieldQty?: number
    yieldUnit?: PackageUnit
    targetMargin?: number | null
  }
}

export interface UpdateSalePriceParams {
  productId: string
  product: {
    salePrice: number
  }
}

export interface CreateRecipeParams {
  productId: string
  productRecipe: {
    ingredientId: string
    quantityUsed: number
    unitUsed: PackageUnit
  }[]
}

export interface AddRecipeItemParams {
  productId: string
  productRecipe: {
    ingredientId: string
    quantityUsed: number
    unitUsed: PackageUnit
  }[]
}

export interface PaginationMeta {
  page: number
  limit: number
  pageItems: number
  totalPages: number
}

export interface ProductsResponse {
  products: Product[]
  meta: PaginationMeta & { totalProducts: number }
}

export interface ProductsFinancialsResponse {
  products: ProductWithFinancials[]
  meta: PaginationMeta & { totalProducts: number }
}
