import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatDatepickerModule,
  MatSelectModule,
  MatStepperModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatListModule,
  MatRippleModule,
  MatRadioModule
 } from '@angular/material';

import { MatMomentDateModule } from '@angular/material-moment-adapter';


const materialComponents = [
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatDatepickerModule,
  MatMomentDateModule,
  MatSelectModule,
  MatStepperModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatListModule,
  MatRippleModule,
  MatRadioModule
];

@NgModule({
  imports: [materialComponents],
  exports: [materialComponents]
})

export class MaterialDesignModule { }
