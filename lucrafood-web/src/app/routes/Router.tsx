import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthGuard } from './AuthGuard'
import { SignInPage } from '@/view/pages/SignIn'
import { SignUpPage } from '@/view/pages/SignUp'
import { DashboardLayout } from '@/view/layouts/DashboardLayout'
import { ProductsPage } from '@/view/pages/Products'
import { IngredientsPage } from '@/view/pages/Ingredients'
import { SettingsPage } from '@/view/pages/Settings'

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard isPrivate={false} />}>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        <Route element={<AuthGuard isPrivate />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/ingredients" element={<IngredientsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
