import { Component, OnInit, ViewChild } from '@angular/core';
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
})
export class AssessFpiPage implements OnInit {

  /** queries no DOM para capturar elementos pelo id */
  // cada criterio tem um slide
  @ViewChild('fpiSlides', { static: false }) fpiSlides: IonSlides;
  // cada critério tem tem um slide com as pontuações
  @ViewChild('fpiScoresSlides00', { static: false }) fpiScoresSlides00: IonSlides;
  @ViewChild('fpiScoresSlides01', { static: false }) fpiScoresSlides01: IonSlides;
  @ViewChild('fpiScoresSlides02', { static: false }) fpiScoresSlides02: IonSlides;
  @ViewChild('fpiScoresSlides03', { static: false }) fpiScoresSlides03: IonSlides;
  @ViewChild('fpiScoresSlides04', { static: false }) fpiScoresSlides04: IonSlides;

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

  /** Objeto com as propriedade de avaliação do método FPI */
  private assessFpi: AssessFpi;

  /** Objeto que armazena atributos temporários da avaliação corrente */
  public current: AssessFpiCurrent;

  /** Variavel para armazenar atalho ao objeto current  */
  private _currentFoot;

  /** Criterios de observação para avaliação */
  private observationCriteria = FootObservation;

  /** TODO: colocar figuras de comparacao do FPI */
  private fpiScoreImages00: number[] = [-2, -1, 0, 1, 2];

  constructor(
    public modalController: ModalController,
    public popoverController: PopoverController
  ) { }

  ngOnInit() {
    // this.displayPreAssess();
    this.fpiOnInit();
    this.fpiCurrentOnInit(FootSide.Right);
  }

  /** Inicializa o objeto da avaliação FPI */
  fpiOnInit() {
    this.assessFpi = {
      patientId: 'get from modal',
      assessMethod: AssessMethod.Fpi,
      // foot: {}
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
            [this.observationCriteria[0]]: { score: -2 },
            [this.observationCriteria[1]]: { score: -2 },
            [this.observationCriteria[2]]: { score: -2 },
            [this.observationCriteria[3]]: { score: -2 },
            [this.observationCriteria[4]]: { score: -2 }
          }
        }
      },
      observationSlide: 0
    };

    // this.fpiSlides.slideTo(0);
    // this.fpiScoresSlides00.slideTo(0);
    // this.fpiScoresSlides01.slideTo(0);
    // this.fpiScoresSlides02.slideTo(0);
    // this.fpiScoresSlides03.slideTo(0);
    // this.fpiScoresSlides04.slideTo(0);

    this.currentFoot = this.current.foot[footSide];
  }

  set currentFoot(footSide) { this._currentFoot = this.current.foot[footSide]; }
  get currentFoot() { return this._currentFoot; }

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

}
