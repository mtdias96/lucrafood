import { z } from 'zod';

export const simulateIngredientPriceSchema = z.object({
  simulatedUnitPrice: z.coerce
    .number({ message: 'simulatedUnitPrice must be a number' })
    .positive({ message: 'simulatedUnitPrice must be greater than 0' }),
});

export type SimulateIngredientPriceBody = z.infer<typeof simulateIngredientPriceSchema>;
