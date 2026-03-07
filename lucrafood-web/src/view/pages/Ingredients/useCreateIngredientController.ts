import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { useCreateIngredient } from '@/app/hooks/useCreateIngredient'
import { getApiErrorMessage } from '@/app/utils/getApiErrorMessage'

const createSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  baseUnit: z.enum(['g', 'kg', 'ml', 'l', 'un'] as const),
})

type FormData = z.infer<typeof createSchema>

export function useCreateIngredientController(onSuccess: () => void) {
  const { mutateAsync, isPending, error } = useCreateIngredient()
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      baseUnit: 'g',
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync({
        ingredients: {
          name: data.name,
          baseUnit: data.baseUnit,
        },
      })
      reset()
      onSuccess()
    } catch {
      // Api Error handling
    }
  })

  const apiError = error ? getApiErrorMessage(error, 'Erro ao criar ingrediente.') : null

  return {
    register,
    onSubmit,
    errors,
    isPending,
    apiError,
    reset,
  }
}
