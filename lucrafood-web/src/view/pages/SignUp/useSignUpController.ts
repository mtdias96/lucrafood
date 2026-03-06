import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { useSignUp } from '@/app/hooks/useSignUp'
import { getApiErrorMessage } from '@/app/utils/getApiErrorMessage'

const signUpSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.email('Informe um e-mail válido'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
})

type SignUpFormData = z.infer<typeof signUpSchema>

export function useSignUpController() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const { mutate, isPending, error } = useSignUp()

  const onSubmit = handleSubmit((data) => {
    mutate({
      account: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    })
  })

  const apiError = error
    ? getApiErrorMessage(error, 'Erro ao criar conta.')
    : null

  return {
    register,
    onSubmit,
    errors,
    isPending,
    apiError,
  }
}
