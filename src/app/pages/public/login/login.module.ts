import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';

import { MaterialDesignModule } from '../../../shared/modules/material-design/material-design.module';

import { TranslateModule } from '@ngx-translate/core';


const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MaterialDesignModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
