import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AthleteService } from '../../../services/athlete/athlete.service';
import { AthleteProfile } from '../../../models/interfaces/athlete-profile';
// import { FootSide, FootInjurie } from '../../../models/enums/foot.enum';
// import { Gender } from '../../../models/enums/gender.enum';
// import { Sport, SportPraticeFrequency, SportPraticeTime } from '../../../models/enums/sport.enum';

import { LoadingController, AlertController } from '@ionic/angular';
import { formErrorMessages } from '../../shared/form-error-mesages';
import { formSelectsContent } from '../../shared/form-selects-content';

@Component({
  selector: 'app-athlete-new',
  templateUrl: './athlete-new.page.html',
  styleUrls: ['./athlete-new.page.scss'],
})
export class AthleteNewPage implements OnInit {


  data: Date;

  /** Importa mensagens de erro */
  validationMessages = formErrorMessages;

  /** Importa conteúdos dos selcts */
  selectContent = formSelectsContent;

  // public athleteTest: AthleteProfile = {
  //   birthDate: '2019-03-20',
  //   contactEmail: 'teste5@teste.com',
  //   contactPhone: '13 995843548',
  //   dominantFoot: FootSide.Right,
  //   furtherInformation: 'Nao há muitas informações de teste',
  //   gender: Gender.Male,
  //   heightInCm: 180,
  //   leftFootInjuries: [FootInjurie.AnkleSprain, FootInjurie.PlantarFasciitis],
  //   name: 'Bruce Banner',
  //   rightFootInjuries: [FootInjurie.None],
  //   sport: Sport.Swimming,
  //   sportPraticeFrequency: SportPraticeFrequency.MoreThanThreePerWeek,
  //   sportPraticeTime: SportPraticeTime.MoreThanTwoYears,
  //   weightInKg: 80
  // };

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private athleteService: AthleteService,
    private router: Router
  ) { }

  /**
   * https://angular.io/guide/reactive-forms#generating-form-controls-with-formbuilder
   */
  athleteForm = this.formBuilder.group({
    name: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(40),
      Validators.pattern('[a-zA-ZÀ-ÿ \']*')// permitido somente letras e espaco
    ]],
    contact: [false],
    contactEmail: [null, [ 
      Validators.email
    ]],
    contactPhone: [null, [
      Validators.maxLength(11),
      // Validators.pattern('[a-zA-ZÀ-ÿ \']*')// permitido somente letras e espaco - TODO: permitir somente numeros
    ]],
    gender: ['', Validators.required],
    birthDate: ['', Validators.required],
    footDominant: ['', Validators.required],
    footInjuries: [false],
    footInjuriesLeft: [null], //TODO: requerido se tiver lesao
    footInjuriesRight: [null], //TODO: requerido se tiver lesao
    furtherInformation: [null],
    heightInCm: ['', Validators.required], //TODO: somente numeros
    sport: [null],
    sportPratice: [false],
    sportPraticeFrequency: [null], //TODO: requerido se existir esporte
    sportPraticeTime: [null],
    weightInKg: ['', Validators.required] //TODO: somente numeros
  });

  ngOnInit() {
  }
  /**
   * Getter para acessar os controls do campo do formulario de forma resumida,
   * ex.: input.name, ao invez de registerForm.controls.name
   *
   * https://angular.io/api/forms/AbstractControl
   */
  get input() {
    return this.athleteForm.controls;
  }

  /**
 * Transfere o conteudo do formulario para a variavel athlete
 * e chama servico para criar novo atleta
 */
  async createAthlete() {
    const athlete: AthleteProfile = this.athleteForm.value;
    athlete.birthDate = this.formattedBirthDate(this.athleteForm.value.birthDate);
    const loading = await this.loadingCtrl.create();
    await loading.present();

    try {
      await this.athleteService.createAthlete(athlete);
      await loading.dismiss();
      this.router.navigateByUrl('main/athletes');
    } catch (error) {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        message: error,
        buttons: [{ text: 'Ok', role: 'cancel' }],
      });
      await alert.present();
    }
  }


  // HELPERS

  /**
   * Transforma o formato de data e hora, recebido do datePicker,
   * no padrao ISO 8601 do tipo string para tipo Data.
   * Zera os valores tempo, pois é data de aniversario.
   * OBS:. O Tipo Data armazena como timestamp no firestore
   *
   * @param date data em string
   */
  formattedBirthDate(date: string): Date {
    return new Date(date.substr(0, 10).concat('T00:00:00.000-03:00'));
  }
}
