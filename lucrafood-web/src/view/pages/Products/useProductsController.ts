import { useProductsFinancials } from '@/app/hooks/useProductsFinancials'
import { useDeleteProduct } from '@/app/hooks/useDeleteProduct'
import { useRemoveRecipeItem } from '@/app/hooks/useRemoveRecipeItem'
import { useCallback, useState } from 'react'
import type { RecipeItem } from '@/app/types/product'

export function useProductsController() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingRecipeItem, setEditingRecipeItem] = useState<{ productId: string; item: RecipeItem } | null>(null)
  const [profitHistoryProductId, setProfitHistoryProductId] = useState<string | null>(null)
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null)

  const { data, isLoading } = useProductsFinancials({ limit: 50 })
  const deleteProduct = useDeleteProduct()
  const removeRecipeItem = useRemoveRecipeItem()

  const products = data?.products ?? []

  const handleOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true)
  }, [])

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false)
  }, [])

  const handleDeleteProduct = useCallback(
    (productId: string) => {
      setDeletingProductId(productId)
    },
    [],
  )

  const handleConfirmDeleteProduct = useCallback(
    (productId: string) => {
      deleteProduct.mutate(productId)
      setDeletingProductId(null)
    },
    [deleteProduct],
  )

  const handleCancelDeleteProduct = useCallback(() => {
    setDeletingProductId(null)
  }, [])

  const handleEditRecipeItem = useCallback((productId: string, item: RecipeItem) => {
    setEditingRecipeItem({ productId, item })
  }, [])

  const handleCloseEditRecipeItem = useCallback(() => {
    setEditingRecipeItem(null)
  }, [])

  const handleRemoveRecipeItem = useCallback(
    (productId: string, recipeItemId: string) => {
      removeRecipeItem.mutate({ productId, recipeItemId })
    },
    [removeRecipeItem],
  )

  const handleViewProfitHistory = useCallback((productId: string) => {
    setProfitHistoryProductId(productId)
  }, [])

  const handleCloseProfitHistory = useCallback(() => {
    setProfitHistoryProductId(null)
  }, [])

  const currentProduct = products.find((p) => p.id === profitHistoryProductId)

  return {
    products,
    isLoading,
    isCreateModalOpen,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleDeleteProduct,
    isDeletingProduct: deleteProduct.isPending,
    deletingProductId,
    handleConfirmDeleteProduct,
    handleCancelDeleteProduct,
    editingRecipeItem,
    handleEditRecipeItem,
    handleCloseEditRecipeItem,
    handleRemoveRecipeItem,
    isDeletingRecipeItem: removeRecipeItem.isPending,
    profitHistoryProductId,
    handleViewProfitHistory,
    handleCloseProfitHistory,
    currentProductName: currentProduct?.name,
  }
}
