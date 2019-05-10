import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { MainPage } from './main/main.page';
// import { AuthGuard } from '../../services/user/auth/auth.guard';

const routes: Routes = [
  // {
  //   path: 'main',
  //   component: MainPage,
  //   canActivate: [AuthGuard],
  //   children: [
  //     {
  //       path: 'assess',
  //       children: [
  //         {
  //           path: '',
  //           loadChildren: './assess/assess.module#AssessPageModule'
  //         }
  //       ]
  //     },
  //     {
  //       path: 'athletes',
  //       children: [
  //         {
  //           path: '',
  //           loadChildren: './athletes/athletes.module#AthletesPageModule'
  //         }
  //       ]
  //     },
  //     {
  //       path: 'more',
  //       children: [
  //         {
  //           path: '',
  //           loadChildren: './more/more.module#MorePageModule'
  //         }
  //       ]
  //     },
  //     {
  //       path: 'profile',
  //       loadChildren: './profile/profile-signup-continuation/profile-signup-continuation.module#ProfileSignupContinuationPageModule'
  //     },
  //     {
  //       path: '',
  //       redirectTo: '/main/assess',
  //       pathMatch: 'full'
  //     }
  //   ]
  // },
  // {
  //   path: '',
  //   redirectTo: '/main/assess',
  //   pathMatch: 'full'
  // },
  { path: 'athlete-new', loadChildren: './athlete-new/athlete-new.module#AthleteNewPageModule' },
  {
    path: 'profile',
    loadChildren: './profile/profile-signup-continuation/profile-signup-continuation.module#ProfileSignupContinuationPageModule'
  },
  { path: 'athlete-detail/:id', loadChildren: './athlete-detail/athlete-detail.module#AthleteDetailPageModule' },
  { path: 'assess-fpi/:id/:foot', loadChildren: './assess-fpi/assess-fpi.module#AssessFpiPageModule' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
