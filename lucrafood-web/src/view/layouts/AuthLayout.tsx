import { TrendingUp, ShieldCheck, ChartPie } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-gradient-to-br from-primary via-primary/90 to-primary/70 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-xl font-bold tracking-tight">LucraFood</span>
            </div>
          </div>

          <div className="space-y-8">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Controle seus custos.
              <br />
              <span className="text-white/80">Maximize seus lucros.</span>
            </h1>
            <p className="text-white/70 text-lg max-w-md leading-relaxed">
              Gerencie os custos do seu negócio alimentar com precisão.
              Acompanhe margens, preços e lucratividade em tempo real.
            </p>

            <div className="flex gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <ChartPie className="w-5 h-5 text-white/90" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Relatórios</p>
                  <p className="text-white/60 text-xs">PDF e Excel</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white/90" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Alertas</p>
                  <p className="text-white/60 text-xs">Margem e preço</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-white/40 text-sm">
            LucraFood - Controle financeiro alimentar
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="lg:hidden flex items-center gap-3 justify-center mb-4">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-foreground text-lg font-bold tracking-tight">LucraFood</span>
          </div>

          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {title}
            </h2>
            <p className="text-muted-foreground">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
