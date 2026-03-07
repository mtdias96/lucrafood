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
import { useCreateIngredientController } from './useCreateIngredientController'
import { Loader2 } from 'lucide-react'

interface CreateIngredientModalProps {
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

export function CreateIngredientModal({ open, onClose }: CreateIngredientModalProps) {
  const controller = useCreateIngredientController(() => {
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
          <DialogTitle>Novo Ingrediente</DialogTitle>
          <DialogDescription>
            Cadastre um novo ingrediente para usa-lo em suas receitas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={controller.onSubmit} className="space-y-4">
          {controller.apiError && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {controller.apiError}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="ingredient-name">Nome do ingrediente</Label>
            <Input
              id="ingredient-name"
              placeholder="Ex: Açúcar Refinado"
              disabled={controller.isPending}
              {...controller.register('name')}
            />
            {controller.errors.name && (
              <p className="text-xs text-destructive">{controller.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ingredient-unit">Unidade base de medida</Label>
            <Select
              id="ingredient-unit"
              disabled={controller.isPending}
              {...controller.register('baseUnit')}
            >
              {UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Como você controla o estoque dessa matéria-prima?
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
                'Salvar Ingrediente'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
