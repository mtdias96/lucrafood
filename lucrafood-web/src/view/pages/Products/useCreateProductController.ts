import { useCreateIngredient } from '@/app/hooks/useCreateIngredient'
import { useCreateProduct } from '@/app/hooks/useCreateProduct'
import { useCreateRecipe } from '@/app/hooks/useCreateRecipe'
import { useIngredients } from '@/app/hooks/useIngredients'
import { useRegisterPurchase } from '@/app/hooks/useRegisterPurchase'
import {
  productSchema, type ProductFormData,
  pricingSchema, type PricingFormData,
  ingredientSchema, type IngredientFormData,
} from '@/app/schemas'
import type { PackageUnit, RecipeIngredient } from '@/app/types/product'
import { areUnitsCompatible } from '@/app/config/constants'
import { getApiErrorMessage } from '@/app/utils/getApiErrorMessage'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export type { RecipeIngredient }

/* ── Controller ───────────────────────────────────────────────── */

export function useCreateProductController(onSuccess: () => void) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [recipeItems, setRecipeItems] = useState<RecipeIngredient[]>([])
  const [isCreatingIngredient, setIsCreatingIngredient] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const queryClient = useQueryClient()
  const { data: ingredientsData } = useIngredients({ limit: 50 })
  const ingredients = useMemo(
    () => ingredientsData?.ingredients ?? [],
    [ingredientsData?.ingredients],
  )

  const createProduct = useCreateProduct()
  const createRecipe = useCreateRecipe()
  const createIngredient = useCreateIngredient()
  const registerPurchase = useRegisterPurchase()

  /* -- Forms --------------------------------------------------- */

  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { yieldUnit: 'un' },
  })

  const pricingForm = useForm<PricingFormData>({
    resolver: zodResolver(pricingSchema),
  })

  const ingredientForm = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: { baseUnit: 'g', packageUnit: 'g' },
  })

  const [addItemForm, setAddItemForm] = useState({
    ingredientId: '',
    quantityUsed: '',
    unitUsed: 'g' as PackageUnit,
  })

  /* -- Step navigation ----------------------------------------- */

  const handleGoToStep2 = productForm.handleSubmit(() => {
    setApiError(null)
    setStep(2)
  })

  const handleGoToStep3 = useCallback(() => {
    if (recipeItems.length === 0) {
      setApiError('Adicione ao menos um ingrediente à receita.')
      return
    }
    setApiError(null)
    setStep(3)
  }, [recipeItems])

  const handlePrevStep = useCallback(() => {
    setApiError(null)
    setStep((prev) => (prev > 1 ? (prev - 1) as 1 | 2 | 3 : prev))
  }, [])

  /* -- Recipe items -------------------------------------------- */

  const handleAddRecipeItem = useCallback(() => {
    setApiError(null)
    if (!addItemForm.ingredientId || !addItemForm.quantityUsed) return

    const ingredient = ingredients.find((i) => i.id === addItemForm.ingredientId)
    if (!ingredient) {
      setApiError('Ingrediente não encontrado ou indisponível.')
      return
    }

    if (recipeItems.some((item) => item.ingredientId === addItemForm.ingredientId)) {
      setApiError('Este ingrediente já foi adicionado na receita.')
      return
    }

    if (!areUnitsCompatible(ingredient.baseUnit as PackageUnit, addItemForm.unitUsed)) {
      setApiError(
        `Unidade incompatível: "${addItemForm.unitUsed}" não é compatível com a unidade base "${ingredient.baseUnit}" do ingrediente. Use unidades do mesmo tipo (peso: g/kg, volume: ml/l, contagem: un).`,
      )
      return
    }

    setRecipeItems((prev) => [
      ...prev,
      {
        ingredientId: addItemForm.ingredientId,
        ingredientName: ingredient.name,
        quantityUsed: Number(addItemForm.quantityUsed),
        unitUsed: addItemForm.unitUsed,
      },
    ])

    setAddItemForm({ ingredientId: '', quantityUsed: '', unitUsed: 'g' })
  }, [addItemForm, ingredients, recipeItems])

  const handleRemoveRecipeItem = useCallback((ingredientId: string) => {
    setRecipeItems((prev) => prev.filter((item) => item.ingredientId !== ingredientId))
  }, [])

  /* -- Create ingredient inline -------------------------------- */

  const handleCreateIngredient = ingredientForm.handleSubmit(async (data) => {
    try {
      const { ingredient } = await createIngredient.mutateAsync({
        ingredients: { name: data.name, baseUnit: data.baseUnit },
      })

      await registerPurchase.mutateAsync({
        ingredientId: ingredient.id,
        ingredientPurchase: {
          storeId: null,
          packageQty: data.packageQty,
          packageUnit: data.packageUnit,
          totalPrice: data.totalPrice,
        },
      })

      await queryClient.refetchQueries({ queryKey: ['ingredients'] })

      ingredientForm.reset()
      setIsCreatingIngredient(false)
      toast.success('Ingrediente e preço registrados com sucesso!')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Erro ao criar ingrediente.'))
    }
  })

  /* -- Final submit -------------------------------------------- */

  const handleSubmit = pricingForm.handleSubmit(async (pricingData) => {
    const productData = productForm.getValues()
    setApiError(null)

    try {
      const result = await createProduct.mutateAsync({
        product: {
          name: productData.name,
          yieldQty: productData.yieldQty,
          yieldUnit: productData.yieldUnit,
          salePrice: pricingData.salePrice,
          targetMargin: pricingData.targetMargin,
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

      await queryClient.refetchQueries({ queryKey: ['products'] })

      toast.success('Produto criado com sucesso!')
      handleReset()
      onSuccess()
    } catch (err) {
      const message = getApiErrorMessage(err, 'Erro ao criar produto.')
      setApiError(message)
      toast.error(message)
    }
  })

  /* -- Reset --------------------------------------------------- */

  const handleReset = useCallback(() => {
    productForm.reset()
    pricingForm.reset()
    ingredientForm.reset()
    setRecipeItems([])
    setStep(1)
    setIsCreatingIngredient(false)
    setApiError(null)
    setAddItemForm({ ingredientId: '', quantityUsed: '', unitUsed: 'g' })
  }, [productForm, pricingForm, ingredientForm])

  /* -- Public API ---------------------------------------------- */

  return {
    step,
    productForm,
    pricingForm,
    ingredientForm,
    ingredients,
    recipeItems,
    addItemForm,
    setAddItemForm,
    isCreatingIngredient,
    setIsCreatingIngredient,
    apiError,
    isPending: createProduct.isPending || createRecipe.isPending,
    isCreatingIngredientPending: createIngredient.isPending || registerPurchase.isPending,
    handleGoToStep2,
    handleGoToStep3,
    handlePrevStep,
    handleAddRecipeItem,
    handleRemoveRecipeItem,
    handleCreateIngredient,
    handleSubmit,
    handleReset,
  }
}
