import { ingredientUnitSchema } from '@application/types/ingredientUnit';
import { z } from 'zod';

export const ingredientsSchema = z.object({
  ingredients: z.object({
    name: z.string().nonempty('ingredient name is required'),
    unit: ingredientUnitSchema,
  }),
});

export type IngredientsSchema = z.infer<typeof ingredientsSchema>;
