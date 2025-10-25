import { Routes } from '@angular/router';
import { LoginPage } from './pages/auth/login.page';
import { RegisterPage } from './pages/auth/register.page';
import { VerifyEmailPage } from './pages/auth/verify-email.page';
import { VerifyOtpPage } from './pages/auth/verify-otp.page';
import { RequestResetTokenPage } from './pages/auth/request-reset-token.page';
import { ResetPasswordPage } from './pages/auth/reset-password.page';
import { ProductsPage } from './pages/products/products.page';
import { ProductDetailPage } from './pages/products/product-detail.page';
import { LandingPage } from './pages/landing/landing.page';
import { CartPage } from './pages/cart/cart.page';
import { ProfileDashboardPage } from './pages/profile/profile-dashboard.page';
import { ProfileSettingsPage } from './pages/profile/profile-settings.page';
import { ProfileOrdersPage } from './pages/profile/profile-orders.page';
import { ProfileProductsPage } from './pages/profile/profile-products.page';
import { ProfileProductNewPage } from './pages/profile/profile-product-new.page';
import { AdminPage } from './pages/admin/admin.page';
import { UsersPage } from './pages/admin/users.page';
import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'products', component: ProductsPage },
  { path: 'product/:id', component: ProductDetailPage },
  { path: 'login', component: LoginPage, canActivate: [guestGuard] },
  { path: 'register', component: RegisterPage, canActivate: [guestGuard] },
  { path: 'forgot-password', component: RequestResetTokenPage, canActivate: [guestGuard] },
  { path: 'verify-email', component: VerifyEmailPage, canActivate: [guestGuard] },
  { path: 'verify-otp', component: VerifyOtpPage, canActivate: [guestGuard] },
  { path: 'reset-password', component: ResetPasswordPage, canActivate: [guestGuard] },
  { path: 'cart', component: CartPage },
  {
    path: 'profile',
    component: ProfileDashboardPage,
    canActivate: [authGuard],
    children: [
      { path: '', component: ProfileSettingsPage },
      { path: 'orders', component: ProfileOrdersPage },
      { path: 'settings', component: ProfileSettingsPage },
      { path: 'products', component: ProfileProductsPage },
      { path: 'products/new', component: ProfileProductNewPage },
      { path: 'admin', component: AdminPage },
      { path: 'users', component: UsersPage },
    ],
  },
  { path: '**', redirectTo: '' },
];
