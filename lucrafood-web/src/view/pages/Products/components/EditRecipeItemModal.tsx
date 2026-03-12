import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/view/components/ui'
import { Button } from '@/view/components/ui'
import { Input } from '@/view/components/ui'
import { Select } from '@/view/components/ui'
import { Label } from '@/view/components/ui'
import { useUpdateRecipeItem } from '@/app/hooks/useUpdateRecipeItem'
import { recipeItemSchema } from '@/app/schemas'
import type { RecipeItemFormData } from '@/app/schemas'
import type { RecipeItem } from '@/app/types/product'
import { UNIT_OPTIONS } from '@/app/config/constants'
import { getApiErrorMessage } from '@/app/utils/getApiErrorMessage'
import toast from 'react-hot-toast'

interface EditRecipeItemModalProps {
  open: boolean
  onClose: () => void
  productId: string
  item: RecipeItem | null
}

export function EditRecipeItemModal({ open, onClose, productId, item }: EditRecipeItemModalProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const { mutate: updateRecipeItem, isPending } = useUpdateRecipeItem()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<RecipeItemFormData>({
    resolver: zodResolver(recipeItemSchema),
    defaultValues: {
      quantityUsed: item ? parseFloat(item.quantity) : 0,
      unitUsed: (item?.unit as any) || 'un',
    },
  })

  const unitUsed = watch('unitUsed')

  const onSubmit = (data: RecipeItemFormData) => {
    if (!item) return

    setApiError(null)
    updateRecipeItem(
      {
        productId,
        recipeItemId: item.ingredientId,
        recipeItem: data,
      },
      {
        onSuccess: () => {
          toast.success('Item da receita atualizado!')
          reset()
          onClose()
        },
        onError: (error) => {
          const message = getApiErrorMessage(error)
          setApiError(message)
          toast.error(message)
        },
      },
    )
  }

  const handleClose = () => {
    setApiError(null)
    reset()
    onClose()
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar item da receita</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {apiError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{apiError}</div>
          )}

          {/* Ingrediente (read-only) */}
          <div className="space-y-2">
            <Label>Ingrediente</Label>
            <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
              {item.ingredientName || 'Ingrediente desconhecido'}
            </div>
          </div>

          {/* Quantidade */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              step="0.0001"
              placeholder="0.00"
              {...register('quantityUsed', { valueAsNumber: true })}
              disabled={isPending}
            />
            {errors.quantityUsed && (
              <p className="text-sm text-destructive">{errors.quantityUsed.message}</p>
            )}
          </div>

          {/* Unidade */}
          <div className="space-y-2">
            <Label htmlFor="unit">Unidade</Label>
            <Select {...register('unitUsed')} disabled={isPending}>
              {UNIT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {errors.unitUsed && <p className="text-sm text-destructive">{errors.unitUsed.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
