import { httpClient } from './httpClient'

export const storeService = {
  async create(params: { name: string }): Promise<void> {
    const { data } = await httpClient.post('/store', params)
    return data
  },
}
