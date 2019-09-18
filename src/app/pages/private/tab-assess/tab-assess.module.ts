import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../../modules/shared/shared.module';
import { MatStepperModule } from '@angular/material';

import { TabAssessPage } from './tab-assess.page';

import { MedicalRecordSearchModalComponent
} from '../../../components/medical-record/medical-record-search-modal/medical-record-search-modal.component';
import { MedicalRecordAddModalComponent
} from '../../../components/medical-record/medical-record-add-modal/medical-record-add-modal.component';
import { InfoAssessComponent } from '../../../components/information/info-assess/info-assess.component';
import { OptMethodModalComponent } from '../../../components/assess/opt-method-modal/opt-method-modal.component';

const routes: Routes = [
  {
    path: '',
    component: TabAssessPage
  }
];

@NgModule({
  entryComponents: [
    MedicalRecordSearchModalComponent,
    MedicalRecordAddModalComponent,
    InfoAssessComponent,
    OptMethodModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    MatStepperModule
  ],
  declarations: [
    TabAssessPage,
    MedicalRecordSearchModalComponent,
    MedicalRecordAddModalComponent,
    InfoAssessComponent,
    OptMethodModalComponent
  ]
})
export class TabAssessPageModule {}
