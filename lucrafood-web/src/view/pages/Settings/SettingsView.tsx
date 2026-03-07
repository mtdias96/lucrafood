import { Store, Loader2, CheckCircle2 } from 'lucide-react'
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Skeleton } from '@/view/components/ui'
import { useSettingsController } from './useSettingsController'

export function SettingsView() {
  const controller = useSettingsController()

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie os dados da sua conta e preferências da loja.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-5 h-5 text-primary" />
            <CardTitle>Minha Loja</CardTitle>
          </div>
          <CardDescription>
            Defina o nome da sua loja ou negócio para personalizar o aplicativo.
          </CardDescription>
        </CardHeader>

        <form onSubmit={controller.onSubmit}>
          <CardContent className="space-y-4">
            {controller.isFetchingUser ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ) : (
              <>
                {controller.apiError && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                    {controller.apiError}
                  </div>
                )}

            {controller.isSuccess && (
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 flex items-center gap-2 text-sm text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                Loja criada com sucesso!
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="store-name">Nome da Loja</Label>
              <Input
                id="store-name"
                placeholder="Ex: Doces da Maria"
                disabled={controller.hasStore || controller.isPending}
                {...controller.register('name')}
              />
              {controller.errors.name && (
                <p className="text-xs text-destructive">
                  {controller.errors.name.message}
                </p>
              )}
              {controller.hasStore && (
                <p className="text-xs text-muted-foreground mt-2">
                  Você já registrou sua loja como <strong>{controller.storeName}</strong>. 
                  Atualmente não é possível alterar o nome.
                </p>
              )}
            </div>
              </>
            )}
          </CardContent>

          {!controller.isFetchingUser && !controller.hasStore && (
            <CardFooter className="border-t border-border pt-6">
              <Button
                type="submit"
                disabled={controller.isPending}
              >
                {controller.isPending ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </div>
  )
}
