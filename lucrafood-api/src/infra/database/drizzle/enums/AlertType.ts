import { pgEnum } from 'drizzle-orm/pg-core';

export const ALERT_TYPES = [
  'INGREDIENT_PRICE_INCREASE',
  'PRODUCT_UNPROFITABLE',
  'MARGIN_BELOW_TARGET',
] as const;

export type AlertType = (typeof ALERT_TYPES)[number];

export const alertTypeEnum = pgEnum('alert_type', ALERT_TYPES);
