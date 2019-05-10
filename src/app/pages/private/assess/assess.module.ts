import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AssessPage } from './assess.page';
import { StartModalComponent } from './start-modal/start-modal.component';

import { AthleteNewModalComponent } from '../athlete-new-modal/athlete-new-modal.component';

import { FilterPipe } from '../../../pipes/filter.pipe';

const routes: Routes = [
  {
    path: '',
    component: AssessPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AssessPage,
    StartModalComponent,
    AthleteNewModalComponent,
    FilterPipe
  ],
  entryComponents: [
    StartModalComponent,
    AthleteNewModalComponent
  ],
})
export class AssessPageModule {}
