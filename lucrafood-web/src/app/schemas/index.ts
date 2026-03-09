import { z } from 'zod'

/* ── Shared enum ─────────────────────────────────────────────── */

export const packageUnitEnum = z.enum(['g', 'kg', 'ml', 'l', 'un'] as const)

/* ── Product schemas ─────────────────────────────────────────── */

export const productSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  yieldQty: z.number().min(1, 'Rendimento deve ser maior que 0'),
  yieldUnit: packageUnitEnum,
})

export type ProductFormData = z.infer<typeof productSchema>

export const pricingSchema = z.object({
  salePrice: z.number().min(0.01, 'Preço de venda deve ser maior que 0'),
  targetMargin: z.number().min(0).max(100).optional(),
})

export type PricingFormData = z.infer<typeof pricingSchema>

/* ── Ingredient schemas ──────────────────────────────────────── */

export const ingredientSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  baseUnit: packageUnitEnum,
  packageQty: z.number().min(0.0001, 'A quantidade deve ser maior que 0'),
  packageUnit: packageUnitEnum,
  totalPrice: z.number().min(0.01, 'O preço deve ser maior que 0'),
})

export type IngredientFormData = z.infer<typeof ingredientSchema>

export const ingredientWithStoreSchema = ingredientSchema.extend({
  storeId: z.string().optional().nullable(),
})

export type IngredientWithStoreFormData = z.infer<typeof ingredientWithStoreSchema>

/* ── Store schemas ───────────────────────────────────────────── */

export const storeSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
})

export type StoreFormData = z.infer<typeof storeSchema>
