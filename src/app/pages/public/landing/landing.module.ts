import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LandingPage } from './landing.page';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialDesignModule } from '../../../shared/modules/material-design/material-design.module';


const routes: Routes = [
  {
    path: '',
    component: LandingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MaterialDesignModule
  ],
  declarations: [LandingPage]
})
export class LandingPageModule {}
