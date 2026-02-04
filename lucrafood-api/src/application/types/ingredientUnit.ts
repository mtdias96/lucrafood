import { z } from 'zod';

export const INGREDIENT_UNITS = ['g', 'ml', 'un', 'kg', 'l'] as const;

export type IngredientUnit = (typeof INGREDIENT_UNITS)[number];

export const ingredientUnitSchema = z.enum(INGREDIENT_UNITS);
