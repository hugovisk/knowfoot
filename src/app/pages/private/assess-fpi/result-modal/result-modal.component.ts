import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { AssessFpi } from './../../../../models/interfaces/assess-fpi';
import { FootSide } from '../../../../models/enums/foot.enum';
import { fpiContents } from '../../../shared/fpi-contents';

@Component({
  selector: 'app-result-modal',
  templateUrl: './result-modal.component.html',
  styleUrls: ['./result-modal.component.scss'],
})
export class ResultModalComponent implements OnInit {
  nextFootAssess: string;
  postureResult: string;
  postures = fpiContents.footPosture;
  suggestNextAssessement: boolean;

  @Input() result: AssessFpi;
  @Input() currentFootAssessed: FootSide;

  constructor(public modalController: ModalController) { }


  ngOnInit() {
    this.setNextFootAssess();
    this.setPostureResult();
    this.setSuggestNextAssessemet();
  }

  setNextFootAssess() {
    this.nextFootAssess = this.currentFootAssessed === 'esquerdo' ? FootSide.Right : FootSide.Left;
  }

  setPostureResult() {
    if (this.currentFootAssessed === 'esquerdo') {
      this.postureResult = this.definePostureResult(this.result.footLeft.posture);
    } else {
      this.postureResult = this.definePostureResult(this.result.footRight.posture);
    }
  }

  setSuggestNextAssessemet() {
    if (this.result.footLeft === undefined || this.result.footRight === undefined ) {
      this.suggestNextAssessement = true;
    } else {
      this.suggestNextAssessement = false;
    }
  }

  definePostureResult(posture: string) {
    for (const postura of this.postures) {
      if (posture === postura.value) {
        return postura.viewValue;
      }
    }
  }


  closeModal() {
    this.modalController.dismiss();
  }
}
