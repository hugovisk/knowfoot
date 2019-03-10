import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/user/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'private/dashboard', pathMatch: 'full' },
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
