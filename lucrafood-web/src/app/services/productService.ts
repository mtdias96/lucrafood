import { httpClient } from './httpClient'
import type {
  CreateProductParams,
  CreateRecipeParams,
  AddRecipeItemParams,
  UpdateProductParams,
  UpdateSalePriceParams,
  Product,
  ProductsResponse,
  ProductsFinancialsResponse,
  ProductWithFinancials,
} from '@/app/types/product'

export const productService = {
  async getAll(params?: { page?: number; limit?: number }): Promise<ProductsResponse> {
    const { data } = await httpClient.get('/products', { params })
    return data
  },

  async getAllWithFinancials(
    params?: { page?: number; limit?: number },
  ): Promise<ProductsFinancialsResponse> {
    const { data } = await httpClient.get('/products/financials', { params })
    return data
  },

  async getFinancials(productId: string): Promise<{ product: ProductWithFinancials }> {
    const { data } = await httpClient.get(`/products/${productId}/financials`)
    return data
  },

  async create(params: CreateProductParams): Promise<{ product: Product }> {
    const { data } = await httpClient.post('/products', params)
    return data
  },

  async update(params: UpdateProductParams): Promise<void> {
    const { productId, ...body } = params
    await httpClient.patch(`/products/${productId}`, body)
  },

  async updateSalePrice(params: UpdateSalePriceParams): Promise<void> {
    const { productId, ...body } = params
    await httpClient.patch(`/products/${productId}/sale-price`, body)
  },

  async remove(productId: string): Promise<void> {
    await httpClient.delete(`/products/${productId}`)
  },

  async createRecipe(params: CreateRecipeParams): Promise<void> {
    const { productId, ...body } = params
    await httpClient.post(`/products/${productId}/recipe`, body)
  },

  async addRecipeItems(params: AddRecipeItemParams): Promise<void> {
    const { productId, ...body } = params
    await httpClient.post(`/products/${productId}/recipe-items`, body)
  },
}
