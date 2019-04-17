import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { IonSlides } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';

import { FpiCriteriaInformationComponent } from './fpi-criteria-information/fpi-criteria-information.component';
import { fpi } from '../../shared/fpi-contents';
import { FootSide } from '../../../models/enums/foot.enum';
import { AssessFpi } from '../../../models/interfaces/assess-fpi';


@Component({
  selector: 'app-assess-fpi',
  templateUrl: './assess-fpi.page.html',
  styleUrls: ['./assess-fpi.page.scss'],
})
export class AssessFpiPage implements OnInit {

  footPicture: SafeResourceUrl;

  currentCriteria = 0;

  footAssessed: FootSide = FootSide.Left;

  /** Importa conteúdos dos selcts */
  // fpiCriteriaDescrition = fpi.criterias;
  fpiDefinitions = fpi;

  fpi: AssessFpi = {};

  @ViewChild('fpiStepSlides') fpiStepSlides: IonSlides;

  @ViewChild('fpiScoresSlides00') fpiScoreSlides00: IonSlides;
  @ViewChild('fpiScoresSlides01') fpiScoresSlides01: IonSlides;
  @ViewChild('fpiScoresSlides02') fpiScoresSlides02: IonSlides;
  @ViewChild('fpiScoresSlides03') fpiScoresSlides03: IonSlides;
  @ViewChild('fpiScoresSlides04') fpiScoresSlides04: IonSlides;

  progressbar = 'progressbar';

  fpiStepsSlideOptions = {
    noSwiping: true,
    pagination: {
      el: '.swiper-pagination',
      type: 'progressbar',
    }
  };

  fpiScoreslideOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
    centeredSlides: true
  };

  fpiScoreImages00: number[] = [-2, -1, 0, 1, 2];

  constructor(
    public popoverController: PopoverController,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.fpi.athleteId = 'idDoAtletaQueSeraAvaliado';
    this.fpi.footAssessed = FootSide.Left;
    this.fpi.assessment = {};
    this.fpi.assessment[this.fpiDefinitions.criterias[0].value] = { score: -2 };
    this.fpi.assessment[this.fpiDefinitions.criterias[1].value] = { score: -2 };
    this.fpi.assessment[this.fpiDefinitions.criterias[2].value] = { score: -2 };
    this.fpi.assessment[this.fpiDefinitions.criterias[3].value] = { score: -2 };
    this.fpi.assessment[this.fpiDefinitions.criterias[4].value] = { score: -2 };
}

  async presentInformation(ev: any) {
    const popover = await this.popoverController.create({
      component: FpiCriteriaInformationComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  async takePicture() {
    const { Camera } = Plugins;

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });
    this.footPicture = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.base64Data));
  }

  deletePicture() {
    this.footPicture = null;
  }

  async setScore(activeIndex: Promise<number>) {
    switch (await activeIndex) {
      case (0):
        this.fpi.assessment[this.fpiDefinitions.criterias[this.currentCriteria].value] = { score: -2 };
        break;
      case (1):
        this.fpi.assessment[this.fpiDefinitions.criterias[this.currentCriteria].value] = { score: -1 };
        break;
      case (2):
        this.fpi.assessment[this.fpiDefinitions.criterias[this.currentCriteria].value] = { score: 0 };
        break;
      case (3):
        this.fpi.assessment[this.fpiDefinitions.criterias[this.currentCriteria].value] = { score: 1 };
        break;
      case (4):
        this.fpi.assessment[this.fpiDefinitions.criterias[this.currentCriteria].value] = { score: 2 };
        break;
      default:
        console.log('ERRO :(');
    }
  }

  async setCriteria(activeIndex: Promise<number>) {
    this.currentCriteria = await activeIndex;
  }

  calculateFpiIndex() {
    this.fpi.indexResult = Object.values(this.fpi.assessment).reduce((a, b) =>
      a + b.score, 0);
  }

  footPostureResult() {
    this.calculateFpiIndex();
    switch (true) {
      case (this.fpi.indexResult <= -4):
        this.fpi.footPostureResult = this.fpiDefinitions.footPosture[0].value;
        break;
      case (this.fpi.indexResult <= -1):
        this.fpi.footPostureResult = this.fpiDefinitions.footPosture[1].value;
        break;
      case (this.fpi.indexResult <= 4):
        this.fpi.footPostureResult = this.fpiDefinitions.footPosture[2].value;
        break;
      case (this.fpi.indexResult <= 8):
        this.fpi.footPostureResult = this.fpiDefinitions.footPosture[3].value;
        break;
      case (this.fpi.indexResult >= 9):
        this.fpi.footPostureResult = this.fpiDefinitions.footPosture[4].value;
        break;
      default:
        console.log('ERRO :(');
    }
    console.log(this.fpi.indexResult);
    console.log(this.fpi.footPostureResult);
    // console.log(this.fpi.assessment);
  }

}
