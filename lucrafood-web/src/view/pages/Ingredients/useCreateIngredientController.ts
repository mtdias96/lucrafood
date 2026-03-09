import { useCreateIngredient } from '@/app/hooks/useCreateIngredient'
import { useRegisterPurchase } from '@/app/hooks/useRegisterPurchase'
import { useStores } from '@/app/hooks/useStores'
import { ingredientWithStoreSchema, type IngredientWithStoreFormData } from '@/app/schemas'
import { getApiErrorMessage } from '@/app/utils/getApiErrorMessage'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function useCreateIngredientController(onSuccess: () => void) {
  const [apiError, setApiError] = useState<string | null>(null)
  const createIngredient = useCreateIngredient()
  const registerPurchase = useRegisterPurchase()
  const { data: storesData } = useStores()

  const form = useForm<IngredientWithStoreFormData>({
    resolver: zodResolver(ingredientWithStoreSchema),
    defaultValues: {
      baseUnit: 'g',
      packageUnit: 'g',
      storeId: '',
    },
  })

  // Sync packageUnit with baseUnit for convenience
  const baseUnit = form.watch('baseUnit')
  useEffect(() => {
    form.setValue('packageUnit', baseUnit)
  }, [baseUnit, form])

  const handleSubmit = form.handleSubmit(async (data) => {
    setApiError(null)

    try {
      const { ingredient } = await createIngredient.mutateAsync({
        ingredients: {
          name: data.name,
          baseUnit: data.baseUnit,
        },
      })

      await registerPurchase.mutateAsync({
        ingredientId: ingredient.id,
        ingredientPurchase: {
          storeId: data.storeId || null,
          packageQty: data.packageQty,
          packageUnit: data.packageUnit,
          totalPrice: data.totalPrice,
        },
      })

      toast.success('Ingrediente e preço registrados com sucesso!')
      form.reset()
      onSuccess()
    } catch (err) {
      const message = getApiErrorMessage(err, 'Ocorreu um erro ao processar o ingrediente.')
      setApiError(message)
      toast.error(message)
    }
  })

  return {
    form,
    handleSubmit,
    apiError,
    stores: storesData?.stores ?? [],
    isPending: createIngredient.isPending || registerPurchase.isPending,
  }
}
