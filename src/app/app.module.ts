import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';

import { AthleteModalPageModule } from './pages/private/athlete-modal/athlete-modal.module';
// import { ResultModalComponent } from './pages/private/assess-fpi/result-modal/result-modal.component';
// import { FpiCriteriaInformationComponent } from './pages/private/assess-fpi/fpi-criteria-information/fpi-criteria-information.component';

@NgModule({
  declarations: [
    AppComponent,
    // FpiCriteriaInformationComponent,
    // ResultModalComponent
  ],
  entryComponents: [
    // FpiCriteriaInformationComponent,
    // ResultModalComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    AthleteModalPageModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
