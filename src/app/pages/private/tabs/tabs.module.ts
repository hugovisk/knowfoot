import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';

import { MaterialDesignModule } from '../../../shared/modules/material-design/material-design.module';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      { path: 'assess', loadChildren: '../tab-assess/tab-assess.module#TabAssessPageModule' }
    ]
  },
  { path: '', redirectTo: '/tabs/assess', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MaterialDesignModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule { }
