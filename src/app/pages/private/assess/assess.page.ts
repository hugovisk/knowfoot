import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { AthleteModalPage } from '../athlete-modal/athlete-modal.page';

@Component({
  selector: 'app-assess',
  templateUrl: './assess.page.html',
  styleUrls: ['./assess.page.scss'],
})
export class AssessPage implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AthleteModalPage,
      componentProps: {
        methodType: 123
      }
    });
    return await modal.present();
  }

}
