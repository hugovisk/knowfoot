import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// import { PrivateRoutingModule } from '../private-routing.module';
import { MainRouterModule } from './main-router.module';

import { IonicModule } from '@ionic/angular';

import { MainPage } from './main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // PrivateRoutingModule
    MainRouterModule
  ],
  declarations: [MainPage]
})
export class MainPageModule {}
