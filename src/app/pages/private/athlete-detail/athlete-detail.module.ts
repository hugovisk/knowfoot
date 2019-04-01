import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AthleteDetailPage } from './athlete-detail.page';

const routes: Routes = [
  {
    path: '',
    component: AthleteDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AthleteDetailPage]
})
export class AthleteDetailPageModule {}
