import { useState } from 'react'
import { useIngredients } from '@/app/hooks/useIngredients'

export function useIngredientsController() {
  const [page, setPage] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [purchaseIngredientId, setPurchaseIngredientId] = useState<string | null>(null)

  const { data, isLoading } = useIngredients({ page, limit: 12 })

  const handleOpenCreateModal = () => setIsCreateModalOpen(true)
  const handleCloseCreateModal = () => setIsCreateModalOpen(false)

  const handleOpenPurchaseModal = (id: string) => setPurchaseIngredientId(id)
  const handleClosePurchaseModal = () => setPurchaseIngredientId(null)

  return {
    ingredients: data?.ingredients ?? [],
    meta: data?.meta,
    isLoading,
    isCreateModalOpen,
    purchaseIngredientId,
    page,
    setPage,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleOpenPurchaseModal,
    handleClosePurchaseModal,
  }
}
