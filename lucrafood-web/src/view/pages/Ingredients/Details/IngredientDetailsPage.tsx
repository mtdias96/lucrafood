import { ArrowLeft, Calendar, DollarSign, Store, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Button, Skeleton, Card, CardHeader, CardTitle, CardContent } from '@/view/components/ui'
import { useIngredient } from '@/app/hooks/useIngredient'
import { formatCurrency } from '@/app/utils/formatters'

function StatCard({ title, value, icon: Icon, colorClass = "text-primary", bgClass = "bg-primary/5" }: any) {
  return (
    <Card className="border-none shadow-sm bg-card/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${colorClass}`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{title}</p>
            <p className="text-lg font-bold text-foreground mt-0.5">{formatCurrency(value)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function IngredientDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, error } = useIngredient(id!)

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-muted rounded-xl" />)}
        </div>
        <div className="h-64 bg-muted rounded-xl" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-bold">Ingrediente não encontrado</h2>
        <Link to="/ingredients">
          <Button variant="link">Voltar para a lista</Button>
        </Link>
      </div>
    )
  }

  const { ingredient } = data

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <Link to="/ingredients" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors gap-1 group w-fit">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Voltar para Ingredientes
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{ingredient.name}</h1>
            <p className="text-sm text-muted-foreground mt-1 uppercase font-medium">
              Unidade Base: {ingredient.baseUnit}
            </p>
          </div>
          <Button variant="outline">Editar Nome</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Preço Atual" value={ingredient.stats.currentPrice} icon={DollarSign} colorClass="text-emerald-500" bgClass="bg-emerald-500/10" />
        <StatCard title="Preço Médio" value={ingredient.stats.avgPrice} icon={Minus} colorClass="text-blue-500" bgClass="bg-blue-500/10" />
        <StatCard title="Mínimo" value={ingredient.stats.minPrice} icon={TrendingDown} colorClass="text-emerald-600" bgClass="bg-emerald-600/5" />
        <StatCard title="Máximo" value={ingredient.stats.maxPrice} icon={TrendingUp} colorClass="text-destructive" bgClass="bg-destructive/5" />
      </div>

      {/* History Table */}
      <Card>
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
             <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Histórico de Compras
            </CardTitle>
            <Button size="sm">Registrar Compra</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/30 text-muted-foreground border-b border-border/50">
                <tr>
                  <th className="font-medium p-4">Data</th>
                  <th className="font-medium p-4">Loja / Fornecedor</th>
                  <th className="font-medium p-4">Qtd. Embalagem</th>
                  <th className="font-medium p-4 text-right">Preço Total</th>
                  <th className="font-medium p-4 text-right bg-accent/30 font-bold">Custo Unitário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {ingredient.history.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Store className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="font-medium">{item.storeName || 'Não informado'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {item.packageQty}{item.packageUnit}
                    </td>
                    <td className="p-4 text-right font-medium">
                      {formatCurrency(item.totalPrice)}
                    </td>
                    <td className="p-4 text-right font-bold text-primary bg-primary/5">
                      {formatCurrency(item.unitCost)} / {ingredient.baseUnit}
                    </td>
                  </tr>
                ))}
                {ingredient.history.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                      Nenhuma compra registrada para este ingrediente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
