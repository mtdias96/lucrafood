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
import { useAddPurchaseController } from './useAddPurchaseController'
import { Loader2 } from 'lucide-react'

interface AddPurchaseModalProps {
  ingredientId: string
  open: boolean
  onClose: () => void
}

const UNIT_OPTIONS = [
  { value: 'g', label: 'Gramas (g)' },
  { value: 'kg', label: 'Quilogramas (kg)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'l', label: 'Litros (l)' },
  { value: 'un', label: 'Unidade (un)' },
]

export function AddPurchaseModal({ ingredientId, open, onClose }: AddPurchaseModalProps) {
  const controller = useAddPurchaseController(ingredientId, () => {
    onClose()
  })

  const handleClose = () => {
    controller.reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogCloseButton onClose={handleClose} />
        <DialogHeader>
          <DialogTitle>Registrar Compra</DialogTitle>
          <DialogDescription>
            Informe os dados da última compra para atualizar os custos desse ingrediente no sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={controller.onSubmit} className="space-y-4">
          {controller.apiError && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {controller.apiError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="purchase-qty">Quantidade comprada</Label>
              <Input
                id="purchase-qty"
                type="number"
                step="any"
                placeholder="Ex: 5"
                disabled={controller.isPending}
                {...controller.register('packageQty', { valueAsNumber: true })}
              />
              {controller.errors.packageQty && (
                <p className="text-xs text-destructive">{controller.errors.packageQty.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="purchase-unit">Unidade (embalagem)</Label>
              <Select
                id="purchase-unit"
                disabled={controller.isPending}
                {...controller.register('packageUnit')}
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
            <Label htmlFor="purchase-price">Preço total pago (R$)</Label>
            <Input
              id="purchase-price"
              type="number"
              step="0.01"
              placeholder="Ex: 25.50"
              disabled={controller.isPending}
              {...controller.register('totalPrice', { valueAsNumber: true })}
            />
            {controller.errors.totalPrice && (
              <p className="text-xs text-destructive">{controller.errors.totalPrice.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Valor total pago pela quantidade informada acima.
            </p>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose} disabled={controller.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={controller.isPending}>
              {controller.isPending ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Compra'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
