import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pre-assess-modal',
  templateUrl: './pre-assess-modal.component.html',
  styleUrls: ['./pre-assess-modal.component.scss'],
})
export class PreAssessModalComponent implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {}

  async closeModal() {
    await this.modalController.dismiss();
  }

}
