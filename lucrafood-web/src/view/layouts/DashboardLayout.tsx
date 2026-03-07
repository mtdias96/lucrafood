import { NavLink, Outlet } from 'react-router-dom'
import {
  TrendingUp,
  Package,
  ShoppingBasket,
  Settings,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/app/hooks/useAuth'
import { cn } from '@/app/utils/utils'

interface NavItemProps {
  to: string
  icon: React.ReactNode
  label: string
}

function NavItem({ to, icon, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        )
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  )
}

export function DashboardLayout() {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-[280px] flex-col border-r border-border bg-card">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm shadow-primary/20">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-foreground text-lg font-bold tracking-tight">
              LucraFood
            </span>
            <p className="text-muted-foreground text-xs">Gestão de custos</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-3">
            Menu Principal
          </p>
          <NavItem
            to="/"
            icon={<Package className="w-4.5 h-4.5" />}
            label="Produtos"
          />
          <NavItem
            to="/ingredients"
            icon={<ShoppingBasket className="w-4.5 h-4.5" />}
            label="Ingredientes"
          />
          <NavItem
            to="/settings"
            icon={<Settings className="w-4.5 h-4.5" />}
            label="Configurações"
          />
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border">
          <button
            onClick={signOut}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 w-full cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-foreground text-base font-bold">LucraFood</span>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        {/* Mobile Navigation */}
        <div className="flex gap-1 px-4 pb-3 overflow-x-auto">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground bg-accent/50'
              )
            }
          >
            <Package className="w-3.5 h-3.5" />
            Produtos
          </NavLink>
          <NavLink
            to="/ingredients"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground bg-accent/50'
              )
            }
          >
            <ShoppingBasket className="w-3.5 h-3.5" />
            Ingredientes
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground bg-accent/50'
              )
            }
          >
            <Settings className="w-3.5 h-3.5" />
            Config.
          </NavLink>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="pt-[110px] lg:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
