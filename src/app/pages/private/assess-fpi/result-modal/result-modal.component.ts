import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AssessFpi } from './../../../../models/interfaces/assess-fpi';

@Component({
  selector: 'app-result-modal',
  templateUrl: './result-modal.component.html',
  styleUrls: ['./result-modal.component.scss'],
})
export class ResultModalComponent {

  @Input() result: AssessFpi;

  constructor(public modalController: ModalController) { }

  closeModal() {
    this.modalController.dismiss();
  }
}
