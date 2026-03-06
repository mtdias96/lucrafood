import type { AuthResponse, SignInParams, SignUpParams } from '@/app/types/auth'
import { httpClient } from './httpClient'

export const authService = {
  signUp: async (params: SignUpParams): Promise<AuthResponse> => {
    const { data } = await httpClient.post<AuthResponse>('/auth/signup', params)
    return data
  },

  signIn: async (params: SignInParams): Promise<AuthResponse> => {
    const { data } = await httpClient.post<AuthResponse>('/auth/signin', params)
    return data
  },
}
