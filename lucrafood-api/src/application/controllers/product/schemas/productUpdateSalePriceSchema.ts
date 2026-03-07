import { z } from 'zod';

export const productUpdateSalePriceSchema = z.object({
  product: z.object({
     salePrice: z.coerce
      .number({
        message: 'salePrice must be a number',
      })
      .positive({
        message: 'salePrice must be greater than 0',
      }),
  }),
});

export type ProductUpdateSalePriceBody = z.infer<typeof productUpdateSalePriceSchema>;
