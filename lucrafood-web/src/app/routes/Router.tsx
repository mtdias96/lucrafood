import { AppLayout } from '@/view/layouts/AppLayout'
import { DashboardPage } from '@/view/pages/Dashboard'
import { IngredientsPage } from '@/view/pages/Ingredients'
import { IngredientDetailsPage } from '@/view/pages/Ingredients/Details'
import { ProductsPage } from '@/view/pages/Products'
import { SignInPage } from '@/view/pages/SignIn'
import { SignUpPage } from '@/view/pages/SignUp'
import { StoresPage } from '@/view/pages/Stores'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthGuard } from './AuthGuard'

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard isPrivate={false} />}>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        <Route element={<AuthGuard isPrivate />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/ingredients" element={<IngredientsPage />} />
            <Route path="/ingredients/:id" element={<IngredientDetailsPage />} />
            <Route path="/stores" element={<StoresPage />} />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  )
}
