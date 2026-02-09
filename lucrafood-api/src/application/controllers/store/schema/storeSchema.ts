import { z } from 'zod';

export const storeSchema = z.object({
  store: z.object({
    name: z.string()
      .trim()
      .min(1, 'Store name is required'),
  }),
});

export type storeBody = z.infer<typeof storeSchema>;
