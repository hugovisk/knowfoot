import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { AthleteService } from '../../../../services/athlete/athlete.service';

import { AthleteProfile } from '../../../../models/interfaces/athlete-profile';
import { FootSide } from '../../../../models/enums/foot.enum';
import { AssessMethod } from '../../../../models/enums/assess.enum';
import { ModalController } from '@ionic/angular';

import { AthleteNewModalComponent } from '../../athlete-new-modal/athlete-new-modal.component';

@Component({
  selector: 'app-start-modal',
  templateUrl: './start-modal.component.html',
  styleUrls: ['./start-modal.component.scss'],
})
export class StartModalComponent implements OnInit {
  athletes: Observable<AthleteProfile>;
  searchAthlete: string;

  startAssess: {
    athleteId?: string,
    athleteName?: string
    footSide?: FootSide,
    method: string,
  };

  @Input() assessMethod: AssessMethod;

  constructor(
    public modalController: ModalController,
    private athleteService: AthleteService
  ) { }

  ngOnInit() {
    this.athletes = this.athleteService.getAthletesAlphabeticalOrder();
    this.startAssess = {
      method: this.assessMethod
    };
  }

  setStartAssessAthleteId(id: string) {
    this.startAssess.athleteId = id;
  }

  setStartAssessAthleteName(name: string) {
    this.startAssess.athleteName = name;
  }

  setStartAssessFootSide(foot: FootSide) {
    this.startAssess.footSide = foot;
  }

  backToAthletes() {
    this.startAssess.athleteId = null;
    this.startAssess.footSide = null;
  }

  async closeModalAndStartAssessment() {
    await this.modalController.dismiss({
      currentAsseess: this.startAssess
    });
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AthleteNewModalComponent
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    // console.log(data);
    if (data !== undefined) {
      this.setStartAssessAthleteId(data.id);
      this.setStartAssessAthleteName(data.name);
    }
  }

}
