import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { IonSlides, ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource, CameraOptions, CameraPhoto } from '@capacitor/core';

import { AssessFpiService } from '../../../services/assess/assess-fpi.service';

import { FpiCriteriaInformationComponent } from './fpi-criteria-information/fpi-criteria-information.component';
import { ResultModalComponent } from './result-modal/result-modal.component';

import { CurrentAssessFpi } from '../../../models/interfaces/current-assess-fpi';
import { AssessFpi } from '../../../models/interfaces/assess-fpi';
import { FootSide, FootView, FootPosture } from '../../../models/enums/foot.enum';
import { AssessMethod } from '../../../models/enums/assess.enum';
import { fpiContents } from '../../shared/fpi-contents';



@Component({
  selector: 'app-assess-fpi',
  templateUrl: './assess-fpi.page.html',
  styleUrls: ['./assess-fpi.page.scss'],
})

export class AssessFpiPage implements OnInit {

  /** queries no DOM para capturar elementos pelo id */
  // cada criterio tem um slide
  @ViewChild('fpiSlides') fpiSlides: IonSlides;
  // cada critério tem tem um slide com as pontuações
  @ViewChild('fpiScoresSlides00') fpiScoresSlides00: IonSlides;
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
  fpiScoreSlideOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
    centeredSlides: true,
    slideToClickedSlide: true
  };

  /** Objeto com os atributos de avaliação do método FPI */
  private assessFpi: AssessFpi;

  /** Obejto que armazena atributos temporários da avaliação corrente */
  private current: CurrentAssessFpi;

  /**
   * Váriavel auxiliar que armazena aninhamento dos atributos
   * do pé que esta sendo avaliado no momento
   */
  private currentFpi;

  /** Importação das descrições do criterios de observação */
  private observationCriteria = fpiContents.criterias;

  /** TODO: colocar figuras de comparacao do FPI */
  private fpiScoreImages00: number[] = [-2, -1, 0, 1, 2];

  constructor(
    public popoverController: PopoverController,
    public modalController: ModalController,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private fpiService: AssessFpiService
  ) { }

  ngOnInit() {
    const initialFootSide = this.route.snapshot.paramMap.get('foot');
    this.fpiOnInit();
    this.fpiOnCurrentInit(initialFootSide);
  }

  /**
  * Inicializa o objeto da avaliação FPI
  */
  fpiOnInit() {
    this.assessFpi = {
      athleteId: this.route.snapshot.paramMap.get('id'),
      assessMethod: AssessMethod.Fpi,
      foot: {}
    };
  }

  /**
   * Inicializa valores da avaliação
   *
   * @param footSide Pé que está sendo avaliado
   */
  fpiOnCurrentInit(footSide: FootSide | string) {
    this.current = {
      footAssessed: footSide,
      footPictureActive: undefined,
      footPictureView: {},
      footView: FootView.Rear,
      foot: {
        [footSide]: {
          assessment: {
            [this.observationCriteria[0].value]: { score: -2 },
            [this.observationCriteria[1].value]: { score: -2 },
            [this.observationCriteria[2].value]: { score: -2 },
            [this.observationCriteria[3].value]: { score: -2 },
            [this.observationCriteria[4].value]: { score: -2 }
          },
          footPicture: {}
        }
      },
      observationSlide: 0
    };

    this.fpiSlides.slideTo(0);
    this.fpiScoresSlides00.slideTo(0);
    this.fpiScoresSlides01.slideTo(0);
    this.fpiScoresSlides02.slideTo(0);
    this.fpiScoresSlides03.slideTo(0);
    this.fpiScoresSlides04.slideTo(0);

    this.currentFpi = this.current.foot[footSide];
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
   * Tira foto
   * https://capacitor.ionicframework.com/docs/apis/camera/
   */
  async takePicture(footView: FootView) {
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

    this.processPicture(image, footView);
  }

  /** Transforma a imagem em um arquivo blob, gera o caminho da imagem
   * para apresentar na tela e armazena nas respectivas variaveis
   * 
   * https://developer.mozilla.org/en-US/docs/Web/API/Body/blob
   * https://firebase.google.com/docs/storage/web/file-metadata
   * https://angular.io/api/platform-browser/DomSanitizer
   */
  async processPicture(image: CameraPhoto, footView: FootView) {
    this.currentFpi.footPicture[footView] = {
      blob: await fetch(image.webPath).then(r => r.blob()),
      metadata: { contentType: 'image', customMetadata: image.exif }
    };

    this.current.footPictureActive = this.sanitizer.bypassSecurityTrustStyle(`url(${image.webPath})`);
    this.current.footPictureView[footView] = this.current.footPictureActive;
  }

  /**
   * Exclui imagem de visualiazção e arquivo de imagem que seria enviado
   */
  deletePicture(footView: FootView) {
    this.currentFpi.footPicture[footView] = {
      blob: undefined,
      metadata: undefined
    };
    this.current.footPictureActive = undefined;
    this.current.footPictureView[footView] = undefined;
  }

  /**
   * Gerencia a visualição da vista do pé corrente e a apresentação de fotos
   */
  changeFootViewPicture() {
    setTimeout(() => { // delay para capturar o slide ativo após o avançar ou voltar
      if (this.current.observationSlide === 4) {
        this.current.footView = FootView.InsideRearAngle;
        this.current.footPictureActive = this.current.footPictureView[FootView.InsideRearAngle];
        // console.log('POSTERIOR INTERNO OBLÍQUO');
      } else if (this.current.observationSlide === 3) {
        this.current.footView = FootView.Medial;
        this.current.footPictureActive = this.current.footPictureView[FootView.Medial];
        // console.log('MEDIAL');
      } else if (this.current.observationSlide === 2 && this.current.footView !== FootView.Rear) {
        this.current.footView = FootView.Rear;
        this.current.footPictureActive = this.current.footPictureView[FootView.Rear];
        // console.log('POSTERIOR');
      }
    }, 50);
  }

  /**
   * Define critério e valor observados
   * @param activeIndex
   */
  async setScore(activeIndex: Promise<number>) {
    const observation = this.observationCriteria[this.current.observationSlide].value;

    switch (await activeIndex) {
      case (0):
        this.currentFpi.assessment[observation] = { score: -2 };
        break;
      case (1):
        this.currentFpi.assessment[observation] = { score: -1 };
        break;
      case (2):
        this.currentFpi.assessment[observation] = { score: 0 };
        break;
      case (3):
        this.currentFpi.assessment[observation] = { score: 1 };
        break;
      case (4):
        this.currentFpi.assessment[observation] = { score: 2 };
        break;
      default:
        console.error('ERRO :(');
    }
  }

  /**
   * Soma todos os valores definidos nas observações do teste FPI,
   * o resultado define o index
   */
  calculateFpiIndex() {
    this.currentFpi.index = Object.values(this.currentFpi.assessment)
      .reduce((total, value) => total + value['score'], 0);
  }

  /**
   * Classifica e define a postura do pé baseado no index do FPI
   */
  footPostureResult() {
    this.calculateFpiIndex();
    switch (true) {
      case (this.currentFpi.index <= -4):
        this.currentFpi.posture = FootPosture.SupinatedHighly;
        break;
      case (this.currentFpi.index <= -1):
        this.currentFpi.posture = FootPosture.Supinated;
        break;
      case (this.currentFpi.index <= 4):
        this.currentFpi.posture = FootPosture.Neutral;
        break;
      case (this.currentFpi.index <= 8):
        this.currentFpi.posture = FootPosture.Pronated;
        break;
      case (this.currentFpi.index >= 9):
        this.currentFpi.posture = FootPosture.PronatedHighly;
        break;
      default:
        console.error('ERRO :(');
    }
    console.log(this.currentFpi.index);
    console.log(this.currentFpi.posture);
    // console.log(this.current);
    this.pushCurrentIntoFinalFpi();
  }

  /**
   * Insere os FPI corrente no FPI final
   */
  pushCurrentIntoFinalFpi() {
    this.assessFpi.foot[this.current.footAssessed] = this.current.foot[this.current.footAssessed];
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
   * https://ionicframework.com/docs/api/modal
   */
  async presentResult() {
    const modal = await this.modalController.create({
      component: ResultModalComponent,
      componentProps: {
        result: this.assessFpi,
        currentFootAssessed: this.current.footAssessed,
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data !== undefined) {
      if (data.nextAssessement) {
        // console.log(this.current.footAssessed);
        this.fpiOnCurrentInit(data.nextAssessementFoot);
        // console.log(this.current.footAssessed);
      }
    }
  }
}
