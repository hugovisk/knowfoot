import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SignupPage } from './signup.page';

import { MaterialDesignModule } from '../../../shared/modules/material-design/material-design.module';
import { MatStepperModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: SignupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MaterialDesignModule,
    MatStepperModule
  ],
  declarations: [SignupPage]
})
export class SignupPageModule {}
