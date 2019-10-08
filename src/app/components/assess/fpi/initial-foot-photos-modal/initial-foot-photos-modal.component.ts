import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeStyle } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
// import {
//   CameraPreview,
//   CameraPreviewPictureOptions,
//   CameraPreviewOptions,
//   CameraPreviewDimensions
// } from '@ionic-native/camera-preview/ngx';
// import { Plugins, CameraResultType, CameraSource, CameraOptions, CameraDirection } from '@capacitor/core';
import { FootView, FootSide } from '../../../../models/enums/foot.enum';
// import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { OptFootSideModalComponent } from '../../../../components/assess/opt-foot-side-modal/opt-foot-side-modal.component';
import { AssessMethod } from '../../../../models/enums/assess.enum';
import { CameraService } from '../../../../services/camera/camera.service';
// import { Camera } from '@capacitor/core';
// import undefined = require('firebase/empty-import');

// const { CameraPreview } = Plugins;


@Component({
  selector: 'app-initial-foot-photos-modal',
  templateUrl: './initial-foot-photos-modal.component.html',
  styleUrls: ['./initial-foot-photos-modal.component.scss'],
})
export class InitialFootPhotosModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cameraStream', { static: false })
  private cameraStream: ElementRef;

  pacientData; // TESTE
  public footView = FootView;
  public footSide = FootSide;
  // public preAssessFpi: {
  //   assessMethod?: AssessMethod,
  //   patientId?: string;
  //   patientName?: string;
  //   foot: {
  //     [sideKey: string]: {
  //       view?: {
  //         [viewKey: string]: {
  //           imageUrl: SafeResourceUrl,
  //           imageBlob: Blob
  //         }
  //       }
  //     }
  //   }
  // };
  public foot: {
    [sideKey: string]: {
      view?: { [viewKey: string]: SafeStyle }
    }
  };

  public blob: {
    [sideKey: string]: {
      view?: { [viewKey: string]: Blob }
    }
  };

  public capturePreview: SafeStyle;

  private _currentView: FootView;
  private _currentFootSide: FootSide;
  private _lastTakedPhoto: SafeStyle;

  constructor(
    public modalController: ModalController,
    public activatedRoute: ActivatedRoute,
    // private sanitizer: DomSanitizer,
    private camera: CameraService
  ) { }

  set currentView(view: FootView) { this._currentView = view; }
  get currentView() { return this._currentView; }

  set currentFootSide(side: FootSide) { this._currentFootSide = side; }
  get currentFootSide() { return this._currentFootSide; }

  set lastTakedPhoto(footView: SafeStyle) { this._lastTakedPhoto = footView; }
  get lastTakedPhoto() { return this._lastTakedPhoto; }

  /** @return paginação da sequencia de fotos. */
  get pagination() {
    switch (this.currentView) {
      case (FootView.Posterior): return 1;
      case (FootView.PosteriorToMedial): return 2;
      case (FootView.Medial): return 3;
      default:
        console.error('ERRO :(');
    }
   }

  /** Verifica se ambos os pés foram fotografados */
  get areBothFeetPhotographed() {
    for (const side in this.footSide) {
      if (this.footSide.hasOwnProperty(side)) {
        if (!(Object.keys(this.foot[side].view).length)) {
          return false;
        }
      }
    }
    return true;
  }

  ngAfterViewInit() {
    this.camera.startPreview(this.cameraStream);
  }

  ngOnInit() {
    this.displayOptFootSide(AssessMethod.Fpi);
    this.testGetData();
    this.footPhotosOnInit();
    this.footSidePhotosInit();
  }


  /**
   * inicializa objeto que armazena fotos das vistas de cada pé
   * e define pé inicial somente para pré-carregar imagens da interface
   */
  footPhotosOnInit() {
    this.foot = {
      [FootSide.Right]: { view: {} },
      [FootSide.Left]: { view: {} }
    };

    this.currentFootSide = FootSide.Right;
  }

  /** Define a vista inicial e limpa ultima de fotos tirada */
  footSidePhotosInit() {
    this.currentView = FootView.Posterior;
    this.lastTakedPhoto = null;
  }


  /** teste recebimento de dados do modal de definiçao do metodo */
  testGetData() {
    // this.testState$ = this.activatedRoute.paramMap
    //   .pipe(map(() => window.history.state));
    // console.log(this.testState$);
    this.activatedRoute.paramMap
      .pipe(map(() => window.history.state))
      .forEach(x => this.pacientData = x);
    console.log(this.pacientData);
  }

  /** Apresenta modal para escolha de pé que será avaliado */
  async displayOptFootSide(method: AssessMethod, foots?) {
    const modal = await this.modalController.create({
      component: OptFootSideModalComponent,
      componentProps: {
        assessMethod: method,
        assessedFoot: foots
      },
      cssClass: 'test-modal', // TESTE
      backdropDismiss: false
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) { // valiadação pois pode retornar undefined
      this.currentFootSide = data.footSide;
      this.footSidePhotosInit();
    }
    console.log(data.patient); // TESTE
  }

  /** fecha esse modal */
  async closeModal() {
    await this.modalController.dismiss();
  }

  /** tira a foto */
  async takePhoto() {
    if (this.pagination < 4) { // restricao goHorse, arrumar uma solução melhor
      const result = await this.camera.snapShot();
      this.photoAndViewManagement(result);
      console.log(result.imageBlob);
    } else {
      console.error('ERROR!');
    }
  }

  /**
   * Armazena foto na vista definida, gerencia a visualição da vista corrente,
   * define miniatura da foto tirada
   *
   * obs: sequencia de vistas definida | posterior > posteriorToMedial > medial
   */
  photoAndViewManagement(result) {
    this.foot[this.currentFootSide].view[this.currentView] = result.imageUrl;
    this.lastTakedPhoto = result.imageUrl;

    switch (this.currentView) {
      case (FootView.Posterior):
        this.currentView = FootView.PosteriorToMedial;
        break;
      case (FootView.PosteriorToMedial):
        this.currentView = FootView.Medial;
        break;
      case (FootView.Medial):
        this.areBothFeetPhotographed ?
          this.closeModal() :
          this.displayOptFootSide(AssessMethod.Fpi, this.foot);
        break;
      default:
        console.error('ERRO :(');
    }
  }

  /**
   * armazena as fotos tiradas no objeto foot no formato base64
   * e valida a segurança do conteudo para ser incluido no DOM
   */
  // addPhoto(footSide: FootSide, footView: FootView, cameraResult: SafeStyle) {
  //   this.foot[footSide].view[footView] = cameraResult;
  // }
  // this.sanitizer
  //   .bypassSecurityTrustStyle(`url(data:image/png;base64,${cameraResult})`);


  /**
   * Exclui a imagem da ultima foto tirada e volta a vista corrente para a anterior
   *
   * obs: depende da sequencia de vistas definidas previamente
   *      posterior > posteriorToMedial > medial
   */
  deleteLastTakedPhoto() {
    if (this.currentView === FootView.Medial) {
      delete this.foot[this.currentFootSide].view[FootView.PosteriorToMedial];
      this.lastTakedPhoto = this.foot[this.currentFootSide].view[FootView.Posterior];
      this.currentView = FootView.PosteriorToMedial;
    } else {
      delete this.foot[this.currentFootSide].view[FootView.Posterior];
      this.lastTakedPhoto = null;
      this.currentView = FootView.Posterior;
    }
  }

  ngOnDestroy() {
    this.camera.stopPreview();
  }
}
