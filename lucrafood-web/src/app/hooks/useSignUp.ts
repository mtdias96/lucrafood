import { useMutation } from '@tanstack/react-query'
import { authService } from '@/app/services/authService'
import type { SignUpParams } from '@/app/types/auth'
import { useAuth } from './useAuth'

export function useSignUp() {
  const { signIn } = useAuth()

  return useMutation({
    mutationFn: (params: SignUpParams) => authService.signUp(params),
    onSuccess: ({ accessToken }) => {
      signIn(accessToken)
    },
  })
}
