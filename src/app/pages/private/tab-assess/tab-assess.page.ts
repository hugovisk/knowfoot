import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';

import {
  MedicalRecordSearchModalComponent
} from '../../../components/medical-record/medical-record-search-modal/medical-record-search-modal.component';
import { MedicalRecordAddModalComponent
} from '../../../components/medical-record/medical-record-add-modal/medical-record-add-modal.component';
import { InfoAssessComponent } from '../../../components/information/info-assess/info-assess.component';
import { OptMethodModalComponent } from '../../../components/assess/opt-method-modal/opt-method-modal.component';

import { CameraComponent } from '../../../components/camera/camera.component';

@Component({
  selector: 'app-tab-assess',
  templateUrl: './tab-assess.page.html',
  styleUrls: ['./tab-assess.page.scss'],
})
export class TabAssessPage implements OnInit {
  // patient: {
  //   name: string,
  //   medicalRecordId: string
  // };

  constructor(
    public modalController: ModalController,
    public popoverController: PopoverController
  ) { }

  ngOnInit() {
    // this.displayMethodOpt({name: 'Hugo Melo'});
  }

  /**
   * Apresenta busca de pacientes, recee id e nome do paciente
   * selecionado
   */
  async displayMedicalRecordSearch() {
    const modal = await this.modalController.create({
      component: MedicalRecordSearchModalComponent
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    // console.log(data);
    if (data) { // pode ser que retorne undefined
      // this.assess = data.patient;
      this.displayMethodOpt(data.patient);
    }
    console.log(data.patient);
  }

  /**
   * Apresenta formulario de cadastro para novo paciente
   */
  async displayMedicalRecordAdd() {
    const modal = await this.modalController.create({
      component: MedicalRecordAddModalComponent
    });
    return await modal.present();
  }

  /**
   * Apresenta opcoes de metodos para avaliação
   */
  async displayMethodOpt(selectedPatient) {
    const modal = await this.modalController.create({
      component: OptMethodModalComponent,
      componentProps: {
        patient: selectedPatient
      }
    });
    return await modal.present();
  }

  async displayInfo(ev: any, infoTitle: string) {
    const popover = await this.popoverController.create({
      component: InfoAssessComponent,
      event: ev,
      componentProps: { infoText: infoTitle },
      translucent: true
    });
    return await popover.present();
  }

  // resetAssess() {
  //   this.assess = undefined;
  // }

}
