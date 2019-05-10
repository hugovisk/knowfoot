import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { AssessFpi } from './../../../../models/interfaces/assess-fpi';
import { FootSide } from '../../../../models/enums/foot.enum';
import { fpiContents } from '../../../shared/fpi-contents';
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
  suggestNextAssessement: boolean;

  @Input() result: AssessFpi;
  @Input() currentFootAssessed: FootSide;

  constructor(
    public modalController: ModalController,
    private fpiService: AssessFpiService
    ) { }


  ngOnInit() {
    this.setNextFootAssess();
    this.setPostureResult();
    this.setSuggestNextAssessemet();
  }

  setNextFootAssess() {
    this.nextFootAssess = this.currentFootAssessed === FootSide.Left ? FootSide.Right : FootSide.Left;
  }

  setPostureResult() {
    console.log(this.result);
    console.log(this.result.foot);
    if (this.currentFootAssessed === FootSide.Left) {
      this.postureResult = this.definePostureResult(this.result[FootSide.Left].posture);
    } else {
      this.postureResult = this.definePostureResult(this.result[FootSide.Right].posture);
    }
  }

  setSuggestNextAssessemet() {
    // console.log(this.result[FootSide.Left]);
    // console.log(this.result[FootSide.Right].posture);
    if (this.result[FootSide.Left] === undefined || this.result[FootSide.Right] === undefined ) {
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

  testeEnviar(foot) {
    // console.log('teste enviar');
    // this.fpiService.verifyPictures(foot);
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
