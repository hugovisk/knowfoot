import { Component, OnInit } from '@angular/core';

import { AthleteService } from '../../../services/athete/athlete.service';
import { AthleteProfile } from '../../../models/interfaces/athlete-profile';
import { FootSide, FootInjurie } from '../../../models/enums/foot.enum';
import { Gender } from '../../../models/enums/gender.enum';
import { Sport, SportPraticeFrequency, SportPraticeTime } from '../../../models/enums/sport.enum';

@Component({
  selector: 'app-athlete-new',
  templateUrl: './athlete-new.page.html',
  styleUrls: ['./athlete-new.page.scss'],
})
export class AthleteNewPage implements OnInit {

  public athleteTest: AthleteProfile = {
    birthDate: '2019-03-20',
    contactEmail: 'teste5@teste.com',
    contactPhone: '13 995843548',
    dominantFoot: FootSide.Right,
    furtherInformation: 'Nao há muitas informações de teste',
    gender: Gender.Male,
    heightInCm: 180,
    leftFootInjuries: [FootInjurie.AnkleSprain, FootInjurie.PlantarFasciitis],
    name: 'Bruce Banner',
    rightFootInjuries: [FootInjurie.None],
    sport: Sport.Swimming,
    sportPraticeFrequency: SportPraticeFrequency.MoreThanThreePerWeek,
    sportPraticeTime: SportPraticeTime.MoreThanTwoYears,
    weightInKg: 80
  };


  constructor(private athleteService: AthleteService) {
  }

  ngOnInit() {
    console.log(this.athleteTest);
  }

  onClick() {
    console.log('salvando...');
    return this.athleteService.createAthlete(this.athleteTest);
  }

  update(id: string, key: string, value: string) {
    console.log('update clicado');
    return this.athleteService.updateAthleteField('teste02', 'birthDate', '1983-03-05');
  }
}
