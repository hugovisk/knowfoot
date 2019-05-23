import { NgModule } from '@angular/core';
import { 
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule
 } from '@angular/material';

const materialComponents = [
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule
]

@NgModule({
  imports: [materialComponents],
  exports: [materialComponents]
})

export class MaterialDesignModule { }
