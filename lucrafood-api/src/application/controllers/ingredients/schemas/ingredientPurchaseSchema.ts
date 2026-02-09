
import { PACKAGE_UNITS } from '@shared/types/PackageUnit';
import { z } from 'zod';

export const ingredientPurchaseSchema = z.object({
  ingredientPurchase: z.object({
    storeId: z.uuid().optional().nullable(),

    packageQty: z.coerce
      .number({
        message: 'packageQty must be a number',
      })
      .positive({
        message: 'packageQty must be greater than 0',
      }),

    packageUnit: z.enum(PACKAGE_UNITS, {
      message: 'packageUnit is invalid',
    }),

    totalPrice: z.coerce
      .number({
        message: 'totalPrice must be a number',
      })
      .positive({
        message: 'totalPrice must be greater than 0',
      }),
  }),
});

export type IngredientPurchaseBody =
  z.infer<typeof ingredientPurchaseSchema>;
