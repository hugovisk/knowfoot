import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfileSignupContinuationPage } from './profile-signup-continuation.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileSignupContinuationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfileSignupContinuationPage]
})
export class ProfileSignupContinuationPageModule {}
