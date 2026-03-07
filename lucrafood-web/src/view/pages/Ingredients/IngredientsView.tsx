import { Plus, ShoppingBasket, DollarSign } from 'lucide-react'
import { Button, Skeleton } from '@/view/components/ui'
import { useIngredientsController } from './useIngredientsController'
import { CreateIngredientModal } from './CreateIngredientModal'
import { AddPurchaseModal } from './AddPurchaseModal'

function IngredientCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  )
}

function EmptyState({ onCreateIngredient }: { onCreateIngredient: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <ShoppingBasket className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Nenhum ingrediente cadastrado
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
        Cadastre seus ingredientes e registre suas compras para começar a calcular custos.
      </p>
      <Button onClick={onCreateIngredient}>
        <Plus className="mr-2 w-4 h-4" />
        Cadastrar primeiro ingrediente
      </Button>
    </div>
  )
}

export function IngredientsView() {
  const controller = useIngredientsController()

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Ingredientes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie seu estoque virtual e os custos da sua matéria prima.
          </p>
        </div>
        <Button onClick={controller.handleOpenCreateModal}>
          <Plus className="mr-2 w-4 h-4" />
          Novo Ingrediente
        </Button>
      </div>

      {/* Loading State */}
      {controller.isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <IngredientCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!controller.isLoading && controller.ingredients.length === 0 && (
        <EmptyState onCreateIngredient={controller.handleOpenCreateModal} />
      )}

      {/* Grid */}
      {!controller.isLoading && controller.ingredients.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {controller.ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="rounded-xl border border-border bg-card p-5 group hover:border-primary/20 hover:shadow-md transition-all flex flex-col justify-between h-full"
              >
                <div className="mb-4">
                  <h3 className="font-semibold text-foreground text-base truncate">
                    {ingredient.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                    <ShoppingBasket className="w-3 h-3" />
                    Medido em {ingredient.baseUnit}
                  </div>
                </div>

                <div className="pt-4 border-t border-border mt-auto">
                  <Button
                    variant="secondary"
                    className="w-full justify-center"
                    size="sm"
                    onClick={() => controller.handleOpenPurchaseModal(ingredient.id)}
                  >
                    <DollarSign className="w-4 h-4 mr-1.5" />
                    Registrar Compra
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Setup pagination later if needed based on controller.meta */}
        </>
      )}

      {/* Modals */}
      <CreateIngredientModal
        open={controller.isCreateModalOpen}
        onClose={controller.handleCloseCreateModal}
      />
      {controller.purchaseIngredientId && (
        <AddPurchaseModal
          ingredientId={controller.purchaseIngredientId}
          open={!!controller.purchaseIngredientId}
          onClose={controller.handleClosePurchaseModal}
        />
      )}
    </div>
  )
}
