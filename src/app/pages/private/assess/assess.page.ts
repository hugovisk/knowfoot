import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { AthleteModalPage } from '../athlete-modal/athlete-modal.page';
import { FootSide } from '../../../models/enums/foot.enum';
import { StartModalComponent } from './start-modal/start-modal.component';
import { AssessMethod } from '../../../models/enums/assess.enum';


@Component({
  selector: 'app-assess',
  templateUrl: './assess.page.html',
  styleUrls: ['./assess.page.scss'],
})
export class AssessPage implements OnInit {

  athlete: {id: string, foot: FootSide } = {
    id: 'idDeTeste',
    foot: FootSide.Right
  };

  constructor(
    public modalController: ModalController,
    private router: Router
    ) { }

  ngOnInit() {
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AthleteModalPage,
      componentProps: {
        methodType: 123 // tirar isso
      }
    });
    return await modal.present();
  }

  async presentStartModal(method: AssessMethod) {
    const modal = await this.modalController.create({
      component: StartModalComponent,
      componentProps: {
        assessMethod: method
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    // console.log('data');
    // console.log(data);
    if (data) { // TODO verificar esse if
      const idAndFoot = `${data.currentAsseess.athleteId}/${data.currentAsseess.footSide}`;
      if (data.currentAsseess.method === AssessMethod.Fpi) {
        // console.log(idAndFoot);
        this.router.navigateByUrl(`/private/assess-fpi/${idAndFoot}`);
      } else if (data.currentAsseess.method === AssessMethod.NavicularDrop) {
        this.router.navigateByUrl(`/private/assess-drop/${idAndFoot}`);

      }
    }
  }

}
