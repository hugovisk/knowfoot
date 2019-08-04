import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MaterialDesignModule } from '../../../shared/modules/material-design/material-design.module';

import { TabAssessPage } from './tab-assess.page';

const routes: Routes = [
  {
    path: '',
    component: TabAssessPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MaterialDesignModule
  ],
  declarations: [TabAssessPage]
})
export class TabAssessPageModule {}
