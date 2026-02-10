import { PACKAGE_UNITS } from '@shared/types/PackageUnit';
import { z } from 'zod';

export const productRecipeSchema = z.object({
  productRecipe: z.object({
    ingredientId: z.uuid(),

    quantityUsed: z.number({
      message: 'quantityUsed must be a number',
    })
      .positive({
        message: 'quantityUsed must be greater than 0',
      }),

    unitUsed: z.enum(PACKAGE_UNITS, {
      message: 'unitUsed is invalid',
    }),

  }),
});

export type ProductRecipeBody = z.infer<typeof productRecipeSchema>;
