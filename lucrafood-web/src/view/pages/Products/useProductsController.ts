import { useProductsFinancials } from '@/app/hooks/useProductsFinancials'
import { useDeleteProduct } from '@/app/hooks/useDeleteProduct'
import { useIngredients } from '@/app/hooks/useIngredients'
import { useCallback, useState } from 'react'

export function useProductsController() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { data, isLoading } = useProductsFinancials({ limit: 50 })
  const { data: ingredientsData } = useIngredients({ limit: 100 })
  const deleteProduct = useDeleteProduct()

  const products = data?.products ?? []
  const ingredients = ingredientsData?.ingredients ?? []

  const handleOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true)
  }, [])

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false)
  }, [])

  const handleDeleteProduct = useCallback(
    (productId: string) => {
      deleteProduct.mutate(productId)
    },
    [deleteProduct],
  )

  return {
    products,
    ingredients,
    isLoading,
    isCreateModalOpen,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleDeleteProduct,
    isDeletingProduct: deleteProduct.isPending,
  }
}
