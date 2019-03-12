import { Component } from '@angular/core';

import { AuthService } from './services/user/auth/auth.service';

import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { SplashScreen, StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private authService: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      SplashScreen.hide().catch(error => {
        console.error(error);
      });
      StatusBar.hide().catch(error => {
        console.error(error);
      });

     // this.authService.authRouting();

    });
  }
}
