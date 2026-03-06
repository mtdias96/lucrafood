export interface SignUpParams {
  account: {
    name: string
    email: string
    password: string
  }
}

export interface SignInParams {
  account: {
    email: string
    password: string
  }
}

export interface AuthResponse {
  accessToken: string
}
