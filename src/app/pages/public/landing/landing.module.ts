import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LandingPage } from './landing.page';

import { SharedModule } from '../../../modules/shared/shared.module';


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
    SharedModule
  ],
  declarations: [LandingPage]
})
export class LandingPageModule {}
