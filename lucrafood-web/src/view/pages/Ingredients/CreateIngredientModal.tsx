import { Loader2 } from 'lucide-react'
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
} from '@/view/components/ui'
import { UNIT_OPTIONS } from '@/app/config/constants'
import { useCreateIngredientController } from './useCreateIngredientController'

interface CreateIngredientModalProps {
  open: boolean
  onClose: () => void
}

export function CreateIngredientModal({ open, onClose }: CreateIngredientModalProps) {
  const controller = useCreateIngredientController(onClose)

  const handleClose = () => {
    controller.form.reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className="max-w-md">
        <DialogCloseButton onClose={handleClose} />
        <DialogHeader>
          <DialogTitle>Novo ingrediente</DialogTitle>
          <DialogDescription>
            Crie um ingrediente para poder compor as receitas dos seus produtos.
          </DialogDescription>
        </DialogHeader>

        {controller.apiError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {controller.apiError}
          </div>
        )}

        <form onSubmit={controller.handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ingredient-name">Nome do ingrediente</Label>
            <Input
              id="ingredient-name"
              placeholder="Ex: Farinha de Trigo"
              {...controller.form.register('name')}
            />
            {controller.form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {controller.form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="base-unit">Unidade base</Label>
              <Select id="base-unit" {...controller.form.register('baseUnit')}>
                {UNIT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
              {controller.form.formState.errors.baseUnit && (
                <p className="text-xs text-destructive">
                  {controller.form.formState.errors.baseUnit.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="total-price">Preço total pago (R$)</Label>
              <Input
                id="total-price"
                type="number"
                step="0.01"
                placeholder="0,00"
                {...controller.form.register('totalPrice', { valueAsNumber: true })}
              />
              {controller.form.formState.errors.totalPrice && (
                <p className="text-xs text-destructive">
                  {controller.form.formState.errors.totalPrice.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="package-qty">Qtd. na embalagem</Label>
              <Input
                id="package-qty"
                type="number"
                step="any"
                placeholder="1"
                {...controller.form.register('packageQty', { valueAsNumber: true })}
              />
              {controller.form.formState.errors.packageQty && (
                <p className="text-xs text-destructive">
                  {controller.form.formState.errors.packageQty.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="package-unit">Unidade da embalagem</Label>
              <Select id="package-unit" {...controller.form.register('packageUnit')}>
                {UNIT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
              {controller.form.formState.errors.packageUnit && (
                <p className="text-xs text-destructive">
                  {controller.form.formState.errors.packageUnit.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="store-id">Loja / Fornecedor (Opcional)</Label>
            <Select id="store-id" {...controller.form.register('storeId')}>
              <option value="">Selecione uma loja</option>
              {controller.stores.map((store) => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </Select>
            <p className="text-[10px] text-muted-foreground">
              Dica: Cadastre suas lojas no menu "Lojas" para acompanhar o histórico por estabelecimento.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={controller.isPending}>
              {controller.isPending ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Cadastrar Ingrediente'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
