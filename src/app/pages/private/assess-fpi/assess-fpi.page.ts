import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';

import { InitialFootPhotosModalComponent
} from '../../../components/assess/fpi/initial-foot-photos-modal/initial-foot-photos-modal.component';


@Component({
  selector: 'app-assess-fpi',
  templateUrl: './assess-fpi.page.html',
  styleUrls: ['./assess-fpi.page.scss'],
})
export class AssessFpiPage implements OnInit {

  constructor(
    public modalController: ModalController,
    public popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.takeInitialFootPhotos()
  }

  /**
   * Apresenta formulario de cadastro para novo paciente
   */
  async takeInitialFootPhotos() {
    const modal = await this.modalController.create({
      component: InitialFootPhotosModalComponent
    });
    return await modal.present();
  }

}
