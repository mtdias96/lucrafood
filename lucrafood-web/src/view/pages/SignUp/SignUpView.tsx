import { Link } from 'react-router-dom'
import { Button } from '@/view/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/view/components/ui/card'
import { Input } from '@/view/components/ui/input'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface SignUpViewProps {
  register: {
    name: UseFormRegisterReturn<'name'>
    email: UseFormRegisterReturn<'email'>
    password: UseFormRegisterReturn<'password'>
  }
  onSubmit: (e?: React.FormEvent) => void
  errors: {
    name?: { message?: string }
    email?: { message?: string }
    password?: { message?: string }
  }
  isPending: boolean
  apiError: string | null
}

export function SignUpView({ register, onSubmit, errors, isPending, apiError }: SignUpViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Criar conta</CardTitle>
          <CardDescription>Preencha os dados para se cadastrar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {apiError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {apiError}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Nome
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                {...register.name}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register.email}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Minimo 8 caracteres"
                {...register.password}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Criando conta...' : 'Criar conta'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Ja tem uma conta?{' '}
              <Link to="/signin" className="text-primary font-medium hover:underline">
                Entrar
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
