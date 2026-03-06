import { Button } from '@/view/components/ui/button'
import { useAuth } from '@/app/hooks/useAuth'

export function DashboardPage() {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <Button variant="outline" onClick={signOut}>
          Sair
        </Button>
      </div>
      <p className="text-muted-foreground">Bem-vindo ao LucraFood!</p>
    </div>
  )
}
