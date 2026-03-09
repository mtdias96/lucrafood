import { useProductsFinancials } from '@/app/hooks/useProductsFinancials'
import { useDeleteProduct } from '@/app/hooks/useDeleteProduct'
import { useCallback, useState } from 'react'

export function useProductsController() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { data, isLoading } = useProductsFinancials({ limit: 50 })
  const deleteProduct = useDeleteProduct()

  const products = data?.products ?? []

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
    isLoading,
    isCreateModalOpen,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleDeleteProduct,
    isDeletingProduct: deleteProduct.isPending,
  }
}
