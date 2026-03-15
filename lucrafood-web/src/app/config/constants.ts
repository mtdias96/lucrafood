import type { PackageUnit } from '@/app/types/product'

export const STORAGE_KEYS = {
  ACCESS_TOKEN: import.meta.env.VITE_STORAGE_ACCESS_TOKEN || '@lucrafood:accessToken',
} as const

export const UNIT_OPTIONS: { value: PackageUnit; label: string }[] = [
  { value: 'g', label: 'Gramas (g)' },
  { value: 'kg', label: 'Quilogramas (kg)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'l', label: 'Litros (l)' },
  { value: 'un', label: 'Unidade (un)' },
]

const UNIT_CATEGORY: Record<PackageUnit, 'weight' | 'volume' | 'count'> = {
  g: 'weight',
  kg: 'weight',
  ml: 'volume',
  l: 'volume',
  un: 'count',
}

export function getUnitCategory(unit: PackageUnit): 'weight' | 'volume' | 'count' {
  return UNIT_CATEGORY[unit]
}

export function areUnitsCompatible(unitA: PackageUnit, unitB: PackageUnit): boolean {
  return getUnitCategory(unitA) === getUnitCategory(unitB)
}

export function getCompatibleUnits(baseUnit: PackageUnit): { value: PackageUnit; label: string }[] {
  const category = getUnitCategory(baseUnit)
  return UNIT_OPTIONS.filter(opt => getUnitCategory(opt.value) === category)
}
