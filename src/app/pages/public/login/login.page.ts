import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoadingController, AlertController } from '@ionic/angular';

// import { AuthService } from '../../../services/user/auth/auth.service';
import { UserProfileProps } from '../../../models/interfaces/user-profile';
import { formErrorTypes } from '../../../models/objects/form-error-type.object'

import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  /**
   * Define no input de senha o valor do atributo type
   * e no botao de troca visibilidade o icone mostrado.
   * `true` caracteres não visíveis
   */
  hide = true;

  /** tipos de erros de validacao do formulario */
  formErrors = formErrorTypes;

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    // private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    /** Definição do formulario e validações */
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
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
    return this.loginForm.controls;
  }
  /**
   * recebe o campo inválido e retorna o tipo do erro
   * @param field
   */
  getErrorMessage(field: string) {
    // console.log(field);
    for (const error of this.formErrors[field]) {
      // console.log(error.type);
      if (this.input[field].hasError(error.type)) {
        return error.type;
      }
    }
  }
  /**
   * Transfere o conteudo do formulario para a variavel registerPayload
   * TODO: validar errors
   */
  async loginUser() {
    if (this.loginForm.invalid) {
      console.log('invalido');
      // this.input.email.markAsTouched();
      this.input.password.markAsTouched();
    } else {
      console.log('valido');
    }

    // const user: UserProfile = this.loginForm.value;
    // const loading = await this.loadingCtrl.create({});
    // await loading.present();

    // try {
    //   await this.authService.loginUser(user.email, user.password);
    //   await loading.dismiss();
    //   this.router.navigateByUrl('main');'Um link para redefinir sua senha foi enviado'
    // }
    // catch (error) {
    //   await loading.dismiss();
    //   const alert = await this.alertCtrl.create({
    //     message: error,
    //     buttons: [{ text: 'Ok', role: 'cancel' }],
    //   });
    //   await alert.present();
    // }
  }

  /**
   * Envia link de redefinicao de senha para email informado
   */
  async resetPassword() {
    console.log('touched');
    if (this.input.email.valid) {
      const user: UserProfileProps = this.loginForm.value;
      const loading = await this.loadingCtrl.create({
        message: 'Hellooo' // TODO: ajustar msg
      });

      try {
        await loading.present();
        // await this.authService.resetPassword(user.email);
        await loading.dismiss();

        const alert = await this.alertCtrl.create({
          message: this.translate.instant('login.resetMgs'),
          buttons: [
            {
              text: 'Ok',
              role: 'cancel',
              handler: () => {
                this.router.navigateByUrl('/login');
              },
            },
          ],
        });
        await alert.present();
      } catch (error) {
        await loading.dismiss();
        const errorAlert = await this.alertCtrl.create({
          message: error,
          buttons: [{ text: 'Ok', role: 'cancel' }],
        });
        await errorAlert.present();
      }
    }
  }
}
