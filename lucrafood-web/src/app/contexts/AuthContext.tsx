import { createContext, useCallback, useState } from 'react'
import { STORAGE_KEYS } from '@/app/config/constants'

interface AuthContextValue {
  signedIn: boolean
  signIn: (accessToken: string) => void
  signOut: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [signedIn, setSignedIn] = useState<boolean>(() => {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  })

  const signIn = useCallback((accessToken: string) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    setSignedIn(true)
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    setSignedIn(false)
  }, [])

  return (
    <AuthContext value={{ signedIn, signIn, signOut }}>
      {children}
    </AuthContext>
  )
}
