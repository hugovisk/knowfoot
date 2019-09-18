import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../../modules/shared/shared.module';

import { AssessFpiPage } from './assess-fpi.page';
import { InitialFootPhotosModalComponent
} from '../../../components/assess/fpi/initial-foot-photos-modal/initial-foot-photos-modal.component';
import { OptFootSideModalComponent } from '../../../components/assess/opt-foot-side-modal/opt-foot-side-modal.component';

const routes: Routes = [
  {
    path: '',
    component: AssessFpiPage
  }
];

@NgModule({
  entryComponents: [
    InitialFootPhotosModalComponent,
    OptFootSideModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    AssessFpiPage,
    InitialFootPhotosModalComponent,
    OptFootSideModalComponent
  ]
})
export class AssessFpiPageModule {}
