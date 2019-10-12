import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeStyle } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';

import { FootView, FootSide } from '../../../../models/enums/foot.enum';
// import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { OptFootSideModalComponent } from '../../../../components/assess/opt-foot-side-modal/opt-foot-side-modal.component';
import { AssessMethod } from '../../../../models/enums/assess.enum';
import { CameraService } from '../../../../services/camera/camera.service';
import { PreAssessFpi } from '../../../../models/interfaces/assess';


@Component({
  selector: 'app-initial-foot-photos-modal',
  templateUrl: './initial-foot-photos-modal.component.html',
  styleUrls: ['./initial-foot-photos-modal.component.scss'],
})
export class InitialFootPhotosModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cameraStream', { static: false })
  private cameraStream: ElementRef;

  public medicalRecord; // TESTE
  public footView = FootView;
  public footSide = FootSide;

  public preAssess: PreAssessFpi;
  // public foot: {
  //   [sideKey: string]: {
  //     view?: { [viewKey: string]: SafeStyle }
  //   }
  // };

  public capturePreview: SafeStyle;

  private _currentView: FootView;
  private _currentFootSide: FootSide;
  private _lastTakedPhoto: SafeStyle;

  constructor(
    public modalController: ModalController,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    // public router: Router,
    // private sanitizer: DomSanitizer,
    private camera: CameraService
  ) { }


  get otherFootSide() { return this.currentFootSide === FootSide.Right ? FootSide.Left : FootSide.Right; }

  set currentView(view: FootView) { this._currentView = view; }
  get currentView() { return this._currentView; }

  set currentFootSide(side: FootSide) { this._currentFootSide = side; }
  get currentFootSide() { return this._currentFootSide; }

  get currentImage() { return this.preAssess.foot[this.currentFootSide].view[this.currentView].image; }

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

  /** Verifica se o outro pé já foi fotografado */
  get areBothFeetPhotographed() {
    if (!(Object.keys(this.preAssess.foot[this.otherFootSide].view[FootView.Posterior].image).length)) {
      return false;
    }
    return true;
  }

  ngAfterViewInit() {
    this.camera.startPreview(this.cameraStream);
  }

  ngOnInit() {
    this.displayOptFootSide(AssessMethod.Fpi);
    this.setMedicalRecord();
    this.preAssessOnInit();
    this.currentInit();
  }


  /**
   * inicializa objeto que armazena fotos das vistas de cada pé
   *
   */
  preAssessOnInit() {
    this.preAssess = {
      foot: {
        [FootSide.Right]: {
          view: {
            [FootView.Posterior]: { image: {}},
            [FootView.Medial]: { image: {}},
            [FootView.PosteriorToMedial]: { image: {}},
          }
        },
        [FootSide.Left]: {
          view: {
            [FootView.Posterior]: { image: {}},
            [FootView.Medial]: { image: {}},
            [FootView.PosteriorToMedial]: { image: {}},
          }
        }
      },
      patientId: 'xxxxxxxxxxxxx', // this.medicalRecord.patient.id,
      patientName: 'Moking Name'// this.medicalRecord.patient.name
    };
  }

  /**
   * Define a vista inicial e limpa ultima de fotos tirada ,
   * e define pé inicial somente para pré-carregar imagens da interface
   */
  currentInit() {
    if (this.currentFootSide === undefined) {
      this.currentFootSide = FootSide.Right;
    }
    this.currentView = FootView.Posterior;
    if (this.lastTakedPhoto) {
      this.lastTakedPhoto = null;
    }
  }


  /** Recebimento de dados do modal de definiçao do metodo */
  setMedicalRecord() {
    this.activatedRoute.paramMap
      .pipe(map(() => window.history.state))
      .forEach(x => this.medicalRecord = x);
    // console.log(this.medicalRecord);
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
      if (data.footSide) {
        this.currentFootSide = data.footSide;
        this.currentInit();
      } else {
        this.oneFootAssess();
      }
    } else {
      this.closeModal();
    }
    console.log(data); // TESTE
  }

  /**
   * Deleta a propriedade do pé que não sera avaliado no objeto preAssess
   * e chama o metodo de fechar o modal
   */
  oneFootAssess() {
    setTimeout(() => {
      console.log('Fechando o modal');
      delete this.preAssess.foot[this.otherFootSide];
      this.closeModalAndRetrievePreAssess();
    }, 250);
  }

  /** fecha esse modal e retorna paciente e fotos no objeto preAssess */
  async closeModalAndRetrievePreAssess() {
    await this.modalController.dismiss({
      preAssess: this.preAssess
    });
  }

  /** fecha esse modal */
  closeModal() {
    setTimeout( async () => {
      this.router.navigateByUrl('/tabs/assess');
      await this.modalController.dismiss();
    }, 250);
  }

  /** tira uma foto */
  async takePhoto() {
    if (this.pagination < 4) { // restricao goHorse, arrumar uma solução melhor
      const result = await this.camera.snapShot();
      this.photoAndViewManagement(result);
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
    // this.foot[this.currentFootSide].view[this.currentView] = result.imageUrl;
    this.currentImage.base64Url = result.imageUrl;
    this.currentImage.blob = result.imageBlob;
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
          this.closeModalAndRetrievePreAssess() :
          this.displayOptFootSide(AssessMethod.Fpi, this.preAssess.foot);
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
      delete this.preAssess.foot[this.currentFootSide].view[FootView.PosteriorToMedial].image.base64Url;
      this.lastTakedPhoto = this.preAssess.foot[this.currentFootSide].view[FootView.Posterior].image.base64Url;
      this.currentView = FootView.PosteriorToMedial;
    } else {
      delete this.preAssess.foot[this.currentFootSide].view[FootView.Posterior].image.base64Url;
      this.lastTakedPhoto = null;
      this.currentView = FootView.Posterior;
    }
  }

  ngOnDestroy() {
    this.camera.stopPreview();
  }
}
