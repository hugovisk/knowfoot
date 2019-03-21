import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';
import { AuthGuard } from '../../../services/user/auth/auth.guard';

const routes: Routes = [
  {
    path: 'main',
    component: MainPage,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'assess',
        children: [
          {
            path: '',
            loadChildren: '../assess/assess.module#AssessPageModule'
          }
        ]
      },
      {
        path: 'athletes',
        children: [
          {
            path: '',
            loadChildren: '../athletes/athletes.module#AthletesPageModule'
          }
        ]
      },
      {
        path: 'more',
        children: [
          {
            path: '',
            loadChildren: '../more/more.module#MorePageModule'
          }
        ]
      },
      
      {
        path: '',
        redirectTo: '/main/assess',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/main/assess',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRouterModule { }
