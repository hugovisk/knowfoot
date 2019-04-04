import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { AthleteService } from '../../../services/athlete/athlete.service';
import { AthleteProfile } from '../../../models/interfaces/athlete-profile';

@Component({
  selector: 'app-athlete-modal',
  templateUrl: './athlete-modal.page.html',
  styleUrls: ['./athlete-modal.page.scss'],
})
export class AthleteModalPage implements OnInit {
  athletes: Observable<AthleteProfile>;
  method = null;
  searchAthlete: string;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private athleteService: AthleteService
    ) { }

  ngOnInit() {
    this.method = this.navParams.get('methodType');
    this.athletes = this.athleteService.getAthletesAlphabeticalOrder();
  }

  athleteQuery($event) {
    const query = $event.target.value;
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
