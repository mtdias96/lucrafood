import { unitEnum } from '@infra/database/drizzle/schemas';
import { z } from 'zod';

export const ingredientsSchema = z.object({
  ingredients: z.object({
    name: z.string().nonempty('ingredient name is required'),
    baseUnit: z.enum(unitEnum.enumValues),
  }),
});

export type IngredientsBody = z.infer<typeof ingredientsSchema>;
