import { PACKAGE_UNITS } from '@shared/types/PackageUnit';
import { z } from 'zod';

export const productSchema = z.object({
  product: z.object({
    name: z.string().nonempty('Product name is required'),
    yieldQty: z.number({
      message: 'yieldQty must be a number',
    })
      .positive({
        message: 'yieldQty must be greater than 0',
      }),
    yieldUnit: z.enum(PACKAGE_UNITS, {
      message: 'yieldUnit is invalid',
    }),

  }),
});

export type ProductBody = z.infer<typeof productSchema>;
