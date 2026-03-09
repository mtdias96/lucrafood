import axios from 'axios'

const ERROR_MESSAGES: Record<string, Record<number, string>> = {
  UNAUTHORIZED: {
    401: 'E-mail ou senha incorretos.',
  },
  VALIDATION: {
    400: 'Dados inválidos. Verifique os campos e tente novamente.',
  },
  FORBIDDEN: {
    403: 'Você não tem permissão para realizar esta ação.',
  },
}

const GENERIC_MESSAGES: Record<number, string> = {
  400: 'Dados inválidos. Verifique os campos e tente novamente.',
  401: 'E-mail ou senha incorretos.',
  403: 'Você não tem permissão para realizar esta ação.',
  404: 'Recurso não encontrado.',
  409: 'Este registro já existe.',
  422: 'Não foi possível processar a solicitação.',
  429: 'Muitas tentativas. Aguarde um momento e tente novamente.',
  500: 'Erro interno do servidor. Tente novamente mais tarde.',
}

const DEFAULT_MESSAGE = 'Ocorreu um erro inesperado. Tente novamente.'

export function getApiErrorMessage(error: unknown, fallback?: string): string {
  if (!axios.isAxiosError(error) || !error.response) {
    return fallback ?? DEFAULT_MESSAGE
  }

  const { status, data } = error.response
  const code = data?.code as string | undefined

  if (code && ERROR_MESSAGES[code]?.[status]) {
    return ERROR_MESSAGES[code][status]
  }

  return GENERIC_MESSAGES[status] ?? fallback ?? DEFAULT_MESSAGE
}
