import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';

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
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private fpiService: AssessFpiService,
    private router: Router
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
    if (this.result.foot[FootSide.Left] === undefined || this.result.foot[FootSide.Right] === undefined) {
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

/**
 *
 */
  async endAssess() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    try {
      await this.fpiService.createAssess(this.result);
      await loading.dismiss();
      this.router.navigateByUrl('main/assess');
      this.closeModal();
    } catch (error) {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        message: error,
        buttons: [{ text: 'Ok', role: 'cancel' }],
      });
      await alert.present();
    }
  }

  // testeEnviar() {
  //   console.log('teste enviar');
  //   this.fpiService.createAssess(this.result);
  //   this.closeModal();
  // }

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
