import { z } from 'zod';

export const productUpdateSalePiceSchema = z.object({
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

export type ProductUpdateSalePiceBody = z.infer<typeof productUpdateSalePiceSchema>;
