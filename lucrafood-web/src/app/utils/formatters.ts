export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function getUnitLabel(unit: string): string {
  const map: Record<string, string> = {
    g: 'Gramas (g)',
    kg: 'Quilos (kg)',
    ml: 'Mililitros (ml)',
    l: 'Litros (l)',
    un: 'Unidade (un)',
  }
  return map[unit] || unit
}
