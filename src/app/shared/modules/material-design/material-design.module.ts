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
  MatSelectModule
];

@NgModule({
  imports: [materialComponents],
  exports: [materialComponents]
})

export class MaterialDesignModule { }
