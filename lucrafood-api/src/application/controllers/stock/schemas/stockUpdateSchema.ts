import { z } from 'zod';
import { PACKAGE_UNITS } from '@shared/types/PackageUnit';

export const stockUpdateSchema = z.object({
  stock: z.object({
    currentQty: z.number({ message: 'currentQty must be a number' }).min(0, 'currentQty cannot be negative'),
    minQty: z.number({ message: 'minQty must be a number' }).min(0, 'minQty cannot be negative').optional(),
    unit: z.enum(PACKAGE_UNITS, { message: 'unit is invalid' }),
  }),
});

export type StockUpdateBody = z.infer<typeof stockUpdateSchema>;
