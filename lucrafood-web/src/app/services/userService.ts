import { httpClient } from './httpClient'

export interface User {
  id: string
  name: string
  email: string
  storeId: string | null
  store: { id: string; name: string } | null
}

export const userService = {
  async me(): Promise<{ account: User }> {
    const { data } = await httpClient.get('/me')
    return data
  },
}
