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
