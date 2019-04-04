import { NgModule } from '@angular/core';
import { PreloadAllModules, Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/user/auth/auth.guard';

const routes: Routes = [
  //{ path: '', redirectTo: 'private/main', pathMatch: 'full' },
  { path: '', loadChildren: './pages/private/main/main.module#MainPageModule' },
  { path: 'landing', loadChildren: './pages/public/landing/landing.module#LandingPageModule' },
  { path: 'login', loadChildren: './pages/public/login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './pages/public/signup/signup.module#SignupPageModule' },
  { path: 'reset-password', loadChildren: './pages/public/reset-password/reset-password.module#ResetPasswordPageModule' },
  { path: 'privacy-policy', loadChildren: './pages/public/privacy-policy/privacy-policy.module#PrivacyPolicyPageModule' },
  {
    path: 'terms-and-conditions',
    loadChildren: './pages/public/terms-and-conditions/terms-and-conditions.module#TermsAndConditionsPageModule'
  },
  {
    path: 'private',
    canActivate: [AuthGuard],
    loadChildren: './pages/private/private-routing.module#PrivateRoutingModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
