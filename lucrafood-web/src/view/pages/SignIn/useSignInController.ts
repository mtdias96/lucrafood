import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { useSignIn } from '@/app/hooks/useSignIn'
import { getApiErrorMessage } from '@/app/utils/getApiErrorMessage'

const signInSchema = z.object({
  email: z.email('Informe um e-mail valido'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
})

type SignInFormData = z.infer<typeof signInSchema>

export function useSignInController() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  const { mutateAsync, isPending, error } = useSignIn()

  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync({
      account: {
        email: data.email,
        password: data.password,
      },
    })
  })

  const apiError = error
    ? getApiErrorMessage(error, 'Erro ao fazer login.')
    : null

  return {
    register,
    onSubmit,
    errors,
    isPending,
    apiError,
  }
}
