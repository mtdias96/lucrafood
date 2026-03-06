import axios from 'axios'
import { env } from '@/app/config/env'
import { STORAGE_KEYS } from '@/app/config/constants'

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
})

httpClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      window.location.href = '/signin'
    }

    return Promise.reject(error)
  },
)
