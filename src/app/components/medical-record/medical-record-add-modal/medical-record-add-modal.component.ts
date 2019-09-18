import { Component, OnInit, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { MatStepper } from '@angular/material';
import { trigger, style, animate, transition } from '@angular/animations';

import { FootSide, FootInjurie } from '../../../models/enums/foot.enum';
import { Gender } from '../../../models/enums/gender.enum';
import { Sport, SportPraticeFrequency, SportPraticeTime } from '../../../models/enums/sport.enum';
import { formErrorTypes } from '../../../models/objects/form-error-type.object';

import * as moment from 'moment';


@Component({
  selector: 'app-medical-record-add-modal',
  templateUrl: './medical-record-add-modal.component.html',
  styleUrls: ['./medical-record-add-modal.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('0.2s ease-out',
              style({ height: 170, opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: 170, opacity: 1 }),
            animate('0.1s ease-in',
              style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class MedicalRecordAddModalComponent implements OnInit {
  medicalRecordForm: FormGroup;

  /** controla opções dos campos de lesoes no pé */
  footInjuriesOptionsDisabled = {
    left: false,
    right: false
  };


  /** conteudo dos selects */
  footSides = FootSide;
  footInjuries = FootInjurie;
  genders = Gender;
  sports = Sport;
  sportPraticeFrequencies = SportPraticeFrequency;
  sportPraticeTimes = SportPraticeTime;

  /** configuração de data inicial, maxima e minima do datepicker  */
  startDate = moment().subtract(20, 'years');
  minDate = moment().subtract(100, 'years');
  maxDate = moment().subtract(1, 'years');

  /** tipos de erros de validacao do formulario */
  formErrors = formErrorTypes;

  /** validação do formulario de dados do paciente */
  profileComplete = false;

  constructor(
    public modalController: ModalController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    /**
     * https://angular.io/guide/reactive-forms#generating-form-controls-with-formbuilder
     */
    this.medicalRecordForm = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(40),
        Validators.pattern('[a-zA-ZÀ-ÿ \']*')// permitido somente letras e espaco
      ]],
      // contact: [false],
      // contactEmail: [null, [
      //   Validators.email
      // ]],
      // contactPhone: [null, [
      //   Validators.maxLength(11),
      //   // Validators.pattern('[a-zA-ZÀ-ÿ \']*')// permitido somente letras e espaco - TODO: permitir somente numeros
      // ]],
      gender: ['', Validators.required],
      birthdate: ['', Validators.required],
      footDominant: ['', Validators.required],
      footInjuries: [false],
      footInjuriesLeft: [null],
      footInjuriesRight: [null],
      // furtherInformation: [null],
      heightInCm: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(250),
      ]],
      sport: [null],
      sportPratice: [false],
      sportPraticeFrequency: [null], // requerido se existir esporte GOTO: optionalSportFormValidator()
      sportPraticeTime: [null],
      weightInKg: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(250),
      ]],
    });

    this.optionalSportFormValidator();
    this.optionalInjurieFormValidator();
  }

  /**
   * Getter para acessar os controls do campo do formulario de forma resumida,
   * ex.: input.name, ao invez de registerForm.controls.name
   *
   * https://angular.io/api/forms/AbstractControl
   */
  get input() {
    return this.medicalRecordForm.controls;
  }

  /**
   * recebe o campo inválido e retorna o tipo do erro
   * @param field
   */
  getErrorMessage(field: string) {
    // console.log(this.input.field.getError());
    for (const error of this.formErrors[field]) {
      if (this.input[field].hasError(error.type)) {
        // console.log(error.type);
        return error.type;
      }
    }
  }

  /**
   * Faz verificação dos campos caso o botão proximo seja acionado
   * e impede ou valida proseguir para proxima etapa
   * @param stepper 
   */
  profileValidationCheck(stepper: MatStepper) {
    if (
      this.input.name.valid &&
      this.input.birthdate.valid &&
      this.input.gender.valid &&
      this.input.weightInKg.valid &&
      this.input.heightInCm.valid &&
      this.input.footDominant.valid
    ) {
      this.profileComplete = true;
      setTimeout(() => {
        stepper.next();
      }, 10);
    } else {
      this.profileComplete = false;
      this.input.name.markAsTouched();
      this.input.birthdate.markAsTouched();
      this.input.gender.markAsTouched();
      this.input.weightInKg.markAsTouched();
      this.input.heightInCm.markAsTouched();
      this.input.footDominant.markAsTouched();
    }
  }

  /**
   * reset dos campos de lesões caso a o campo 'lesoes no pe'
   * seja desmarcado 
   */
  optionalInjurieFormValidator() {
    const fields = ['footInjuriesLeft', 'footInjuriesRight'];
    this.input.footInjuries.valueChanges.subscribe(
      (state: string) => {
        fields.forEach(field => {
          if (!state) {
            this.input[field].reset();
          }
        });
      }
    );
  }

  /**
   * Implementa as ações na opção 'nenhuma': bloqueio e desbloqueio
   * de escolha de outras opções, reset do select ao valor inicial
   * 
   * @param field 
   */
  optionalInjurieFormNone(field: string) {
    let disabled: boolean;

    if (field === 'footInjuriesLeft') {
       disabled = this.footInjuriesOptionsDisabled.left;
    } else {
       disabled = this.footInjuriesOptionsDisabled.right;
    }

    if (!disabled) {
      this.input[field].reset();
      this.input[field].setValue(['None']);
    } else {
      this.input[field].reset();
    }

    if (field === 'footInjuriesLeft') {
      this.footInjuriesOptionsDisabled.left = !disabled;
    } else {
      this.footInjuriesOptionsDisabled.right = !disabled;
    }
    console.log(this.input[field].value);
  }

  /**
   *  Insere validação de campos requeridos caso o campo pratica esporte
   * seja marcado e da reset nos campos caso seja desmarcado
   */
  optionalSportFormValidator() {
    const fields = ['sport', 'sportPraticeFrequency', 'sportPraticeTime'];
    this.input.sportPratice.valueChanges.subscribe(
      (state: string) => {
        fields.forEach(field => {
          if (state) {
            this.input[field].setValidators([Validators.required]);
          } else {
            this.input[field].clearValidators();
            this.input[field].reset();
          }
          this.input[field].updateValueAndValidity();
        });
      }
    );
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  /** helper para manter a ordenação do pipe keyvalue */
  keepOrder = (a, b) => {
    return a;
  }
}
