import { useState } from 'react'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Trash2,
  ChefHat,
  Scale,
  Pencil,
  LineChart,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  Badge,
} from '@/view/components/ui'
import type { ProductWithFinancials, RecipeItem } from '@/app/types/product'
import { formatCurrency } from '@/app/utils/formatters'

interface ProductCardProps {
  product: ProductWithFinancials
  onDelete: (productId: string) => void
  onEditRecipeItem: (productId: string, item: RecipeItem) => void
  onRemoveRecipeItem: (productId: string, recipeItemId: string) => void
  onViewProfitHistory: (productId: string) => void
  isDeletingRecipeItem?: boolean
}

function getMarginBadge(margin: number): { variant: 'success' | 'warning' | 'destructive'; label: string } {
  if (margin >= 30) return { variant: 'success', label: `${margin.toFixed(1)}% margem` }
  if (margin >= 15) return { variant: 'warning', label: `${margin.toFixed(1)}% margem` }
  return { variant: 'destructive', label: `${margin.toFixed(1)}% margem` }
}

export function ProductCard({
  product,
  onDelete,
  onEditRecipeItem,
  onRemoveRecipeItem,
  onViewProfitHistory,
  isDeletingRecipeItem = false,
}: ProductCardProps) {
  const { financials } = product
  const marginBadge = getMarginBadge(financials.profitMargin)
  const isProfit = financials.grossProfit > 0
  const [confirmDelete, setConfirmDelete] = useState<{
    recipeItemId: string
    ingredientName: string
  } | null>(null)

  return (
    <Card className="group hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-base truncate">
              {product.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Scale className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Rende {product.yieldQty} {product.yieldUnit}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={marginBadge.variant}>
              {marginBadge.label}
            </Badge>
            <button
              onClick={() => onDelete(product.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 cursor-pointer"
              title="Excluir produto"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Financial Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-accent/50 px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3 h-3 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                Custo/un
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {formatCurrency(financials.unitCost)}
            </p>
          </div>

          <div className="rounded-xl bg-accent/50 px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3 h-3 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                Venda/un
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {formatCurrency(product.salePrice)}
            </p>
          </div>

          <div className={`rounded-xl px-3 py-2.5 ${isProfit ? 'bg-emerald-500/5' : 'bg-destructive/5'}`}>
            <div className="flex items-center gap-1.5 mb-1">
              {isProfit ? (
                <TrendingUp className="w-3 h-3 text-emerald-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-destructive" />
              )}
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                Lucro
              </span>
            </div>
            <p className={`text-sm font-semibold ${isProfit ? 'text-emerald-600' : 'text-destructive'}`}>
              {formatCurrency(financials.grossProfit)}
            </p>
          </div>

          <div className="rounded-xl bg-primary/5 px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3 h-3 text-primary" />
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                Custo receita
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {formatCurrency(financials.totalCost)}
            </p>
          </div>
        </div>

        {/* Recipe Ingredients */}
        {product.items.length > 0 && (
          <div>
            <div className="flex items-center justify-between gap-1.5 mb-2">
              <div className="flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Receita ({product.items.length} {product.items.length === 1 ? 'ingrediente' : 'ingredientes'})
                </span>
              </div>
              <button
                onClick={() => onViewProfitHistory(product.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 cursor-pointer"
                title="Ver histórico de lucro"
              >
                <LineChart className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-2">
              {product.items.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="group/item inline-flex items-center rounded-lg bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  {item.ingredientName ?? 'Ingrediente'}
                  <span className="ml-1 text-muted-foreground">
                    {item.quantity}{item.unit}
                  </span>
                  <button
                    onClick={() => onEditRecipeItem(product.id, item)}
                    className="ml-2 opacity-0 group-hover/item:opacity-100 p-0.5 rounded text-muted-foreground hover:text-primary transition-colors"
                    title="Editar"
                    disabled={isDeletingRecipeItem}
                  >
                    <Pencil className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={() =>
                      setConfirmDelete({
                        recipeItemId: item.id,
                        ingredientName: item.ingredientName || 'Ingrediente',
                      })
                    }
                    className="ml-1 opacity-0 group-hover/item:opacity-100 p-0.5 rounded text-muted-foreground hover:text-destructive transition-colors"
                    title="Remover"
                    disabled={isDeletingRecipeItem}
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
              {product.items.length > 5 && (
                <span className="inline-flex items-center rounded-lg bg-secondary px-2 py-1 text-[11px] font-medium text-muted-foreground">
                  +{product.items.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-950">
              <h3 className="font-semibold text-foreground mb-2">Remover ingrediente?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tem certeza que deseja remover <strong>{confirmDelete.ingredientName}</strong> da receita?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-3 py-1 rounded text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                  disabled={isDeletingRecipeItem}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onRemoveRecipeItem(product.id, confirmDelete.recipeItemId)
                    setConfirmDelete(null)
                  }}
                  className="px-3 py-1 rounded text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                  disabled={isDeletingRecipeItem}
                >
                  {isDeletingRecipeItem ? 'Removendo...' : 'Remover'}
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
