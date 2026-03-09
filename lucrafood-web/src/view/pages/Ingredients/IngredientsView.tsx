import { Plus, ListTodo, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, Skeleton } from '@/view/components/ui'
import { getUnitLabel } from '@/app/utils/formatters'
import type { Ingredient } from '@/app/types/ingredient'

interface IngredientsViewProps {
  ingredients: Ingredient[]
  isLoading: boolean
  onOpenCreateModal: () => void
}

function IngredientRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border/50">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-20 rounded-full" />
    </div>
  )
}

function EmptyState({ onCreateIngredient }: { onCreateIngredient: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-card rounded-xl border border-border mt-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <ListTodo className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Nenhum ingrediente cadastrado
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
        Adicione os ingredientes que você utiliza nas suas receitas para acompanhar o custo da produção.
      </p>
      <Button onClick={onCreateIngredient}>
        <Plus className="mr-2 w-4 h-4" />
        Cadastrar ingrediente
      </Button>
    </div>
  )
}

export function IngredientsView({
  ingredients,
  isLoading,
  onOpenCreateModal,
}: IngredientsViewProps) {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Ingredientes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os insumos utilizados nas suas receitas.
          </p>
        </div>
        <Button onClick={onOpenCreateModal}>
          <Plus className="mr-2 w-4 h-4" />
          Novo Ingrediente
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <IngredientRowSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && ingredients.length === 0 && (
        <EmptyState onCreateIngredient={onOpenCreateModal} />
      )}

      {/* Ingredients List */}
      {!isLoading && ingredients.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="font-medium p-4 border-b border-border/50">Nome</th>
                <th className="font-medium p-4 border-b border-border/50">Unidade Base</th>
                <th className="font-medium p-4 border-b border-border/50">Criado em</th>
                <th className="font-medium p-4 border-b border-border/50 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {ingredients.map((ingredient) => (
                <tr key={ingredient.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="p-4 font-medium text-foreground">
                    <Link
                      to={`/ingredients/${ingredient.id}`}
                      className="hover:text-primary hover:underline transition-colors"
                    >
                      {ingredient.name}
                    </Link>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    <span className="inline-flex items-center rounded-md bg-accent px-2 py-1 text-xs font-medium text-foreground ring-1 ring-inset ring-border">
                      {getUnitLabel(ingredient.baseUnit)}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(ingredient.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4 text-right">
                    <Link to={`/ingredients/${ingredient.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-primary">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
