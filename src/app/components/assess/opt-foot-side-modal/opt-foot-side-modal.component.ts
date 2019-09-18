import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FootSide } from '../../../models/enums/foot.enum';

@Component({
  selector: 'app-opt-foot-side-modal',
  templateUrl: './opt-foot-side-modal.component.html',
  styleUrls: ['./opt-foot-side-modal.component.scss'],
})
export class OptFootSideModalComponent implements OnInit {
  @Input() assessMethod;
  @Input() assessedFoot?;


  noPhotos = false;

  footSide = FootSide;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    // this.checkAssessedFoot();
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

  get nextAssessFootSide(): FootSide {
    const isFootRightEmpty = !Object.keys(this.assessedFoot[FootSide.Right].view).length;
    return isFootRightEmpty ? FootSide.Right : FootSide.Left;
  }

  get askForOtherFootAssess() {
    return this.assessedFoot ? true : false;
  }


}
