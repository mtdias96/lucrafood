import { PACKAGE_UNITS } from '@shared/types/PackageUnit';
import { pgEnum } from 'drizzle-orm/pg-core';

export const unitEnum = pgEnum('unit', PACKAGE_UNITS);
