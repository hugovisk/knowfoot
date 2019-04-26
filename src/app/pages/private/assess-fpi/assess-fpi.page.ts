import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { IonSlides, ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource, CameraOptions } from '@capacitor/core';

import { FpiCriteriaInformationComponent } from './fpi-criteria-information/fpi-criteria-information.component';
import { ResultModalComponent } from './result-modal/result-modal.component';
import { fpiContents } from '../../shared/fpi-contents';
import { FootSide, FootView } from '../../../models/enums/foot.enum';
import { AssessFpi } from '../../../models/interfaces/assess-fpi';
import { CurrentAssessFpi } from '../../../models/interfaces/current-assess-fpi';

@Component({
  selector: 'app-assess-fpi',
  templateUrl: './assess-fpi.page.html',
  styleUrls: ['./assess-fpi.page.scss'],
})

export class AssessFpiPage implements OnInit {
  /** queries no DOM para capturar elementos pelo id */
  @ViewChild('fpiSlides') fpiSlides: IonSlides;
  @ViewChild('fpiScoresSlides00') fpiScoreSlides00: IonSlides;
  @ViewChild('fpiScoresSlides01') fpiScoresSlides01: IonSlides;
  @ViewChild('fpiScoresSlides02') fpiScoresSlides02: IonSlides;
  @ViewChild('fpiScoresSlides03') fpiScoresSlides03: IonSlides;
  @ViewChild('fpiScoresSlides04') fpiScoresSlides04: IonSlides;

  /** opções do slide dos critérios de observação
   * http://idangero.us/swiper/api/
   */
  fpiSlideOptions = {
    noSwiping: true,
    pagination: {
      el: '.swiper-pagination',
      type: 'progressbar',
    }
  };

