export const env = {
  apiBaseUrl: import.meta.env.VITE_API_URL as string ?? 'http://localhost:3333/api',
} as const
