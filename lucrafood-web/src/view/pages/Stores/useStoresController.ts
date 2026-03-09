import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { storeSchema, type StoreFormData } from '@/app/schemas'
import { useStores } from '@/app/hooks/useStores'
import { useCreateStore } from '@/app/hooks/useCreateStore'
import { getApiErrorMessage } from '@/app/utils/getApiErrorMessage'
import { toast } from 'sonner'

export function useStoresController() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: storesData, isLoading } = useStores()
  const createStore = useCreateStore()

  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
  })

  async function onSubmit(data: StoreFormData) {
    try {
      await createStore.mutateAsync({
        store: { name: data.name },
      })
      setIsModalOpen(false)
      form.reset()
      toast.success('Loja cadastrada com sucesso!')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Erro ao cadastrar loja.'))
    }
  }

  return {
    stores: storesData?.stores ?? [],
    isLoading,
    isModalOpen,
    setIsModalOpen,
    form,
    handleSubmit: form.handleSubmit(onSubmit),
    isSubmitting: createStore.isPending,
  }
}
