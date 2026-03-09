import { useIngredients } from '@/app/hooks/useIngredients'
import { useCallback, useState } from 'react'

export function useIngredientsController() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { data: ingredientsData, isLoading } = useIngredients({ limit: 50 })

  const ingredients = ingredientsData?.ingredients ?? []

  const handleOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true)
  }, [])

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false)
  }, [])

  return {
    ingredients,
    isLoading,
    isCreateModalOpen,
    handleOpenCreateModal,
    handleCloseCreateModal,
  }
}
