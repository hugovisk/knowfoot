import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';

import { AthleteService } from '../../../services/athlete/athlete.service';

import { AthleteProfile } from '../../../models/interfaces/athlete-profile';

import { formErrorMessages } from '../../shared/form-error-mesages';
import { formSelectsContent } from '../../shared/form-selects-content';

@Component({
  selector: 'app-athlete-new-modal',
  templateUrl: './athlete-new-modal.component.html',
  styleUrls: ['./athlete-new-modal.component.scss'],
})
export class AthleteNewModalComponent implements OnInit {
  /** Importa mensagens de erro */
  validationMessages = formErrorMessages;

  /** Importa conteúdos dos selcts */
  selectContent = formSelectsContent;

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    private athleteService: AthleteService,
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

  ngOnInit() { }

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
      const newId = await this.athleteService.createAthlete(athlete);
      await loading.dismiss();
      await this.modalController.dismiss({
        id: newId,
        name: athlete.name
      });
    } catch (error) {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        message: error,
        buttons: [{ text: 'Ok', role: 'cancel' }],
      });
      await alert.present();
    }
  }

  async closeModal() {
    await this.modalController.dismiss();
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
