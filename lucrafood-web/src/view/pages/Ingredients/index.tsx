import { CreateIngredientModal } from './CreateIngredientModal'
import { IngredientsView } from './IngredientsView'
import { useIngredientsController } from './useIngredientsController'

export function IngredientsPage() {
  const {
    ingredients,
    isLoading,
    isCreateModalOpen,
    handleOpenCreateModal,
    handleCloseCreateModal,
  } = useIngredientsController()

  return (
    <>
      <IngredientsView
        ingredients={ingredients}
        isLoading={isLoading}
        onOpenCreateModal={handleOpenCreateModal}
      />

      <CreateIngredientModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
    </>
  )
}
