export const PACKAGE_UNITS = ['g', 'kg', 'ml', 'l', 'un'] as const;

export type PackageUnit = (typeof PACKAGE_UNITS)[number];
