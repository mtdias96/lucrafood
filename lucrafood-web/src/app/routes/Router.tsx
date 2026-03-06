import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthGuard } from './AuthGuard'
import { SignInPage } from '@/view/pages/SignIn'
import { SignUpPage } from '@/view/pages/SignUp'
import { DashboardPage } from '@/view/pages/Dashboard'

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard isPrivate={false} />}>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        <Route element={<AuthGuard isPrivate />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
