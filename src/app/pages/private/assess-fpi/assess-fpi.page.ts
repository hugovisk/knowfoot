import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { IonSlides, ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource, CameraOptions } from '@capacitor/core';

import { AssessFpiService } from '../../../services/assess/assess-fpi.service';

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
  fpiScoreslideOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
    centeredSlides: true,
    slideToClickedSlide: true
  };

  /** objeto com os atributos do teste FPI
  private fpi: AssessFpi;*/

  /** objeto com os atributos do teste FPI */
  private assessement: AssessFpi;

  /** objeto com os atributos de apoio ao teste FPI */
  private current: CurrentAssessFpi;

  private footPictureActive: SafeStyle;
  private footPictureView: {
    insideRearAngle: SafeStyle,
    rear: SafeStyle,
    medial: SafeStyle
  };

  private footAssessed: FootSide | string;
  // variaveis auxiliares
  private currentFpi;

  /** importação das descrições do criterios de observação */
  private observationCriteria = fpiContents.criterias;

  /** importação das descrições do criterios de observação */
  private footView = fpiContents.footView;

  /** importação das classificações des posturas do pé */
  private footPosture = fpiContents.footPosture;

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
    this.setAthleteId();
    this.currentInit(initialFootSide);
  }

  setAthleteId() {
    this.assessement = {
      athleteId: this.route.snapshot.paramMap.get('id')
    };
  }

  currentInit(footSide: FootSide | string) {
    this.footAssessed = footSide;
    this.current = {
      // footAssessed: footSide,
      fpi: {
        foot: {
          [footSide]: {
            assessment: {
              [this.observationCriteria[0].value]: { score: -2 },
              [this.observationCriteria[1].value]: { score: -2 },
              [this.observationCriteria[2].value]: { score: -2 },
              [this.observationCriteria[3].value]: { score: -2 },
              [this.observationCriteria[4].value]: { score: -2 }
            },
            footPicture: {
              [this.footView[0].value]: { blob: undefined, metadata: { customMetadata: undefined } },
              [this.footView[1].value]: { blob: undefined, metadata: { customMetadata: undefined } },
              [this.footView[2].value]: { blob: undefined, metadata: { customMetadata: undefined } }
            }
          }
          // footPicture: {
          //   rear: undefined,
          //   medial: undefined,
          //   insideRearAngle: undefined
          // }
        }
      },
      footView: this.footView[2].value,
      observationSlide: 0
    };

    this.fpiSlides.slideTo(0);
    this.fpiScoresSlides00.slideTo(0);
    this.fpiScoresSlides01.slideTo(0);
    this.fpiScoresSlides02.slideTo(0);
    this.fpiScoresSlides03.slideTo(0);
    this.fpiScoresSlides04.slideTo(0);
    this.footPictureActive = undefined;
    this.footPictureView = {
      rear: undefined,
      medial: undefined,
      insideRearAngle: undefined
    };
    // auxiliar para encurtar nome da variavel que define o pé que esta sendo avaliado
    this.currentFpi = this.current.fpi.foot[this.footAssessed];
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

    // console.log('Got image back', image.path, image.webPath, image.format, image.exif);cons
    const blobTest = await fetch(image.webPath).then(r => r.blob());
    const metadataTest = { contentType: 'image', customMetadata: image.exif };

    this.currentFpi.footPicture[footview] = {
      blob: await fetch(image.webPath).then(r => r.blob()),
      metadata: { customMetadata: image.exif }
    };


    // const url = await this.fpiService.uploadFootPicture(
    //   footview,
    //   'images/',
    //   blobTest,
    //   // metadataTest,
    //   'Right'
    // );

    // console.log(url);
    // this.upload(this.current.fpi.footPicture); // teste

    // console.log('Got image', image);
    // console.log('Got image back', image.exif);
    // console.log('Blob image', blob);
    // console.log('Got image base64', image.base64String);
    // console.log('Got image dataUrl', image.dataUrl);

    // this.current.fpi.footPicture[footview] = image.webPath.slice(22);

    // Gera caminho da imagem para apresentar na tela.
    // DomSanitizer valida o caminho para ser usado no DOM,
    // o Angular bloqueia a injeção de valores suspeitos, o que
    // ajuda a previnir Cross Site Scripting Securety Bugs (XSS),
    // uso mal intencionado de injeção um javascript por URL
    // this.footPictureActive = this.sanitizer.bypassSecurityTrustStyle(`url(${image.webPath})`);
    this.footPictureActive = this.sanitizer.bypassSecurityTrustStyle(`url(${image.webPath})`);
    this.footPictureView[footview] = this.footPictureActive;
  }

  /**
   * Exclui foto
   */
  deletePicture(footview: string) {
    // this.current.fpi.footPicture[footview] = undefined;
    this.currentFpi.footPicture[footview] = {
      blob: undefined,
      metadata: { customMetadata: undefined }
    };
    this.footPictureActive = undefined;
    this.footPictureView[footview] = undefined;
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
   * Captura a posição do slide ativo
   * @param activeIndex
   *
   * https://ionicframework.com/docs/api/slides
   */
  async setCurrentObservationSlide(activeIndex: Promise<number>) {
    this.current.observationSlide = await activeIndex;
  }

  /** TODO: arrumar descricao do metodo que mudou
   * 
   * Altera a indicação da vista de obserção do pé avaliado.
   * Para os critérios de observação Curvatura supra e infra maleolar lateral, Posição do
   * calcâneo, Abdução e adução do antepé sobre o retropé, define a vista postorior do pé.
   * Para Altura do arco longitudinal medial e Proeminência na região da ATN, define a
   * vista medial do pé.
   */
  // changeFootViewPicture() {
  //   setTimeout(() => { // delay para capturar o slide ativo após o avançar ou voltar
  //     if (this.current.observationSlide === 4 && this.current.footView !== FootView.InsideRearAngle) {
  //       this.current.footView = FootView.InsideRearAngle;
  //       console.log('POSTERIOR INTERNO OBLÍQUO');
  //     } else if (this.current.observationSlide === 3 && this.current.footView !== FootView.Medial) {
  //       this.current.footView = FootView.Medial;
  //       console.log('MEDIAL');
  //     } else if (this.current.observationSlide === 2 && this.current.footView !== FootView.Rear) {
  //       this.current.footView = FootView.Rear;
  //       console.log('POSTERIOR');
  //     }
  //   }, 50);
  // }
  changeFootViewPicture() {
    setTimeout(() => { // delay para capturar o slide ativo após o avançar ou voltar
      if (this.current.observationSlide === 4 && this.current.footView !== this.footView[0].value) {
        this.current.footView = this.footView[0].value;
        this.footPictureActive = this.footPictureView.insideRearAngle;
        console.log('POSTERIOR INTERNO OBLÍQUO');
      } else if (this.current.observationSlide === 3 && this.current.footView !== this.footView[1].value) {
        this.current.footView = this.footView[1].value;
        this.footPictureActive = this.footPictureView.medial;
        console.log('MEDIAL');
      } else if (this.current.observationSlide === 2 && this.current.footView !== this.footView[2].value) {
        this.current.footView = this.footView[2].value;
        this.footPictureActive = this.footPictureView.rear;
        console.log('POSTERIOR');
      }
    }, 50);
  }

  /**
   * Soma todos os valores definidos nas observações do teste FPI,
   * o resultado define o index
   */
  calculateFpiIndex() {
    // console.log(this.currentFpi.assessment);
    this.currentFpi.index = Object.values(this.currentFpi.assessment)
      .reduce((total, value) => {
        // console.log(value);
        return total + value.score;
      }, 0);
    // total + value.score, 0);
  }

  /**
   * Classifica e define a postura do pé baseado no index do FPI
   */
  footPostureResult() {
    this.calculateFpiIndex();
    switch (true) {
      case (this.currentFpi.index <= -4):
        this.currentFpi.posture = this.footPosture[0].value;
        break;
      case (this.currentFpi.index <= -1):
        this.currentFpi.posture = this.footPosture[1].value;
        break;
      case (this.currentFpi.index <= 4):
        this.currentFpi.posture = this.footPosture[2].value;
        break;
      case (this.currentFpi.index <= 8):
        this.currentFpi.posture = this.footPosture[3].value;
        break;
      case (this.currentFpi.index >= 9):
        this.currentFpi.posture = this.footPosture[4].value;
        break;
      default:
        console.error('ERRO :(');
    }
    console.log(this.currentFpi.index);
    console.log(this.currentFpi.posture);
    // console.log(this.current.fpi.assessment);
    this.setFpiFootAssessed();
  }

  /**
   * Atribui os valores do teste corrente ao pé relacionado
   * no objeto fpi
   */
  setFpiFootAssessed() {
    console.log(this.current.fpi);
    // if (this.current.footAssessed === 'esquerdo') {
    this.assessement.fpi = this.current.fpi;
    // } else {
    //   this.fpi.footRight = this.current.fpi;
    // }
    console.log('ho')
  }

  /**
   * https://ionicframework.com/docs/api/modal 
   */
  async presentResult() {
    const modal = await this.modalController.create({
      component: ResultModalComponent,
      componentProps: {
        result: this.assessement,
        currentFootAssessed: this.footAssessed,
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    // console.log(data);
    if (data !== undefined) {
      if (data.nextAssessement) {
        // this.current.footAssessed = data.nextAssessementFoot;
        console.log(this.current.footAssessed);
        this.currentInit(data.nextAssessementFoot);
      }
    }
  }

  upload(footPicture: Object) {
    // const storagePath: AngularFireStorageReference = this.fireStorage.ref(
    //   `${this.userId}/${athleteId}/${assessId}/footPicture/`
    // );
    const footPictures = Object.entries(footPicture);

    for (const [view, picture] of footPictures) {
      if (picture.blob !== undefined) {
        console.log(view);
        console.log(picture.blob);
        console.log(picture.metadata);
        console.log('::::::::::::');
      }
    }
  }

}

