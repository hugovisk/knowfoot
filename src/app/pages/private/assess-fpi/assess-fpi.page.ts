import { Component, OnInit, ViewChild } from '@angular/core';

import { IonSlides } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';

import { FpiCriteriaInformationComponent } from './fpi-criteria-information/fpi-criteria-information.component';


@Component({
  selector: 'app-assess-fpi',
  templateUrl: './assess-fpi.page.html',
  styleUrls: ['./assess-fpi.page.scss'],
})
export class AssessFpiPage implements OnInit {

  // @ViewChild('fpi01') fpi01: IonSlides;
  // @ViewChild('fpi02') fpi02: IonSlides;
  // @ViewChild('fpi03') fpi03: IonSlides;
  // @ViewChild('fpi04') fpi04: IonSlides;
  // @ViewChild('fpi05') fpi05: IonSlides;

  @ViewChild('fpiScore01') fpiScore01: IonSlides;
  // @ViewChild('fpiScore02') fpiScore02: IonSlides;
  // @ViewChild('fpiScore03') fpiScore03: IonSlides;
  // @ViewChild('fpiScore04') fpiScore04: IonSlides;
  // @ViewChild('fpiScore05') fpiScore05: IonSlides;

  slideOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
    centeredSlides: true,
  };

  constructor(
    public popoverController: PopoverController
  ) { }

  ngOnInit() {
  }

  async presentInformation(ev: any) {
    const popover = await this.popoverController.create({
      component: FpiCriteriaInformationComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

}
