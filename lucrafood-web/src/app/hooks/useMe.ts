import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/userService'
import { useAuth } from './useAuth'

export function useMe() {
  const { signedIn } = useAuth()

  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { account } = await userService.me()
      return account
    },
    enabled: signedIn,
    staleTime: Infinity,
  })
}
