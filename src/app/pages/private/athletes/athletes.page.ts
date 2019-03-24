import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AthleteService } from '../../../services/athlete/athlete.service';
import { AthleteProfile } from '../../../models/interfaces/athlete-profile';

@Component({
  selector: 'app-athletes',
  templateUrl: './athletes.page.html',
  styleUrls: ['./athletes.page.scss'],
})
export class AthletesPage implements OnInit {

  athletes: Observable<AthleteProfile>;

  constructor(
    private athleteService: AthleteService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.athletes = this.athleteService.getAthletes();
    this.athletes = this.athleteService.getAthletesAlphabeticalOrder();
  }

}
