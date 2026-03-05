import { z } from 'zod';

export const simulateSalePriceSchema = z.object({
  simulatedSalePrice: z.coerce
    .number({ message: 'simulatedSalePrice must be a number' })
    .positive({ message: 'simulatedSalePrice must be greater than 0' }),
});

export type SimulateSalePriceBody = z.infer<typeof simulateSalePriceSchema>;
