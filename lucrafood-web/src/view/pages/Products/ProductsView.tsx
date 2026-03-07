import { Plus, Package } from 'lucide-react'
import { Button, Skeleton } from '@/view/components/ui'
import type { ProductWithFinancials } from '@/app/types/product'
import { ProductCard } from './ProductCard'

interface ProductsViewProps {
  products: ProductWithFinancials[]
  isLoading: boolean
  onOpenCreateModal: () => void
  onDeleteProduct: (productId: string) => void
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-28" />
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-20 rounded-lg" />
          <Skeleton className="h-6 w-24 rounded-lg" />
          <Skeleton className="h-6 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onCreateProduct }: { onCreateProduct: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Package className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Nenhum produto cadastrado
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
        Comece cadastrando seu primeiro produto com ingredientes e receita para acompanhar custos e lucros.
      </p>
      <Button onClick={onCreateProduct}>
        <Plus className="mr-2 w-4 h-4" />
        Cadastrar primeiro produto
      </Button>
    </div>
  )
}

export function ProductsView({
  products,
  isLoading,
  onOpenCreateModal,
  onDeleteProduct,
}: ProductsViewProps) {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Produtos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie seus produtos, receitas e margens de lucro.
          </p>
        </div>
        <Button onClick={onOpenCreateModal}>
          <Plus className="mr-2 w-4 h-4" />
          Novo Produto
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <EmptyState onCreateProduct={onOpenCreateModal} />
      )}

      {/* Products Grid */}
      {!isLoading && products.length > 0 && (
        <>
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-xl bg-card border border-border px-4 py-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Total de produtos
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {products.length}
              </p>
            </div>
            <div className="rounded-xl bg-card border border-border px-4 py-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Margem média
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {(
                  products.reduce((acc, p) => acc + p.financials.profitMargin, 0) /
                  products.length
                ).toFixed(1)}
                %
              </p>
            </div>
            <div className="rounded-xl bg-card border border-border px-4 py-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Lucrativos
              </p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {products.filter((p) => p.financials.grossProfit > 0).length}
              </p>
            </div>
            <div className="rounded-xl bg-card border border-border px-4 py-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Atenção
              </p>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {products.filter((p) => p.financials.profitMargin < 15).length}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={onDeleteProduct}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
