import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FootSide, FootView } from '../../../models/enums/foot.enum';
// import { Router } from '@angular/router';

@Component({
  selector: 'app-opt-foot-side-modal',
  templateUrl: './opt-foot-side-modal.component.html',
  styleUrls: ['./opt-foot-side-modal.component.scss'],
})
export class OptFootSideModalComponent implements OnInit {
  @Input() assessMethod;
  @Input() assessedFoot?;

  /** opcao de não tirar fotos para a avaliação fpi */
  noPhotos = false;

  /** objeto com lados dos pés */
  footSide = FootSide;

  constructor( public modalController: ModalController ) { }

  ngOnInit() { }

  get nextAssessFootSide(): FootSide {
    return this.isFootRightPhotosEmpty ? FootSide.Right : FootSide.Left;
  }

  get isFootRightPhotosEmpty() {
    return !Object.keys(this.assessedFoot[FootSide.Right].view[FootView.Posterior]).length;
  }

  get askForOtherFootAssess() {
    return this.assessedFoot ? true : false;
  }

  /**
   * Fecha o modal e retorna proximo pé a ser avaliado, se houver,
   * para a componente de camera
   *
   * @param next proximo pé a ser fotografado ou `false` se usuario escolher
   * avaliar somente um pe
   */
  async closeModalAndRetrieveFootSide(next: FootSide | boolean) {
    await this.modalController.dismiss({
      footSide: next
    });
  }
  // TODO: ask for confirmation, close assess and back to home
  async closeModal() {
    // this.router.navigateByUrl('/tabs/assess');
    await this.modalController.dismiss();
  }

  // testRoute() {
  //   this.router.navigateByUrl('');
  //   console.log('oi');
  //   this.modalController.dismiss();
  // }

  // TODO: information popup about the methods

}
