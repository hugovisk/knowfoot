import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AthleteModalPage } from './athlete-modal.page';

import { FilterPipe } from '../../../pipes/filter.pipe';

const routes: Routes = [
  {
    path: '',
    component: AthleteModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AthleteModalPage, FilterPipe]
})
export class AthleteModalPageModule {}
