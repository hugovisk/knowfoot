import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: '', loadChildren: './pages/private/tabs/tabs.module#TabsPageModule' },
  { path: 'landing', loadChildren: './pages/public/landing/landing.module#LandingPageModule' },
  { path: 'login', loadChildren: './pages/public/login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './pages/public/signup/signup.module#SignupPageModule' },
  // { path: 'tabs', loadChildren: './pages/private/tabs/tabs.module#TabsPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
