import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FootSide, FootView } from '../../../models/enums/foot.enum';

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

  constructor(public modalController: ModalController) { }

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

  // TODO: if noPhotos true, close camera preview and start fpi assess
  async closeModalAndRetrieveFootSide(selectedFootSide) {
    await this.modalController.dismiss({
      footSide: selectedFootSide
    });
  }
  // TODO: ask for confirmation, close assess and back to home
  async closeModal() {
    await this.modalController.dismiss();
  }

  // TODO: information popup about the methods

}
