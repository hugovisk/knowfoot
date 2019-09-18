import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ModalController } from '@ionic/angular';

import { FootSide } from '../../../models/enums/foot.enum';
import { AssessMethod } from '../../../models/enums/assess.enum';

@Component({
  selector: 'app-opt-method-modal',
  templateUrl: './opt-method-modal.component.html',
  styleUrls: ['./opt-method-modal.component.scss'],
})
export class OptMethodModalComponent implements OnInit {

  @Input() patient;

  // assess: {
  //   foot: { [sideKey: string]: boolean },
  //   method?: AssessMethod,
  //   patientName: string
  // };

  // method: any;

  // footSide: { [sideKey: string]: boolean };

  constructor(
    public modalController: ModalController,
    public router: Router
  ) { }

  ngOnInit() {
    this.onInitAssess();
  }

  onInitAssess() {
    // this.assess = {
    //   foot: {
    //     [FootSide.Right]: false,
    //     [FootSide.Left]: false
    //   },
    //   patientName: this.patient.name
    // };
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  // setMethod(selectedMethod) {
  //   this.assess.method = selectedMethod;
  // }

  // unSetMethod() {
  //   this.assess.method = undefined;
  // }

  // setFootSide(selectedFootSide) {
  //   switch (selectedFootSide) {
  //     case FootSide.Right: {
  //       this.assess.foot[FootSide.Right] = true;
  //       this.assess.foot[FootSide.Left] = false;
  //       break;
  //     }
  //     case FootSide.Left: {
  //       this.assess.foot[FootSide.Right] = false;
  //       this.assess.foot[FootSide.Left] = true;
  //       break;
  //     }
  //     default: {
  //       this.assess.foot[FootSide.Right] = true;
  //       this.assess.foot[FootSide.Left] = true;
  //     }
  //   }
  // }

  // unSetFootSide(selectedFootSide) {
  //   // if (selectedFootSide !== FootSide.Right || selectedFootSide !== FootSide.Left) {
  //   //   this.footSide[FootSide.Right] = false;
  //   //   this.footSide[FootSide.Left] = false;
  //   // } else {
  //   this.assess.foot[selectedFootSide] = false;
  //   // }
  // }


  test() {
    this.router.navigateByUrl(
      '/assess-fpi',
      { state: { assess: this.patient } }
    );
    this.closeModal();
  }

}
