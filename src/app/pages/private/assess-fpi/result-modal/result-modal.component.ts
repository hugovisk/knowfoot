import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { AssessFpi } from './../../../../models/interfaces/assess-fpi';
import { FootSide } from '../../../../models/enums/foot.enum';
import { fpiContents } from '../../../shared/fpi-contents';
import { formSelectsContent } from '../../../shared/form-selects-content';
import { AssessFpiService } from '../../../../services/assess/assess-fpi.service';

@Component({
  selector: 'app-result-modal',
  templateUrl: './result-modal.component.html',
  styleUrls: ['./result-modal.component.scss'],
})
export class ResultModalComponent implements OnInit {
  nextFootAssess: string;
  postureResult: string;
  postures = fpiContents.footPosture;
  footSides = formSelectsContent.footDominants;
  suggestNextAssessement: boolean;
  footPtBr: string;
  footNextPtBr: string;

  @Input() result: AssessFpi;
  @Input() currentFootAssessed: FootSide;

  constructor(
    public modalController: ModalController,
    private fpiService: AssessFpiService
    ) { }


  ngOnInit() {
    this.setPostureResult();
    this.suggestNextAssessemet();
    this.footPtBr = this.footSidePtBr(this.currentFootAssessed);
  }

  setNextFootAssess() {
    this.nextFootAssess = this.currentFootAssessed === FootSide.Left ? FootSide.Right : FootSide.Left;
    this.footNextPtBr = this.footSidePtBr(this.nextFootAssess);
  }

  setPostureResult() {
    // console.log(this.result);
    // console.log(this.result.foot);
    if (this.currentFootAssessed === FootSide.Left) {
      this.postureResult = this.postureResultPtBr(this.result.foot[FootSide.Left].posture);
    } else {
      this.postureResult = this.postureResultPtBr(this.result.foot[FootSide.Right].posture);
    }
  }

  suggestNextAssessemet() {
    // console.log(this.result[FootSide.Left]);
    // console.log(this.result[FootSide.Right].posture);
    if (this.result.foot[FootSide.Left] === undefined || this.result.foot[FootSide.Right] === undefined ) {
      this.suggestNextAssessement = true;
      this.setNextFootAssess();
    } else {
      this.suggestNextAssessement = false;
    }
  }

  postureResultPtBr(posture: string) {
    for (const postura of this.postures) {
      if (posture === postura.value) {
        return postura.viewValue;
      }
    }
  }

  footSidePtBr(footSide: string) {
    for (const lado of this.footSides) {
      if (footSide === lado.value) {
        return lado.viewValue;
      }
    }
  }

  testeEnviar() {
    console.log('teste enviar');
    this.fpiService.createAssess(this.result);
    this.closeModal();
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  async nextFootAssessment() {
    await this.modalController.dismiss({
      nextAssessement: true,
      nextAssessementFoot: this.nextFootAssess
    });
  }
}
