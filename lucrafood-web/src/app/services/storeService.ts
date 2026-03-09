import { httpClient } from './httpClient'

export interface Store {
  id: string
  name: string
}

export interface StoresResponse {
  stores: Store[]
}

export interface CreateStoreParams {
  store: {
    name: string
  }
}

async function getAll() {
  const { data } = await httpClient.get<StoresResponse>('/store')
  return data
}

async function create(params: CreateStoreParams) {
  const { data } = await httpClient.post('/store', params)
  return data
}

export const storeService = {
  getAll,
  create,
}
