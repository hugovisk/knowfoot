import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AssessFpiPage } from './assess-fpi.page';
import { FpiCriteriaInformationComponent } from './fpi-criteria-information/fpi-criteria-information.component';
import { ResultModalComponent } from './result-modal/result-modal.component';

const routes: Routes = [
  {
    path: '',
    component: AssessFpiPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    AssessFpiPage,
    FpiCriteriaInformationComponent,
    ResultModalComponent
  ],
  entryComponents: [
    FpiCriteriaInformationComponent,
    ResultModalComponent
  ],
})
export class AssessFpiPageModule {}
