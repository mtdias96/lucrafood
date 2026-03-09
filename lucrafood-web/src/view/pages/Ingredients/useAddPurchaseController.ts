import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { useCreatePurchase } from '@/app/hooks/useCreatePurchase'
import { getApiErrorMessage } from '@/app/utils/getApiErrorMessage'

const purchaseSchema = z.object({
  packageQty: z.number().min(0.01, 'A quantidade deve ser maior que 0'),
  packageUnit: z.enum(['g', 'kg', 'ml', 'l', 'un'] as const),
  totalPrice: z.number().min(0.01, 'O preço deve ser maior que 0'),
})

type FormData = z.infer<typeof purchaseSchema>

export function useAddPurchaseController(ingredientId: string, onSuccess: () => void) {
  const { mutateAsync, isPending, error } = useCreatePurchase()
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      packageQty: 1,
      packageUnit: 'kg',
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync({
        ingredientId,
        ingredientPurchase: {
          packageQty: data.packageQty,
          packageUnit: data.packageUnit,
          totalPrice: data.totalPrice,
        },
      })
      reset()
      onSuccess()
    } catch {
      // Api Error handling
    }
  })

  const apiError = error ? getApiErrorMessage(error, 'Erro ao registrar compra.') : null

  return {
    register,
    onSubmit,
    errors,
    isPending,
    apiError,
    reset,
  }
}
