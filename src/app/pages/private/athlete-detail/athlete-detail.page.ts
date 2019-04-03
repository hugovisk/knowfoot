import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonSlides } from '@ionic/angular';

import { AthleteService } from '../../../services/athlete/athlete.service';
import { AthleteProfile } from '../../../models/interfaces/athlete-profile';
import { Observable } from 'rxjs';

import { FootSide } from '../../../models/enums/foot.enum';
import { Sport, SportPraticeFrequency, SportPraticeTime } from '../../../models/enums/sport.enum';
import { formSelectsContent } from '../../shared/form-selects-content';
import { FootInjurie } from '../../../models/enums/foot.enum';

@Component({
  selector: 'app-athlete-detail',
  templateUrl: './athlete-detail.page.html',
  styleUrls: ['./athlete-detail.page.scss'],
})
export class AthleteDetailPage implements OnInit {

  @ViewChild('slides') slides: IonSlides;

  // public athlete: Observable<AthleteProfile>;
  athlete: AthleteProfile;
  praticeFrequency: string;
  content = formSelectsContent;
  praticeTime: String;
  footDominant: string;
  footInjuriesRight: string[] = [];
  footInjuriesLeft: string[] = [];
  injuriesQuantity: number;
  footSideInjuries: string;
  sport: string;

  private currentSegment = 'assess';

  constructor(
    private athleteService: AthleteService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.retrieveAthlete();
  }

  retrieveAthlete() {
    const athleteId = this.route.snapshot.paramMap.get('id');
    // this.athlete = this.athleteService.getAthlete(athleteId);
    this.athleteService.getAthlete(athleteId).subscribe((res: AthleteProfile) => {
      this.athlete = res;
      this.athlete.age = this.athleteService.athleteAge(res.birthDate);
      this.defineSports(res.sport);
      this.defineFootDominant(res.footDominant);
      this.definePraticeFrequency(res.sportPraticeFrequency);
      this.definePraticeTime(res.sportPraticeTime);
      this.defineFootInjuries(res.footInjuriesRight, FootSide.Right);
      this.defineFootInjuries(res.footInjuriesLeft, FootSide.Left);
      this.defineFootInjuriesQuantity(res.footInjuriesLeft, res.footInjuriesRight);
      this.defineFootSideInjuries(res.footInjuriesLeft, res.footInjuriesRight);
    });
  }

  defineFootDominant(side: FootSide) {
    this.footDominant = side === FootSide.Right ? 'Destro' : 'Canhoto';
  }

  definePraticeFrequency(frequency: string) {
    if (frequency === 'MoreThanThreePerWeek') {
      this.praticeFrequency = 'Muito ativo';
    } else if (frequency === 'TwoOrTreePerWeek') {
      this.praticeFrequency = 'Ativo';
    } else if (frequency === 'OnePerWeek') {
      this.praticeFrequency = 'Pouco ativo';
    }
  }

  definePraticeTime(time: string) {
    if (time === 'LessThanSixMonths') {
      this.praticeTime = 'iniciante';
    } else if (time === 'BetweenSixAndTwentyFourMonths') {
      this.praticeTime = 'intermediário';
    } else if (time === 'MoreThanTwoYears') {
      this.praticeTime = 'avançado';
    }
  }

  defineFootInjuries(injuries: string[], footSide: FootSide) {
    if (injuries) {
      for (const injury of injuries) {
        for (const lesao of this.content.footInjuries) {
          if (injury === lesao.value) {
            if (footSide === FootSide.Left) {
              this.footInjuriesLeft.push(lesao.viewValue);
            } else {
              this.footInjuriesRight.push(lesao.viewValue);
            }
          }
        }
      }
    }
  }

  defineSports(sports: string) {
    for (const esporte of this.content.sports) {
      if (sports === esporte.value) {
        this.sport = esporte.viewValue;
        break;
      }
    }
  }

  defineFootInjuriesQuantity(injuriesLeft: string[], injuriesRight: string[]) {
    const injuriesQuantityLeft = injuriesLeft ? injuriesLeft.length : 0;
    const injuriesQuantityRight = injuriesRight ? injuriesRight.length : 0;

    this.injuriesQuantity = injuriesQuantityLeft + injuriesQuantityRight;
  }

  defineFootSideInjuries(injuriesLeft: string[], injuriesRight: string[]) {
    if (injuriesLeft && injuriesRight) {
      return this.footSideInjuries = 'nos pés';
    } else if (injuriesLeft) {
      return this.footSideInjuries = 'no pé esquerdo';
    } else if (injuriesRight) {
      return this.footSideInjuries = 'no pé direito';
    }
  }

  segmentChanged(ev: any) {
    this.slides.slideTo(ev.detail.value === 'assess' ? 0 : 1);
  }

  async setSegment(activeIndex: Promise<number>) {
    this.currentSegment = await activeIndex === 0 ? 'assess' : 'profile';
  }
}
