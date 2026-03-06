import { SignInView } from './SignInView'
import { useSignInController } from './useSignInController'

export function SignInPage() {
  const { register, onSubmit, errors, isPending, apiError } = useSignInController()

  return (
    <SignInView
      register={{
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
