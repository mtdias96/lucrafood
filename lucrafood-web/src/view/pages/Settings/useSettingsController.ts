import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { useCreateStore } from '@/app/hooks/useCreateStore'
import { getApiErrorMessage } from '@/app/utils/getApiErrorMessage'
import { useMe } from '@/app/hooks/useMe'
import { useEffect } from 'react'

const storeSchema = z.object({
  name: z.string().min(2, 'Nome da loja deve ter pelo menos 2 caracteres'),
})

type StoreFormData = z.infer<typeof storeSchema>

export function useSettingsController() {
  const { data: user, isPending: isFetchingUser } = useMe()
  const { mutateAsync, isPending, error } = useCreateStore()
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: '',
    },
  })

  // Set default value when user data loads
  useEffect(() => {
    if (user?.store?.name) {
      reset({ name: user.store.name })
    }
  }, [user, reset])

  // Disable if already has a store
  const hasStore = !!user?.storeId

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSuccess(false)
      await mutateAsync({ name: data.name })
      setIsSuccess(true)
      reset({ name: data.name })
    } catch {
      // handled by getApiErrorMessage
    }
  })

  const apiError = error ? getApiErrorMessage(error, 'Erro ao criar loja.') : null

  return {
    register,
    onSubmit,
    errors,
    isPending,
    isFetchingUser,
    isSuccess,
    apiError,
    hasStore,
    storeName: user?.store?.name,
  }
}
