import { Plus, ArrowRight, ArrowLeft, Loader2, X } from 'lucide-react'
import { Button, Input, Label, Select, Badge, DialogFooter } from '@/view/components/ui'
import { UNIT_OPTIONS } from '@/app/config/constants'
import type { UseFormReturn } from 'react-hook-form'
import type { IngredientFormData } from '@/app/schemas'
import type { PackageUnit, RecipeIngredient } from '@/app/types/product'
import type { Ingredient } from '@/app/types/ingredient'

export interface AddItemFormState {
  ingredientId: string
  quantityUsed: string
  unitUsed: PackageUnit
}

interface RecipeStepProps {
  ingredientForm: UseFormReturn<IngredientFormData>
  ingredients: Ingredient[]
  recipeItems: RecipeIngredient[]
  addItemForm: AddItemFormState
  setAddItemForm: React.Dispatch<React.SetStateAction<AddItemFormState>>
  isCreatingIngredient: boolean
  setIsCreatingIngredient: (v: boolean) => void
  isCreatingIngredientPending: boolean
  onAddRecipeItem: () => void
  onRemoveRecipeItem: (id: string) => void
  onCreateIngredient: (e?: React.BaseSyntheticEvent) => void
  onNext: () => void
  onPrev: () => void
}

export function RecipeStep({
  ingredientForm,
  ingredients,
  recipeItems,
  addItemForm,
  setAddItemForm,
  isCreatingIngredient,
  setIsCreatingIngredient,
  isCreatingIngredientPending,
  onAddRecipeItem,
  onRemoveRecipeItem,
  onCreateIngredient,
  onNext,
  onPrev,
}: RecipeStepProps) {
  return (
    <div className="space-y-4">
      {/* Add ingredient form */}
      <div className="rounded-xl border border-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Adicionar ingrediente</Label>
          <button
            type="button"
            onClick={() => setIsCreatingIngredient(!isCreatingIngredient)}
            className="text-xs text-primary hover:underline cursor-pointer font-medium"
          >
            {isCreatingIngredient ? 'Cancelar' : '+ Novo ingrediente'}
          </button>
        </div>

        {/* Inline ingredient creation */}
        {isCreatingIngredient && (
          <InlineIngredientForm
            form={ingredientForm}
            isPending={isCreatingIngredientPending}
            onSubmit={onCreateIngredient}
          />
        )}

        <div className="grid grid-cols-[1fr_100px_90px_auto] gap-2 items-end">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Ingrediente</Label>
            <Select
              value={addItemForm.ingredientId}
              onChange={(e) =>
                setAddItemForm((prev) => ({ ...prev, ingredientId: e.target.value }))
              }
              disabled={ingredients.length === 0}
            >
              {ingredients.length === 0 ? (
                <option value="" disabled>Nenhum ingrediente cadastrado</option>
              ) : (
                <option value="">Selecione...</option>
              )}
              {ingredients.map((ing) => (
                <option key={ing.id} value={ing.id}>{ing.name}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Qtd.</Label>
            <Input
              type="number"
              step="any"
              placeholder="500"
              value={addItemForm.quantityUsed}
              onChange={(e) =>
                setAddItemForm((prev) => ({ ...prev, quantityUsed: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Un.</Label>
            <Select
              value={addItemForm.unitUsed}
              onChange={(e) =>
                setAddItemForm((prev) => ({
                  ...prev,
                  unitUsed: e.target.value as PackageUnit,
                }))
              }
            >
              {UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.value}</option>
              ))}
            </Select>
          </div>
          <Button
            type="button"
            size="icon"
            onClick={onAddRecipeItem}
            disabled={!addItemForm.ingredientId || !addItemForm.quantityUsed}
            className="h-11 w-11"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Recipe items list */}
      {recipeItems.length > 0 ? (
        <RecipeItemsList items={recipeItems} onRemove={onRemoveRecipeItem} />
      ) : (
        <div className="rounded-lg border border-dashed border-border py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum ingrediente adicionado ainda.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Adicione ingredientes para calcular o custo da receita.
          </p>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Voltar
        </Button>
        <Button type="button" onClick={onNext}>
          Próximo
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </DialogFooter>
    </div>
  )
}

/* ── Inline Ingredient Form ──────────────────────────────────── */

function InlineIngredientForm({
  form,
  isPending,
  onSubmit,
}: {
  form: UseFormReturn<IngredientFormData>
  isPending: boolean
  onSubmit: (e?: React.BaseSyntheticEvent) => void
}) {
  return (
    <div className="rounded-lg bg-accent/50 p-3 space-y-2.5">
      <div className="space-y-1.5">
        <Label className="text-xs">Nome do ingrediente</Label>
        <Input placeholder="Ex: Farinha de Trigo" {...form.register('name')} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Unidade base</Label>
          <Select {...form.register('baseUnit')}>
            {UNIT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Preço total (R$)</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="0,00"
            {...form.register('totalPrice', { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Qtd. embalagem</Label>
          <Input
            type="number"
            step="any"
            placeholder="1"
            {...form.register('packageQty', { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Un. embalagem</Label>
          <Select {...form.register('packageUnit')}>
            {UNIT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        onClick={onSubmit}
        disabled={isPending}
        className="w-full"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 w-3 h-3 animate-spin" />
            Criando...
          </>
        ) : (
          <>
            <Plus className="mr-1.5 w-3 h-3" />
            Criar ingrediente
          </>
        )}
      </Button>
    </div>
  )
}

/* ── Recipe Items List ───────────────────────────────────────── */

function RecipeItemsList({
  items,
  onRemove,
}: {
  items: RecipeIngredient[]
  onRemove: (id: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">
        Ingredientes adicionados ({items.length})
      </Label>
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.ingredientId}
            className="flex items-center justify-between rounded-lg bg-accent/50 px-3 py-2.5"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {item.ingredientName}
              </span>
              <Badge variant="secondary">
                {item.quantityUsed} {item.unitUsed}
              </Badge>
            </div>
            <button
              type="button"
              onClick={() => onRemove(item.ingredientId)}
              className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
