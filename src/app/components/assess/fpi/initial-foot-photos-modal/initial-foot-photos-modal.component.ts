import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeStyle } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource, CameraOptions, CameraDirection } from '@capacitor/core';
import { FootView, FootSide } from '../../../../models/enums/foot.enum';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { OptFootSideModalComponent } from '../../../../components/assess/opt-foot-side-modal/opt-foot-side-modal.component';
import { AssessMethod } from '../../../../models/enums/assess.enum';

const { CameraPreview } = Plugins;


@Component({
  selector: 'app-initial-foot-photos-modal',
  templateUrl: './initial-foot-photos-modal.component.html',
  styleUrls: ['./initial-foot-photos-modal.component.scss'],
})
export class InitialFootPhotosModalComponent implements OnInit {
  // private testState$: Observable<object>;
  testDataPass;

  // private photo: SafeResourceUrl;
  private footView = FootView;
  private footSide = FootSide;
  private currentView: FootView;
  private currentFootSide: FootSide;
  private takedPhotosNumber: number;
  private lastTakedPhoto: SafeResourceUrl;
  private foot: {
    [sideKey: string]: {
      view?: { [viewKey: string]: SafeResourceUrl }
    }
  };

  constructor(
    public modalController: ModalController,
    public activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    this.setCurrentFootSide(FootSide.Right);
  }

  ngOnInit() {
    this.displayOptFootSide(AssessMethod.Fpi);
    this.testGetData();
    this.footOnInit();
    this.footPhotosInit();
    const cameraOptions = {
      parent: 'cameraPreview',
      className: 'test'
    };
    CameraPreview.start(cameraOptions);
  }

  /** inicializa objeto que armazena fotos das vistas de cada pé */
  footOnInit() {
    this.foot = {
      [FootSide.Right]: { view: {} },
      [FootSide.Left]: { view: {} }
    };
  }

  footPhotosInit() {
    this.setCurrentView(FootView.Posterior);
    this.lastTakedPhoto = undefined;
    this.countTakedPhotos();
  }


  /** teste recebimento de dados do modal de definiçao do metodo */
  testGetData() {
    // this.testState$ = this.activatedRoute.paramMap
    //   .pipe(map(() => window.history.state));
    // console.log(this.testState$);

    this.activatedRoute.paramMap
      .pipe(map(() => window.history.state))
      .forEach(x => this.testDataPass = x);
    console.log(this.testDataPass);
  }


  /** Define a vista que a proxima foto deve ser tirada */
  setCurrentView(view: FootView) {
    this.currentView = view;
  }

  /** Define o pé que está sendo fotografado */
  setCurrentFootSide(side: FootSide) {
    this.currentFootSide = side;
  }


  /**
   * Apresenta escolha do pé que será fotografado
   */
  async displayOptFootSide(method: AssessMethod, foots?) {
    const modal = await this.modalController.create({
      component: OptFootSideModalComponent,
      componentProps: {
        assessMethod: method,
        assessedFoot: foots
      },
      cssClass: 'test-modal',
      backdropDismiss: false
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    // console.log(data);
    if (data) { // pode ser que retorne undefined
      this.setCurrentFootSide(data.footSide);
      this.footPhotosInit();
      // this.currentFootSide = data.footSide;
    }
    console.log(data.patient);
  }

  /** fecha esse modal */
  async closeModal() {
    await this.modalController.dismiss();
  }


  async takePhoto() {
    if (this.takedPhotosNumber < 4) { // validacao de erro goHorse, arrumar uma solução melhor
      const result = await CameraPreview.capture();
      this.photoAndViewManagement(result.value);

    } else {
      console.error('ERROR!');
    }
  }

  /**
   * Armazena foto na vista definida, gerencia a visualição da vista corrente,
   * define miniatura da foto tirada e faz a contagem de quantas fotos foram feitas
   *
   * obs: sequencia de vistas definida
   *      posterior > posteriorToMedial > medial
   */
  photoAndViewManagement(photo: string) {
    switch (this.currentView) {
      case (FootView.Posterior):
        this.addPhoto(this.currentFootSide, FootView.Posterior, photo);
        this.updateLastTakedPhoto(FootView.Posterior);
        this.setCurrentView(FootView.PosteriorToMedial);
        break;
      case (FootView.PosteriorToMedial):
        this.addPhoto(this.currentFootSide, FootView.PosteriorToMedial, photo);
        this.updateLastTakedPhoto(FootView.PosteriorToMedial);
        this.setCurrentView(FootView.Medial);
        break;
      case (FootView.Medial):
        this.addPhoto(this.currentFootSide, FootView.Medial, photo);
        this.updateLastTakedPhoto(FootView.Medial);
        this.displayOptFootSide(AssessMethod.Fpi, this.foot);
        // this.setCurrentView(null);
        break;
      default:
        console.error('ERRO :(');
    }

    this.countTakedPhotos();
  }

  /**
   * armazena as fotos tiradas no objeto foot no formato base64
   * e valida a segurança do conteudo para ser incluido no DOM
   */
  addPhoto(footSide: FootSide, footView: FootView, cameraResult: string) {
    this.foot[footSide].view[footView] =
      this.sanitizer.bypassSecurityTrustStyle(`url(data:image/png;base64,${cameraResult})`);
  }

  /** Define a imagem que será apresentada nas fotos tiradas */
  updateLastTakedPhoto(footView: FootView) {
    this.lastTakedPhoto = this.foot[this.currentFootSide].view[footView];
  }

  /**
   * Exclui a imagem da ultima foto tirada e volta a vista corrente para a anterior
   *
   * obs: depende da sequencia de vistas definidas previamente
   *      posterior > posteriorToMedial > medial
   */
  deleteLastTakedPhoto() {
    if (this.currentView === FootView.Medial) {
      delete this.foot[this.currentFootSide].view[FootView.PosteriorToMedial];
      this.updateLastTakedPhoto(FootView.Posterior);
      this.setCurrentView(FootView.PosteriorToMedial);
    } else {
      delete this.foot[this.currentFootSide].view[FootView.Posterior];
      this.lastTakedPhoto = null;
      this.setCurrentView(FootView.Posterior);
    }
    this.countTakedPhotos();
  }

  /** Conta a quantidade de fotos no objeto foot do pe corrente e
   * define quantas ja foram tiradas, inicia em 1 termina em 3
   */
  countTakedPhotos() {
    const countPhotos = (Object.keys(this.foot[this.currentFootSide].view).length);
    this.takedPhotosNumber = countPhotos < 3 ? countPhotos + 1 : countPhotos;
  }

}
