import { Link } from 'react-router-dom'
import { Mail, Lock, User, Loader2 } from 'lucide-react'
import { Button } from '@/view/components/ui/button'
import { Input } from '@/view/components/ui/input'
import { AuthLayout } from '@/view/layouts/AuthLayout'
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
    <AuthLayout
      title="Crie sua conta"
      subtitle="Comece a controlar seus custos e maximizar lucros"
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {apiError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3.5 text-sm text-destructive">
            {apiError}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Nome completo
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              className="pl-10"
              {...register.name}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="pl-10"
              {...register.email}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              className="pl-10"
              {...register.password}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            'Criar conta'
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link to="/signin" className="text-primary font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
