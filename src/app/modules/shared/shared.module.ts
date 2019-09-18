import { NgModule } from '@angular/core';

import { MaterialDesignModule } from '../material-design/material-design.module';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'ngx-avatar';

const sharedModules = [
  TranslateModule,
  MaterialDesignModule,
  AvatarModule
];

@NgModule({
  imports: [sharedModules],
  exports: [sharedModules]
})
export class SharedModule { }
