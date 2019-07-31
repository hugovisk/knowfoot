import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatStepper } from '@angular/material/stepper';

import { LoadingController, AlertController } from '@ionic/angular';

import { EducationLevel, Occupation } from '../../../models/enums/user.enum';
import { formErrorTypes } from '../../../models/objects/form-error-type.object'

import * as moment from 'moment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss']
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;

  /** validação do formulario de dados do usuário */
  profileComplete = false;

  /** conteudo dos selects */
  educationLevels = EducationLevel;
  occupations = Occupation;

  /**
   * Define no input de senha o valor do atributo type
   * e no botao de troca visibilidade o icone mostrado.
   * `true` caracteres não visíveis
   */
  hide = true;

  /** configuração de data inicial, maxima e minima do datepicker  */
  startDate = moment().subtract(39, 'years');
  minDate = moment().subtract(100, 'years');
  maxDate = moment().subtract(16, 'years');

  /** tipos de erros de validacao do formulario */
  formErrors = formErrorTypes;

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    // private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      birthdate: ['', Validators.required],
      education: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(40),
        Validators.pattern('[a-zA-ZÀ-ÿ \']*')// permitido somente letras e espaco
      ]],
      occupation: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(4)
      ]]
    });
  }
  /**
   * Getter para acessar os controls do campo do formulario de forma resumida,
   * ex.: input.name, ao invez de registerForm.controls.name
   *
   * https://angular.io/api/forms/AbstractControl
   */
  get input() {
    return this.signupForm.controls;
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

  profileValidationCheck(stepper: MatStepper) {
    if (this.input.name.valid && this.input.birthdate.valid && this.input.education.valid && this.input.occupation.valid) {
      console.log('valid');
      this.profileComplete = true;
      setTimeout(() => {
        stepper.next();
      }, 10);
    } else {
      console.log('invalid');
      this.profileComplete = false;
      this.input.name.markAsTouched();
      this.input.birthdate.markAsTouched();
      this.input.education.markAsTouched();
      this.input.occupation.markAsTouched();
    }
  }


  /**
   * Transfere o conteudo do formulario para a variavel registerPayload
   */
  async signupUser() {
    // const user: UserProfile = this.signupForm.value;
    // const loading = await this.loadingCtrl.create();
    // await loading.present();

    // try {
    //   await this.authService.signupUser(user);
    //   await loading.dismiss();
    //   this.router.navigateByUrl('main');
    // } catch (error) {
    //   await loading.dismiss();
    //   const alert = await this.alertCtrl.create({
    //     message: error,
    //     buttons: [{ text: 'Ok', role: 'cancel' }],
    //   });
    //   await alert.present();
    // }
  }

  /** helper para manter a ordenação do pipe keyvalue */
  keepOrder = (a, b) => {
    return a;
  }

}
