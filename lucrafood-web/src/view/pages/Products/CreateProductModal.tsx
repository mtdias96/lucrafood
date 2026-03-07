import {
  Plus,
  ArrowRight,
  ArrowLeft,
  Loader2,
  X,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogCloseButton,
  DialogFooter,
  Button,
  Input,
  Label,
  Select,
  Badge,
} from '@/view/components/ui'
import {
  useCreateProductController,
} from './useCreateProductController'
import type { PackageUnit } from '@/app/types/product'

interface CreateProductModalProps {
  open: boolean
  onClose: () => void
}

const UNIT_OPTIONS: { value: PackageUnit; label: string }[] = [
  { value: 'g', label: 'Gramas (g)' },
  { value: 'kg', label: 'Quilogramas (kg)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'l', label: 'Litros (l)' },
  { value: 'un', label: 'Unidade (un)' },
]

export function CreateProductModal({ open, onClose }: CreateProductModalProps) {
  const controller = useCreateProductController(() => {
    onClose()
  })

  const handleClose = () => {
    controller.handleReset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className="max-w-xl">
        <DialogCloseButton onClose={handleClose} />
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            {/* Step indicator */}
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  controller.step === 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-primary/20 text-primary'
                }`}
              >
                1
              </div>
              <div className="w-8 h-0.5 bg-border rounded-full">
                <div
                  className={`h-full bg-primary rounded-full transition-all duration-300 ${
                    controller.step === 2 ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  controller.step === 2
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                2
              </div>
            </div>
          </div>
          <DialogTitle>
            {controller.step === 1 ? 'Dados do Produto' : 'Monte a Receita'}
          </DialogTitle>
          <DialogDescription>
            {controller.step === 1
              ? 'Informe os dados básicos do seu produto.'
              : 'Adicione os ingredientes e quantidades usadas.'}
          </DialogDescription>
        </DialogHeader>

        {controller.apiError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {controller.apiError}
          </div>
        )}

        {controller.step === 1 && (
          <form onSubmit={controller.handleNextStep} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="product-name">Nome do produto</Label>
              <Input
                id="product-name"
                placeholder="Ex: Bolo de Chocolate"
                {...controller.productForm.register('name')}
              />
              {controller.productForm.formState.errors.name && (
                <p className="text-xs text-destructive">
                  {controller.productForm.formState.errors.name.message}
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
                  {...controller.productForm.register('yieldQty', { valueAsNumber: true })}
                />
                {controller.productForm.formState.errors.yieldQty && (
                  <p className="text-xs text-destructive">
                    {controller.productForm.formState.errors.yieldQty.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="yield-unit">Unidade</Label>
                <Select
                  id="yield-unit"
                  {...controller.productForm.register('yieldUnit')}
                >
                  {UNIT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sale-price">Preço de venda (R$)</Label>
              <Input
                id="sale-price"
                type="number"
                step="0.01"
                placeholder="15.00"
                {...controller.productForm.register('salePrice', { valueAsNumber: true })}
              />
              {controller.productForm.formState.errors.salePrice && (
                <p className="text-xs text-destructive">
                  {controller.productForm.formState.errors.salePrice.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Próximo
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </DialogFooter>
          </form>
        )}

        {controller.step === 2 && (
          <div className="space-y-4">
            {/* Add ingredient form */}
            <div className="rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Adicionar ingrediente</Label>
                <button
                  type="button"
                  onClick={() => controller.setIsCreatingIngredient(!controller.isCreatingIngredient)}
                  className="text-xs text-primary hover:underline cursor-pointer font-medium"
                >
                  {controller.isCreatingIngredient ? 'Cancelar' : '+ Novo ingrediente'}
                </button>
              </div>

              {/* Inline ingredient creation */}
              {controller.isCreatingIngredient && (
                <div className="rounded-lg bg-accent/50 p-3 space-y-2.5">
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <Input
                      placeholder="Nome do ingrediente"
                      {...controller.ingredientForm.register('name')}
                    />
                    <Select
                      {...controller.ingredientForm.register('baseUnit')}
                      className="w-28"
                    >
                      {UNIT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={controller.handleCreateIngredient}
                    disabled={controller.isCreatingIngredientPending}
                    className="w-full"
                  >
                    {controller.isCreatingIngredientPending ? (
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
              )}

              <div className="grid grid-cols-[1fr_100px_90px_auto] gap-2 items-end">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Ingrediente</Label>
                  <Select
                    value={controller.addItemForm.ingredientId}
                    onChange={(e) =>
                      controller.setAddItemForm((prev) => ({
                        ...prev,
                        ingredientId: e.target.value,
                      }))
                    }
                  >
                    <option value="">Selecione...</option>
                    {controller.ingredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Qtd.</Label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="500"
                    value={controller.addItemForm.quantityUsed}
                    onChange={(e) =>
                      controller.setAddItemForm((prev) => ({
                        ...prev,
                        quantityUsed: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Un.</Label>
                  <Select
                    value={controller.addItemForm.unitUsed}
                    onChange={(e) =>
                      controller.setAddItemForm((prev) => ({
                        ...prev,
                        unitUsed: e.target.value as PackageUnit,
                      }))
                    }
                  >
                    {UNIT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.value}
                      </option>
                    ))}
                  </Select>
                </div>
                <Button
                  type="button"
                  size="icon"
                  onClick={controller.handleAddRecipeItem}
                  disabled={!controller.addItemForm.ingredientId || !controller.addItemForm.quantityUsed}
                  className="h-11 w-11"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Recipe items list */}
            {controller.recipeItems.length > 0 ? (
              <div className="space-y-2">
                <Label className="text-sm">
                  Ingredientes adicionados ({controller.recipeItems.length})
                </Label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {controller.recipeItems.map((item) => (
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
                        onClick={() => controller.handleRemoveRecipeItem(item.ingredientId)}
                        className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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
              <Button type="button" variant="outline" onClick={controller.handlePrevStep}>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Voltar
              </Button>
              <Button
                type="button"
                onClick={controller.handleSubmit}
                disabled={controller.isPending}
              >
                {controller.isPending ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Produto'
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
