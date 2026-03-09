import { ArrowRight } from 'lucide-react'
import { Button, Input, Label, Select, DialogFooter } from '@/view/components/ui'
import { UNIT_OPTIONS } from '@/app/config/constants'
import type { UseFormReturn } from 'react-hook-form'
import type { ProductFormData } from '@/app/schemas'

interface ProductStepProps {
  form: UseFormReturn<ProductFormData>
  onSubmit: (e?: React.BaseSyntheticEvent) => void
  onCancel: () => void
}

export function ProductStep({ form, onSubmit, onCancel }: ProductStepProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="product-name">Nome do produto</Label>
        <Input
          id="product-name"
          placeholder="Ex: Bolo de Chocolate"
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <p className="text-xs text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="yield-qty">Rendimento</Label>
          <Input
            id="yield-qty"
            type="number"
            step="any"
            placeholder="10"
            {...form.register('yieldQty', { valueAsNumber: true })}
          />
          {form.formState.errors.yieldQty && (
            <p className="text-xs text-destructive">
              {form.formState.errors.yieldQty.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="yield-unit">Unidade</Label>
          <Select id="yield-unit" {...form.register('yieldUnit')}>
            {UNIT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Próximo
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </DialogFooter>
    </form>
  )
}
