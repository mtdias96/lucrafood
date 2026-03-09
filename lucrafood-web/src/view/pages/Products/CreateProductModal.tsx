import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogCloseButton,
} from '@/view/components/ui'
import { useCreateProductController } from './useCreateProductController'
import { StepIndicator } from './components/StepIndicator'
import { ProductStep } from './components/ProductStep'
import { RecipeStep } from './components/RecipeStep'
import { PricingStep } from './components/PricingStep'

interface CreateProductModalProps {
  open: boolean
  onClose: () => void
}

const STEP_META: Record<1 | 2 | 3, { title: string; description: string }> = {
  1: { title: 'Dados do Produto', description: 'Informe os dados básicos do seu produto.' },
  2: { title: 'Monte a Receita', description: 'Adicione os ingredientes e quantidades usadas.' },
  3: { title: 'Preço e Margem', description: 'Defina o preço de venda e a margem de lucro ideal.' },
}

export function CreateProductModal({ open, onClose }: CreateProductModalProps) {
  const controller = useCreateProductController(onClose)

  const handleClose = () => {
    controller.handleReset()
    onClose()
  }

  const { title, description } = STEP_META[controller.step]

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className="max-w-xl">
        <DialogCloseButton onClose={handleClose} />
        <DialogHeader>
          <StepIndicator currentStep={controller.step} />
          <DialogTitle className="mt-2">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {controller.apiError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {controller.apiError}
          </div>
        )}

        {controller.step === 1 && (
          <ProductStep
            form={controller.productForm}
            onSubmit={controller.handleGoToStep2}
            onCancel={handleClose}
          />
        )}

        {controller.step === 2 && (
          <RecipeStep
            ingredientForm={controller.ingredientForm}
            ingredients={controller.ingredients}
            recipeItems={controller.recipeItems}
            addItemForm={controller.addItemForm}
            setAddItemForm={controller.setAddItemForm}
            isCreatingIngredient={controller.isCreatingIngredient}
            setIsCreatingIngredient={controller.setIsCreatingIngredient}
            isCreatingIngredientPending={controller.isCreatingIngredientPending}
            onAddRecipeItem={controller.handleAddRecipeItem}
            onRemoveRecipeItem={controller.handleRemoveRecipeItem}
            onCreateIngredient={controller.handleCreateIngredient}
            onNext={controller.handleGoToStep3}
            onPrev={controller.handlePrevStep}
          />
        )}

        {controller.step === 3 && (
          <PricingStep
            pricingForm={controller.pricingForm}
            productForm={controller.productForm}
            recipeItems={controller.recipeItems}
            isPending={controller.isPending}
            onSubmit={controller.handleSubmit}
            onPrev={controller.handlePrevStep}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