  /** opções dos slides de pontuação da observação
   *  http://idangero.us/swiper/api/
   */
  fpiScoreslideOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
    centeredSlides: true
  };

  /** objeto com os atributos do teste FPI
  private fpi: AssessFpi;*/

  /** objeto com os atributos de apoio ao teste FPI */
  private fpi: AssessFpi;

  /** objeto com os atributos de apoio ao teste FPI */
  private current: CurrentAssessFpi;

  // private current: {
  //   assessment: { [observation: string]: {score: number} };
  //   footAssessed: FootSide,
  //   footPicture?: { rear: SafeStyle, medial: SafeStyle },
  //   footPosture?: string
  //   footView: FootView,
  //   index?: number;
  //   observationSlide: number
  // };

  /** importação das descrições do criterios de observação */
  private observationCriteria = fpiContents.criterias;

  /** importação das classificações des posturas do pé */
  private footPosture = fpiContents.footPosture;

  /** TODO: colocar figuras de comparacao do FPI */
  private fpiScoreImages00: number[] = [-2, -1, 0, 1, 2];

  constructor(
    public popoverController: PopoverController,
    public modalController: ModalController,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.currentInit();
    this.current.footAssessed = FootSide.Right;

    this.fpi = {
      athleteId: 'idDoAtletaQueSeraAvaliado', // TODO: receber valor
    };

    }

  currentInit() {
    this.current = {
      fpi: {
        assessment: {
        [this.observationCriteria[0].value]: { score: -2 },
        [this.observationCriteria[1].value]: { score: -2 },
        [this.observationCriteria[2].value]: { score: -2 },
        [this.observationCriteria[3].value]: { score: -2 },
        [this.observationCriteria[4].value]: { score: -2 }
        },
        footPicture: { rear: undefined, medial: undefined, insideRearAngle: undefined },

      },
      footView: FootView.Rear,
      observationSlide: 0
    };
  }
  /**
   * Apresentação de instruções dos critérios de observação
   * @param ev
   *
   * https://ionicframework.com/docs/api/popover
   */
  async presentInformation(ev: any) {
    const popover = await this.popoverController.create({
      component: FpiCriteriaInformationComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  /**
   * Tira foto
   * https://capacitor.ionicframework.com/docs/apis/camera/
   */
  async takePicture(footview: string) {
    const { Camera } = Plugins;
    const options: CameraOptions = {
      allowEditing: false,
      height: 640,
      quality: 75,
      resultType: CameraResultType.Uri,
      saveToGallery: false,
      source: CameraSource.Camera,
      width: 480
    };
    const image = await Camera.getPhoto(options);

    this.current.fpi.footPicture[footview] = this.sanitizer.bypassSecurityTrustStyle(`url(${image.webPath})`);
}

  /**
   * Exclui foto
   */
  deletePicture(footview: string) {
    this.current.fpi.footPicture[footview] = null;
  }

  /**
   * Define critério e valor observados
   * @param activeIndex
   */
  async setScore(activeIndex: Promise<number>) {
    switch (await activeIndex) {
      case (0):
        this.current.fpi.assessment[this.observationCriteria[this.current.observationSlide].value] = { score: -2 };
        break;
      case (1):
        this.current.fpi.assessment[this.observationCriteria[this.current.observationSlide].value] = { score: -1 };
        break;
      case (2):
        this.current.fpi.assessment[this.observationCriteria[this.current.observationSlide].value] = { score: 0 };
        break;
      case (3):
        this.current.fpi.assessment[this.observationCriteria[this.current.observationSlide].value] = { score: 1 };
        break;
      case (4):
        this.current.fpi.assessment[this.observationCriteria[this.current.observationSlide].value] = { score: 2 };
        break;
      default:
        console.error('ERRO :(');
    }
  }

  /**
   * Captura a posição do slide ativo
   * @param activeIndex
   *
   * https://ionicframework.com/docs/api/slides
   */
  async setCurrentObservationSlide(activeIndex: Promise<number>) {
    this.current.observationSlide = await activeIndex;
  }

  /**
   * Altera a indicação da vista de obserção do pé avaliado.
   * Para os critérios de observação Curvatura supra e infra maleolar lateral, Posição do
   * calcâneo, Abdução e adução do antepé sobre o retropé, define a vista postorior do pé.
   * Para Altura do arco longitudinal medial e Proeminência na região da ATN, define a
   * vista medial do pé.
   */
  changeFootViewPicture() {
    setTimeout(() => { // delay para capturar o slide ativo após o avançar ou voltar
      if (this.current.observationSlide === 4 && this.current.footView !== FootView.InsideRearAngle) {
        this.current.footView = FootView.InsideRearAngle;
        console.log('POSTERIOR INTERNO OBLÍQUO');
      } else if (this.current.observationSlide === 3 && this.current.footView !== FootView.Medial) {
        this.current.footView = FootView.Medial;
        console.log('MEDIAL');
      } else if (this.current.observationSlide === 2 && this.current.footView !== FootView.Rear) {
        this.current.footView = FootView.Rear;
        console.log('POSTERIOR');
      }
    }, 50);
  }

  /**
   * Soma todos os valores definidos nas observações do teste FPI,
   * o resultado define o index
   */
  calculateFpiIndex() {
    this.current.fpi.index = Object.values(this.current.fpi.assessment).reduce((total, value) =>
      total + value.score, 0);
  }

  /**
   * Classifica e define a postura do pé baseado no index do FPI
   */
  footPostureResult() {
    this.calculateFpiIndex();
    switch (true) {
      case (this.current.fpi.index <= -4):
        this.current.fpi.posture = this.footPosture[0].value;
        break;
      case (this.current.fpi.index <= -1):
        this.current.fpi.posture = this.footPosture[1].value;
        break;
      case (this.current.fpi.index <= 4):
        this.current.fpi.posture = this.footPosture[2].value;
        break;
      case (this.current.fpi.index <= 8):
        this.current.fpi.posture = this.footPosture[3].value;
        break;
      case (this.current.fpi.index >= 9):
        this.current.fpi.posture = this.footPosture[4].value;
        break;
      default:
        console.error('ERRO :(');
    }
    console.log(this.current.fpi.index);
    console.log(this.current.fpi.posture);
    console.log(this.current.fpi.assessment);
    this.setFpi();
  }

  /**
   * https://ionicframework.com/docs/api/modal 
   */
  async presentResult() {
    const modal = await this.modalController.create({
      component: ResultModalComponent,
      componentProps: {
        result: this.fpi,
        currentFootAssessed: this.current.footAssessed,
      }
    });
    return await modal.present();
  }

  setFpi() {
    if (this.current.footAssessed === 'esquerdo') {
      this.fpi.footLeft = this.current.fpi;
    } else {
      this.fpi.footRight = this.current.fpi;
    }
  }
}
