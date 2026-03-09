import { ArrowLeft, DollarSign, Target, Loader2 } from 'lucide-react'
import { Button, Input, Label, DialogFooter } from '@/view/components/ui'
import type { UseFormReturn } from 'react-hook-form'
import type { PricingFormData, ProductFormData } from '@/app/schemas'
import type { RecipeIngredient } from '@/app/types/product'

interface PricingStepProps {
  pricingForm: UseFormReturn<PricingFormData>
  productForm: UseFormReturn<ProductFormData>
  recipeItems: RecipeIngredient[]
  isPending: boolean
  onSubmit: (e?: React.BaseSyntheticEvent) => void
  onPrev: () => void
}

export function PricingStep({
  pricingForm,
  productForm,
  recipeItems,
  isPending,
  onSubmit,
  onPrev,
}: PricingStepProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="sale-price" className="flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-primary" />
          Preço de venda (R$)
        </Label>
        <Input
          id="sale-price"
          type="number"
          step="0.01"
          placeholder="15.00"
          {...pricingForm.register('salePrice', { valueAsNumber: true })}
        />
        {pricingForm.formState.errors.salePrice && (
          <p className="text-xs text-destructive">
            {pricingForm.formState.errors.salePrice.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="target-margin" className="flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-primary" />
          Margem de lucro ideal (%)
        </Label>
        <Input
          id="target-margin"
          type="number"
          step="0.1"
          placeholder="30"
          {...pricingForm.register('targetMargin', { valueAsNumber: true })}
        />
        {pricingForm.formState.errors.targetMargin && (
          <p className="text-xs text-destructive">
            {pricingForm.formState.errors.targetMargin.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Opcional. Após o cadastro, o sistema calculará o preço sugerido com base nesta margem.
        </p>
      </div>

      {/* Summary preview */}
      <ProductSummary
        productForm={productForm}
        pricingForm={pricingForm}
        recipeItemsCount={recipeItems.length}
      />

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Voltar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Criando...
            </>
          ) : (
            'Criar Produto'
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

/* ── Summary Card ────────────────────────────────────────────── */

function ProductSummary({
  productForm,
  pricingForm,
  recipeItemsCount,
}: {
  productForm: UseFormReturn<ProductFormData>
  pricingForm: UseFormReturn<PricingFormData>
  recipeItemsCount: number
}) {
  const salePrice = pricingForm.watch('salePrice')

  return (
    <div className="rounded-xl bg-accent/30 border border-border p-4 space-y-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Resumo do produto
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Produto</p>
          <p className="text-sm font-medium text-foreground">
            {productForm.getValues('name') || '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Rendimento</p>
          <p className="text-sm font-medium text-foreground">
            {productForm.getValues('yieldQty') || '—'}{' '}
            {productForm.getValues('yieldUnit') || ''}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Ingredientes</p>
          <p className="text-sm font-medium text-foreground">
            {recipeItemsCount} itens na receita
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Preço de venda</p>
          <p className="text-sm font-medium text-foreground">
            {salePrice ? `R$ ${Number(salePrice).toFixed(2)}` : '—'}
          </p>
        </div>
      </div>
    </div>
  )
}
