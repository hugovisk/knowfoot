import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoadingController, AlertController } from '@ionic/angular';

import { EducationLevel, Occupation } from '../../../models/enums/user.enum';

import * as moment from 'moment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  educationLevels = EducationLevel;
  occupations = Occupation;
  /**
   * Define no input de senha o valor do atributo type
   * e no botao de troca visibilidade o icone mostrado.
   * `true` caracteres não visíveis
   */
  hide = true;

  startDate = moment().subtract(39, 'years');
  minDate = moment().subtract(100, 'years');
  maxDate = moment().subtract(16, 'years');

  /** tipos de erros de validacao do formulario
   * TODO: mudar para models
   */
  formErrorTypes = {
    email: [
      { type: 'required' },
      { type: 'email' }
    ],
    password: [
      { type: 'required' },
      { type: 'minlength' }
    ]
  };

  registerForm = this.formBuilder.group({
    email: ['', [
      Validators.required,
      Validators.email
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(4)
    ]]
  });

  profileForm = this.formBuilder.group({
    name: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(40),
      Validators.pattern('[a-zA-ZÀ-ÿ \']*')// permitido somente letras e espaco
    ]],
    birthDate: ['', Validators.required],
    education: ['', Validators.required],
    occupation: ['', Validators.required]
  });

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    // private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  /**
   * Getter para acessar os controls do campo do formulario de forma resumida,
   * ex.: input.name, ao invez de registerForm.controls.name
   *
   * https://angular.io/api/forms/AbstractControl
   */
  get input() {
    return this.registerForm.controls;
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

}
