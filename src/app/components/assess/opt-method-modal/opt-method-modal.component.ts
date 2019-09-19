import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-opt-method-modal',
  templateUrl: './opt-method-modal.component.html',
  styleUrls: ['./opt-method-modal.component.scss'],
})
export class OptMethodModalComponent implements OnInit {

  @Input() patient;

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

  test() {
    this.router.navigateByUrl(
      '/assess-fpi',
      { state: { assess: this.patient } }
    );
    this.closeModal();
  }

}
