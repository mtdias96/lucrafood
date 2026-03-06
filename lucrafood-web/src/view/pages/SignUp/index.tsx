import { SignUpView } from './SignUpView'
import { useSignUpController } from './useSignUpController'

export function SignUpPage() {
  const { register, onSubmit, errors, isPending, apiError } = useSignUpController()

  return (
    <SignUpView
      register={{
        name: register('name'),
        email: register('email'),
        password: register('password'),
      }}
      onSubmit={onSubmit}
      errors={errors}
      isPending={isPending}
      apiError={apiError}
    />
  )
}
