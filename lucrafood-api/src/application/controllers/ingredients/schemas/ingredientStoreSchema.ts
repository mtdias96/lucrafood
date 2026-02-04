import { z } from 'zod';

export const IngredientStoreSchema = z.object({
  ingredientStore: z.object({
    name: z.string()
      .trim()
      .min(1, 'Store name is required'),

    ingredientId: z.uuid('Ingredient id must be a valid UUID'),
  }),
});

export type IngredientStoreBody = z.infer<typeof IngredientStoreSchema>;
