import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// import { IonSlides } from '@ionic/angular';

import { AthleteService } from '../../../services/athlete/athlete.service';
import { AthleteProfile } from '../../../models/interfaces/athlete-profile';
import { AssessFpiService } from '../../../services/assess/assess-fpi.service';
import { AssessFpi } from '../../../models/interfaces/assess-fpi';

import { Observable } from 'rxjs';

import { FootSide } from '../../../models/enums/foot.enum';
// import { Sport, SportPraticeFrequency, SportPraticeTime } from '../../../models/enums/sport.enum';
import { formSelectsContent } from '../../shared/form-selects-content';
// import { FootInjurie } from '../../../models/enums/foot.enum';
import { fpiContents } from '../../shared/fpi-contents';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-athlete-detail',
  templateUrl: './athlete-detail.page.html',
  styleUrls: ['./athlete-detail.page.scss'],
})
export class AthleteDetailPage implements OnInit {

  // @ViewChild('slides') slides: IonSlides;

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

  postures = fpiContents.footPosture;

  assessList: Observable<AssessFpi>;

  // private currentSegment = 'assess';

  constructor(
    private athleteService: AthleteService,
    private assessService: AssessFpiService,
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
      this.sportsPtBr(res.sport);
      this.footDominantPtBr(res.footDominant);
      this.praticeFrequencyPtBr(res.sportPraticeFrequency);
      this.praticeTimePtBr(res.sportPraticeTime);
      this.footInjuriesPtBr(res.footInjuriesRight, FootSide.Right);
      this.footInjuriesPtBr(res.footInjuriesLeft, FootSide.Left);
      this.footInjuriesQuantityPtBr(res.footInjuriesLeft, res.footInjuriesRight);
      this.footSideInjuriesPtBr(res.footInjuriesLeft, res.footInjuriesRight);
    });
    this.assessList = this.assessService.getAssessOrderByNewest(athleteId);
    // this.assessList = this.assessService.getAssessList(athleteId);
  }
  // go horse pra traduzir retornos do firebase, desse jeito é horrivel para observables
  // pq faz varias requisições da funcao sem necessidade, talvez seja melhor um pipe para traduzir
  footDominantPtBr(side: FootSide) {
    this.footDominant = side === FootSide.Right ? 'Destro' : 'Canhoto';
  }

  praticeFrequencyPtBr(frequency: string) {
    if (frequency === 'MoreThanThreePerWeek') {
      this.praticeFrequency = 'Muito ativo';
    } else if (frequency === 'TwoOrTreePerWeek') {
      this.praticeFrequency = 'Ativo';
    } else if (frequency === 'OnePerWeek') {
      this.praticeFrequency = 'Pouco ativo';
    }
  }

  praticeTimePtBr(time: string) {
    if (time === 'LessThanSixMonths') {
      this.praticeTime = 'iniciante';
    } else if (time === 'BetweenSixAndTwentyFourMonths') {
      this.praticeTime = 'intermediário';
    } else if (time === 'MoreThanTwoYears') {
      this.praticeTime = 'avançado';
    }
  }

  footInjuriesPtBr(injuries: string[], footSide: FootSide) {
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

  sportsPtBr(sports: string) {
    for (const esporte of this.content.sports) {
      if (sports === esporte.value) {
        this.sport = esporte.viewValue;
        break;
      }
    }
  }

  footInjuriesQuantityPtBr(injuriesLeft: string[], injuriesRight: string[]) {
    const injuriesQuantityLeft = injuriesLeft ? injuriesLeft.length : 0;
    const injuriesQuantityRight = injuriesRight ? injuriesRight.length : 0;

    this.injuriesQuantity = injuriesQuantityLeft + injuriesQuantityRight;
  }

  footSideInjuriesPtBr(injuriesLeft: string[], injuriesRight: string[]) {
    if (injuriesLeft && injuriesRight) {
      return this.footSideInjuries = 'nos pés';
    } else if (injuriesLeft) {
      return this.footSideInjuries = 'no pé esquerdo';
    } else if (injuriesRight) {
      return this.footSideInjuries = 'no pé direito';
    }
  }

  postureResultPtBr(posture: string) {
    for (const postura of this.postures) {
      if (posture === postura.value) {
        // console.log(postura.viewValue); // melhorar como traduzir
        return postura.viewValue;
      }
    }
  }
 
  // segmentChanged(ev: any) {
  //   this.slides.slideTo(ev.detail.value === 'assess' ? 0 : 1);
  // }

  // async setSegment(activeIndex: Promise<number>) {
  //   this.currentSegment = await activeIndex === 0 ? 'assess' : 'profile';
  // }
}
