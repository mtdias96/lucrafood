import { z } from 'zod';

export const produceSchema = z.object({
  produce: z.object({
    quantity: z.number({ message: 'quantity must be a number' }).positive('quantity must be positive'),
  }),
});

export type ProduceBody = z.infer<typeof produceSchema>;
