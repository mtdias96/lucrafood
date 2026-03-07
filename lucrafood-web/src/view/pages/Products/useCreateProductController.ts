import { useCreateIngredient } from '@/app/hooks/useCreateIngredient'
import { useCreateProduct } from '@/app/hooks/useCreateProduct'
import { useCreateRecipe } from '@/app/hooks/useCreateRecipe'
import { useIngredients } from '@/app/hooks/useIngredients'
import type { PackageUnit } from '@/app/types/product'
import { getApiErrorMessage } from '@/app/utils/getApiErrorMessage'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'

const productSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  yieldQty: z.number().min(1, 'Rendimento deve ser maior que 0'),
  yieldUnit: z.enum(['g', 'kg', 'ml', 'l', 'un'] as const),
  salePrice: z.number().min(0.01, 'Preço de venda deve ser maior que 0'),
})

type ProductFormData = z.infer<typeof productSchema>

export interface RecipeIngredient {
  ingredientId: string
  ingredientName: string
  quantityUsed: number
  unitUsed: PackageUnit
}

const ingredientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  baseUnit: z.enum(['g', 'kg', 'ml', 'l', 'un'] as const),
})

type IngredientFormData = z.infer<typeof ingredientSchema>

export function useCreateProductController(onSuccess: () => void) {
  const [step, setStep] = useState<1 | 2>(1)
  const [recipeItems, setRecipeItems] = useState<RecipeIngredient[]>([])
  const [isCreatingIngredient, setIsCreatingIngredient] = useState(false)

  const { data: ingredientsData } = useIngredients()
  const ingredients = ingredientsData?.ingredients ?? []

  const createProduct = useCreateProduct()
  const createRecipe = useCreateRecipe()
  const createIngredient = useCreateIngredient()

  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      yieldUnit: 'un',
    },
  })

  const ingredientForm = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      baseUnit: 'g',
    },
  })

  const [addItemForm, setAddItemForm] = useState({
    ingredientId: '',
    quantityUsed: '',
    unitUsed: 'g' as PackageUnit,
  })

  const apiError = createProduct.error
    ? getApiErrorMessage(createProduct.error, 'Erro ao criar produto.')
    : createRecipe.error
      ? getApiErrorMessage(createRecipe.error, 'Erro ao criar receita.')
      : null

  const handleNextStep = productForm.handleSubmit(() => {
    setStep(2)
  })

  const handlePrevStep = useCallback(() => {
    setStep(1)
  }, [])

  const handleAddRecipeItem = useCallback(() => {
    if (!addItemForm.ingredientId || !addItemForm.quantityUsed) return

    const ingredient = ingredients.find((i) => i.id === addItemForm.ingredientId)
    if (!ingredient) return

    const alreadyAdded = recipeItems.some(
      (item) => item.ingredientId === addItemForm.ingredientId,
    )
    if (alreadyAdded) return

    setRecipeItems((prev) => [
      ...prev,
      {
        ingredientId: addItemForm.ingredientId,
        ingredientName: ingredient.name,
        quantityUsed: Number(addItemForm.quantityUsed),
        unitUsed: addItemForm.unitUsed,
      },
    ])

    setAddItemForm({
      ingredientId: '',
      quantityUsed: '',
      unitUsed: 'g',
    })
  }, [addItemForm, ingredients, recipeItems])

  const handleRemoveRecipeItem = useCallback((ingredientId: string) => {
    setRecipeItems((prev) => prev.filter((item) => item.ingredientId !== ingredientId))
  }, [])

  const handleCreateIngredient = ingredientForm.handleSubmit(async (data) => {
    try {
      await createIngredient.mutateAsync({
        ingredients: {
          name: data.name,
          baseUnit: data.baseUnit,
        },
      })
      ingredientForm.reset()
      setIsCreatingIngredient(false)
    } catch {
      // Error handled by apiError
    }
  })

  const handleSubmit = productForm.handleSubmit(async (data) => {
    try {
      const result = await createProduct.mutateAsync({
        product: {
          name: data.name,
          yieldQty: data.yieldQty,
          yieldUnit: data.yieldUnit,
          salePrice: data.salePrice,
        },
      })

      if (recipeItems.length > 0) {
        await createRecipe.mutateAsync({
          productId: result.product.id,
          productRecipe: recipeItems.map((item) => ({
            ingredientId: item.ingredientId,
            quantityUsed: item.quantityUsed,
            unitUsed: item.unitUsed,
          })),
        })
      }

      // Reset everything
      productForm.reset()
      setRecipeItems([])
      setStep(1)
      onSuccess()
    } catch {
      // Error handled by apiError
    }
  })

  const handleReset = useCallback(() => {
    productForm.reset()
    ingredientForm.reset()
    setRecipeItems([])
    setStep(1)
    setIsCreatingIngredient(false)
    setAddItemForm({ ingredientId: '', quantityUsed: '', unitUsed: 'g' })
  }, [productForm, ingredientForm])

  return {
    step,
    productForm,
    ingredientForm,
    ingredients,
    recipeItems,
    addItemForm,
    setAddItemForm,
    isCreatingIngredient,
    setIsCreatingIngredient,
    apiError,
    isPending: createProduct.isPending || createRecipe.isPending,
    isCreatingIngredientPending: createIngredient.isPending,
    handleNextStep,
    handlePrevStep,
    handleAddRecipeItem,
    handleRemoveRecipeItem,
    handleCreateIngredient,
    handleSubmit,
    handleReset,
  }
}
