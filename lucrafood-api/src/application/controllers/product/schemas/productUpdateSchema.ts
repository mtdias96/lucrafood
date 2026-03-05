import { PACKAGE_UNITS } from '@shared/types/PackageUnit';
import { z } from 'zod';

export const productUpdateSchema = z.object({
  product: z.object({
    name: z.string().nonempty('Product name is required').optional(),
    yieldQty: z.number({
      message: 'yieldQty must be a number',
    })
      .positive({
        message: 'yieldQty must be greater than 0',
      })
      .optional(),
    yieldUnit: z.enum(PACKAGE_UNITS, {
      message: 'yieldUnit is invalid',
    }).optional(),
    targetMargin: z.coerce
      .number({ message: 'targetMargin must be a number' })
      .min(0, { message: 'targetMargin must be between 0 and 100' })
      .max(100, { message: 'targetMargin must be between 0 and 100' })
      .nullable()
      .optional(),
  }),
});

export type ProductUpdateBody = z.infer<typeof productUpdateSchema>;
