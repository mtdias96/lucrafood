import { CreateProductModal } from './CreateProductModal'
import { ProductsView } from './ProductsView'
import { useProductsController } from './useProductsController'

export function ProductsPage() {
  const {
    products,
    isLoading,
    isCreateModalOpen,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleDeleteProduct,
    editingRecipeItem,
    handleEditRecipeItem,
    handleCloseEditRecipeItem,
    handleRemoveRecipeItem,
    isDeletingRecipeItem,
    profitHistoryProductId,
    handleViewProfitHistory,
    handleCloseProfitHistory,
    currentProductName,
  } = useProductsController()

  return (
    <>
      <ProductsView
        products={products}
        isLoading={isLoading}
        onOpenCreateModal={handleOpenCreateModal}
        onDeleteProduct={handleDeleteProduct}
        editingRecipeItem={editingRecipeItem}
        onEditRecipeItem={handleEditRecipeItem}
        onCloseEditRecipeItem={handleCloseEditRecipeItem}
        onRemoveRecipeItem={handleRemoveRecipeItem}
        isDeletingRecipeItem={isDeletingRecipeItem}
        profitHistoryProductId={profitHistoryProductId}
        onViewProfitHistory={handleViewProfitHistory}
        onCloseProfitHistory={handleCloseProfitHistory}
        currentProductName={currentProductName}
      />

      <CreateProductModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
    </>
  )
}
