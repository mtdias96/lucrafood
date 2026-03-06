import { useMutation } from '@tanstack/react-query'
import { authService } from '@/app/services/authService'
import type { SignInParams } from '@/app/types/auth'
import { useAuth } from './useAuth'

export function useSignIn() {
  const { signIn } = useAuth()

  return useMutation({
    mutationFn: (params: SignInParams) => authService.signIn(params),
    onSuccess: ({ accessToken }) => {
      signIn(accessToken)
    },
  })
}
