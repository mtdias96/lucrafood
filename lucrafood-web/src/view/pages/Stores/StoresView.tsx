import { Plus, Store as StoreIcon, Trash2, Loader2 } from 'lucide-react'
import {
  Button,
  Skeleton,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogCloseButton,
} from '@/view/components/ui'
import { useStoresController } from './useStoresController'

function StoreRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border/50">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-8 w-20 rounded-full" />
    </div>
  )
}

function EmptyState({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-card rounded-xl border border-border mt-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <StoreIcon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Nenhuma loja cadastrada
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
        Cadastre as lojas onde você costuma comprar seus ingredientes para organizar seu histórico de preços.
      </p>
      <Button onClick={onOpenModal}>
        <Plus className="mr-2 w-4 h-4" />
        Cadastrar primeira loja
      </Button>
    </div>
  )
}

export function StoresPage() {
  const {
    stores,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    form,
    handleSubmit,
    isSubmitting,
  } = useStoresController()

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Lojas e Fornecedores
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie onde você compra seus insumos.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 w-4 h-4" />
          Nova Loja
        </Button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <StoreRowSkeleton key={i} />
            ))}
          </div>
        ) : stores.length === 0 ? (
          <EmptyState onOpenModal={() => setIsModalOpen(true)} />
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="font-medium p-4 border-b border-border/50">Nome da Loja</th>
                  <th className="font-medium p-4 border-b border-border/50 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                          <StoreIcon className="w-4 h-4 text-primary" />
                        </div>
                        {store.name}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                       <button className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200">
                        <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nova Loja</DialogTitle>
            <DialogCloseButton onClose={() => setIsModalOpen(false)} />
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da loja ou fornecedor</Label>
              <Input
                id="name"
                placeholder="Ex: Supermercado Atacadão"
                className="h-11"
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSubmitting} className="h-11 px-8">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Cadastrar Loja'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
