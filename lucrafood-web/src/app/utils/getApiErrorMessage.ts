import axios from 'axios'

const ERROR_MESSAGES: Record<string, Record<number, string>> = {
  CONFLICT: {
    409: 'Este e-mail ja esta em uso. Tente outro.',
  },
  UNAUTHORIZED: {
    401: 'E-mail ou senha incorretos.',
  },
  VALIDATION: {
    400: 'Dados invalidos. Verifique os campos e tente novamente.',
  },
  FORBIDDEN: {
    403: 'Voce nao tem permissao para realizar esta acao.',
  },
}

const GENERIC_MESSAGES: Record<number, string> = {
  400: 'Dados invalidos. Verifique os campos e tente novamente.',
  401: 'E-mail ou senha incorretos.',
  403: 'Voce nao tem permissao para realizar esta acao.',
  404: 'Recurso nao encontrado.',
  409: 'Este registro ja existe.',
  422: 'Nao foi possivel processar a solicitacao.',
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
