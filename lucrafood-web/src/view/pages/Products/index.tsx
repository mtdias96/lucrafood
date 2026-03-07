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
  } = useProductsController()

  return (
    <>
      <ProductsView
        products={products}
        isLoading={isLoading}
        onOpenCreateModal={handleOpenCreateModal}
        onDeleteProduct={handleDeleteProduct}
      />

      <CreateProductModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
    </>
  )
}
