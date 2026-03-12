import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/view/components/ui'
import { Skeleton } from '@/view/components/ui'
import { useProductProfitHistory } from '@/app/hooks/useProductProfitHistory'
import { formatCurrency, formatDate } from '@/app/utils/formatters'
import { cn } from '@/app/utils/utils'

interface ProfitHistoryModalProps {
  open: boolean
  onClose: () => void
  productId: string | null
  productName?: string
}

function getMarginColor(margin: number): string {
  if (margin >= 30) return 'text-green-600'
  if (margin >= 15) return 'text-yellow-600'
  return 'text-red-600'
}

export function ProfitHistoryModal({
  open,
  onClose,
  productId,
  productName = 'Produto',
}: ProfitHistoryModalProps) {
  const { data, isLoading, error } = useProductProfitHistory(open ? productId : null)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] w-full max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Lucro — {productName}</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            Erro ao carregar histórico
          </div>
        )}

        {data?.history && data.history.length === 0 && (
          <div className="flex h-40 items-center justify-center text-center">
            <p className="text-muted-foreground">Nenhum histórico disponível</p>
          </div>
        )}

        {data?.history && data.history.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-xs font-semibold uppercase text-muted-foreground">
                  <th className="px-3 py-2">Data</th>
                  <th className="px-3 py-2 text-right">Custo Unitário</th>
                  <th className="px-3 py-2 text-right">Lucro Bruto</th>
                  <th className="px-3 py-2 text-right">Margem %</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.history.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-muted/50">
                    <td className="px-3 py-3">{formatDate(entry.date)}</td>
                    <td className="px-3 py-3 text-right">{formatCurrency(entry.unitCost)}</td>
                    <td className="px-3 py-3 text-right">
                      <span className={entry.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(entry.grossProfit)}
                      </span>
                    </td>
                    <td className={cn('px-3 py-3 text-right font-medium', getMarginColor(entry.profitMargin))}>
                      {entry.profitMargin.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
