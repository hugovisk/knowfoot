import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList, ContentChildren } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { IonSlides, ModalController, PopoverController } from '@ionic/angular';


import {
  InitialFootPhotosModalComponent
} from '../../../components/assess/fpi/initial-foot-photos-modal/initial-foot-photos-modal.component';

import { AssessFpi, AssessFpiCurrent } from '../../../models/interfaces/assess';
import { AssessMethod } from '../../../models/enums/assess.enum';
import { FootSide, FootView, FootPosture, FootObservation } from '../../../models/enums/foot.enum';

@Component({
  selector: 'app-assess-fpi',
  templateUrl: './assess-fpi.page.html',
  styleUrls: ['./assess-fpi.page.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('0.2s ease-out',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('0.1s ease-in',
              style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class AssessFpiPage implements OnInit, AfterViewInit {

  /** queries no DOM para capturar os elementos de slide */
  @ViewChildren(IonSlides) slides: QueryList<IonSlides>;

  /**
   * array com os slides
   * indice 0 slide principal que contem criterios de observacao
   * indices de 1 a 5 slides de pontuacao da observacao
   */
  fpiSlides: IonSlides[];

  /** opções do slide principal que contem criterios de observacao
   * http://idangero.us/swiper/api/
   */
  fpiSlideOptions = {
    noSwiping: true,
    // pagination: {
    //   el: '.swiper-pagination',
    //   type: 'progressbar',
    // }
  };

  /** opções dos slides de pontuação da observação com vista posterior
   *  http://idangero.us/swiper/api/
   */
  fpiScoreSlidePosteriorOptions = {
    slidesPerView: 4,
    spaceBetween: 20,
    centeredSlides: true,
    slideToClickedSlide: true
  };

  /** opções dos slides de pontuação da observação com vista medial e obliqua
   *  http://idangero.us/swiper/api/
   */
  fpiScoreSlideMedialOptions = {
    slidesPerView: 2,
    spaceBetween: 0,
    centeredSlides: true,
    slideToClickedSlide: true
  };

  /** Objeto com propriedades de avaliação do método FPI */
  private assessFpi: AssessFpi;

  /** Objeto de atributos temporários da avaliação corrente */
  public current: AssessFpiCurrent;

  /** Atalho ao objeto current  */
  private _currentFoot;

  public isScoreSelected: boolean;

  /** Pontuaçao escolhida */
  public activeScore: number;

  public showObservationInfo: boolean;

  /** Criterios de observação para avaliação */
  public footObservation = FootObservation;

  /** Posturas do pe */
  public footPosture = FootPosture;

  constructor(
    public modalController: ModalController,
    public popoverController: PopoverController
  ) { }

  ngOnInit() {
    // this.displayPreAssess();
    this.fpiOnInit();
    this.fpiCurrentOnInit(FootSide.Right);
  }

  ngAfterViewInit() {
    this.fpiSlides = this.slides.toArray();
    this.fpiSlideToInit();
  }

  /** Inicializa o objeto da avaliação FPI */
  fpiOnInit() {
    this.assessFpi = {
      patientId: 'get from modal',
      assessMethod: AssessMethod.Fpi,
      foot: {}
    };
  }

  /**
   * Inicializa valores da avaliação corrente
   *
   * @param footSide Pé que está sendo avaliado
   */
  fpiCurrentOnInit(footSide: FootSide) {
    this.current = {
      footAssessed: footSide,
      footPictureActive: undefined,
      footPictureView: {},
      footView: FootView.Posterior,
      foot: {
        [footSide]: {
          assessment: {
            [FootObservation.AbductionAdductionOfForefootOnRearfoot]: { score: 0 },
            [FootObservation.CalcanealFrontalPlanePosition]: { score: 0 },
            [FootObservation.CongruenceOfMedialLongitudinalArch]: { score: 0 },
            [FootObservation.ProeminenceInRegionOfTnj]: { score: 0 },
            [FootObservation.SupraAndInfraLateralMalleoliCurvature]: { score: 0 }
          }
        }
      },
      observationSlide: FootObservation.CalcanealFrontalPlanePosition
    };
    this.currentFoot = footSide;
  }

  fpiSlideToInit() {
    for (let index = 0; index < this.fpiSlides.length; index++) {
      if (index) {
        this.fpiSlides[index].slideTo(2);
      } else {
        this.fpiSlides[index].slideTo(0);
      }
    }
  }

  set currentFoot(footSide) { this._currentFoot = this.current.foot[footSide]; }
  get currentFoot() { return this._currentFoot; }

  get currentFootSide() {
    const footSide = Object.keys(this.current.foot);
    return footSide[0];
  }

  get otherFootSide() { return this.currentFootSide === FootSide.Right ? FootSide.Left : FootSide.Right; }

  get slideOptions() {
    if (
      this.current.observationSlide === FootObservation.CongruenceOfMedialLongitudinalArch ||
      this.current.observationSlide === FootObservation.ProeminenceInRegionOfTnj
    ) {
      return this.fpiScoreSlideMedialOptions;
    }
    return this.fpiScoreSlidePosteriorOptions;
  }

  /**
   * Apresenta formulario de cadastro para novo paciente
   */
  async displayPreAssess() {
    const modal = await this.modalController.create({
      component: InitialFootPhotosModalComponent
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) { // valiadação pois pode retornar undefined
      console.log(data); // TESTE
      // this.currentFootSide = data.footSide;
      // this.currentInit();
    }
    // console.log(data); // TESTE
  }

  /**
   * Captura a posição do slide ativo
   * @param activeIndex
   *
   * https://ionicframework.com/docs/api/slides
   */
  async setCurrentFootObservation(activeIndex: Promise<number>) {
    // console.log('activeIndex ' + await activeIndex);
    switch (await activeIndex) {
      case (0):
        this.current.observationSlide = FootObservation.CalcanealFrontalPlanePosition;
        break;
      case (1):
        this.current.observationSlide = FootObservation.SupraAndInfraLateralMalleoliCurvature;
        break;
      case (2):
        this.current.observationSlide = FootObservation.AbductionAdductionOfForefootOnRearfoot;
        break;
      case (3):
        this.current.observationSlide = FootObservation.CongruenceOfMedialLongitudinalArch;
        break;
      case (4):
        this.current.observationSlide = FootObservation.ProeminenceInRegionOfTnj;
        break;
      default:
        console.error('ERRO :(');
    }
  }

  /**
   * Define critério e valor observados
   * @param activeIndex
   */
  async setScore(activeIndex: Promise<number>) {
    const observation = this.footObservation[this.current.observationSlide];
    this.activeScore = await activeIndex;
    // this.isScoreSelected = true;
    // this.verifyScoreSelection();

    switch (this.activeScore) {
      case (0):
        this.currentFoot.assessment[observation] = { score: -2 };
        break;
      case (1):
        this.currentFoot.assessment[observation] = { score: -1 };
        break;
      case (2):
        this.currentFoot.assessment[observation] = { score: 0 };
        break;
      case (3):
        this.currentFoot.assessment[observation] = { score: 1 };
        break;
      case (4):
        this.currentFoot.assessment[observation] = { score: 2 };
        break;
      default:
        console.error('ERRO :(');
    }
    // console.log(observation);
    // console.log(this.currentFoot.assessment[observation]);
  }

  validScoreSelected() {
    if (!this.isScoreSelected) {
      this.isScoreSelected = true;
    }
  }

  observationNext() {
    if (!this.isScoreSelected) {
      console.warn('Selecione a opção mais parecida como pé do paciente');
    } else {
      this.fpiSlides[0].slideNext();
      this.isScoreSelected = false;
    }
  }

  observationPrevious() {
    this.fpiSlides[0].slidePrev();
    this.isScoreSelected = true;
  }

  endFootAssessment() {
    this.assessFpi.foot[this.currentFootSide] = this.currentFoot;

    const assessedFoot = Object.keys(this.assessFpi.foot).length;

    if (assessedFoot === 1) {
      // inicia outro pé
      console.warn('Iniciando avaliacao do outro pe');
      this.fpiCurrentOnInit(this.otherFootSide);
      this.fpiSlideToInit();
      this.isScoreSelected = false;
    } else {
      // encerra avaliação
      console.warn('Encerra avaliacao');
    }

    console.log(this.assessFpi);
  }


  /** Apresenta modal para escolha de pé que será avaliado */
  // async displayOptFootSide(method: AssessMethod, foots?) {
  //   const modal = await this.modalController.create({
  //     component: OptFootSideModalComponent,
  //     componentProps: {
  //       assessMethod: method,
  //       assessedFoot: foots
  //     },
  //     cssClass: 'test-modal', // TESTE
  //     backdropDismiss: false
  //   });
  //   await modal.present();
  //   const { data } = await modal.onWillDismiss();
  //   if (data) { // valiadação pois pode retornar undefined
  //     this.currentFootSide = data.footSide;
  //     this.currentInit();
  //   }
  //   console.log(data); // TESTE
  // }

  /**
   * helper para manter a ordenação do objeto iterado no pipe keyvalue,
   * sem ele o pipe keyvalue ordena os pares alfabeticamente
   */
  keepOrder = (a: string) => a;

}
