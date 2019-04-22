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

  /** objeto com os atributos do teste FPI */
  private fpi: AssessFpi;

  /** objeto com os atributos de apoio ao teste FPI */
  private current: {
    footPicture: { rear: SafeStyle, medial: SafeStyle},
    footView: FootView,
    observationSlide: number
  };

  /** importação das descrições do criterios de observação */
  private observationCriteria = fpiContents.criterias;

  /** importação das classificações des posturas do pé */
  private footPosture = fpiContents.footPosture;

  private fpiScoreImages00: number[] = [-2, -1, 0, 1, 2];

  constructor(
    public popoverController: PopoverController,
    public modalController: ModalController,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.fpi = {
      athleteId: 'idDoAtletaQueSeraAvaliado', // TODO: receber valor
      footAssessed: FootSide.Left, // TODO: receber valor
      assessment: {
        [this.observationCriteria[0].value]: { score: -2 },
        [this.observationCriteria[1].value]: { score: -2 },
        [this.observationCriteria[2].value]: { score: -2 },
        [this.observationCriteria[3].value]: { score: -2 },
        [this.observationCriteria[4].value]: { score: -2 }
      }
    };

    this.current = {
      footPicture: { rear: undefined, medial: undefined},
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
  async takePicture() {
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

    if (this.current.footView === FootView.Rear) {
      this.current.footPicture.rear = this.sanitizer.bypassSecurityTrustStyle(`url(${image.webPath})`);
    } else if (this.current.footView === FootView.Medial) {
      this.current.footPicture.medial = this.sanitizer.bypassSecurityTrustStyle(`url(${image.webPath})`);
    }
  }

  /**
   * Exclui foto
   */
  deletePicture() {
    if (this.current.footView === FootView.Rear) {
      this.current.footPicture.rear = null;
    } else if (this.current.footView === FootView.Medial) {
      this.current.footPicture.medial = null;
    }
  }

  /**
   * Define critério e valor observados
   * @param activeIndex
   */
  async setScore(activeIndex: Promise<number>) {
    switch (await activeIndex) {
      case (0):
        this.fpi.assessment[this.observationCriteria[this.current.observationSlide].value] = { score: -2 };
        break;
      case (1):
        this.fpi.assessment[this.observationCriteria[this.current.observationSlide].value] = { score: -1 };
        break;
      case (2):
        this.fpi.assessment[this.observationCriteria[this.current.observationSlide].value] = { score: 0 };
        break;
      case (3):
        this.fpi.assessment[this.observationCriteria[this.current.observationSlide].value] = { score: 1 };
        break;
      case (4):
        this.fpi.assessment[this.observationCriteria[this.current.observationSlide].value] = { score: 2 };
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
      if (this.current.observationSlide === 3 && this.current.footView !== FootView.Medial) {
        this.current.footView = FootView.Medial;
        console.log('LATERAL');
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
    this.fpi.indexResult = Object.values(this.fpi.assessment).reduce((total, value) =>
      total + value.score, 0);
  }

  /**
   * Classifica e define a postura do pé baseado no index do FPI
   */
  footPostureResult() {
    this.calculateFpiIndex();
    switch (true) {
      case (this.fpi.indexResult <= -4):
        this.fpi.footPostureResult = this.footPosture[0].value;
        break;
      case (this.fpi.indexResult <= -1):
        this.fpi.footPostureResult = this.footPosture[1].value;
        break;
      case (this.fpi.indexResult <= 4):
        this.fpi.footPostureResult = this.footPosture[2].value;
        break;
      case (this.fpi.indexResult <= 8):
        this.fpi.footPostureResult = this.footPosture[3].value;
        break;
      case (this.fpi.indexResult >= 9):
        this.fpi.footPostureResult = this.footPosture[4].value;
        break;
      default:
        console.error('ERRO :(');
    }
    console.log(this.fpi.indexResult);
    console.log(this.fpi.footPostureResult);
    console.log(this.fpi.assessment);
  }

  /**
   * https://ionicframework.com/docs/api/modal
   */
  async presentResult() {
    const modal = await this.modalController.create({
      component: ResultModalComponent,
      componentProps: { result: this.fpi }
    });
    return await modal.present();
  }

}
