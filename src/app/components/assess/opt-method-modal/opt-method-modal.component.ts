import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ModalController } from '@ionic/angular';
import { AssessMethod } from '../../../models/enums/assess.enum';

@Component({
  selector: 'app-opt-method-modal',
  templateUrl: './opt-method-modal.component.html',
  styleUrls: ['./opt-method-modal.component.scss'],
})
export class OptMethodModalComponent implements OnInit {

  @Input() patient;

  public assessMethod = AssessMethod;

  constructor(
    public modalController: ModalController,
    public router: Router
  ) { }

  ngOnInit() {
    this.onInitAssess();
  }

  onInitAssess() { }

  async closeModal() {
    await this.modalController.dismiss();
  }

  startAssess(method: AssessMethod) {
    // const url = method === AssessMethod.Fpi ? '/assess-fpi' : '/assess-drop';
    let url: string;

    switch (method) {
      case (AssessMethod.Fpi): url = '/assess-fpi'; break;
      case (AssessMethod.NavicularDrop): url = '/assess-drop'; break;
      default: console.error('Erro :(');
    }


    this.router.navigateByUrl(
      url,
      { state: { patient: this.patient } }
    );
    this.closeModal();
  }

}
