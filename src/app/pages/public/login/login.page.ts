import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// import { AuthService } from '../../../services/user/auth/auth.service';
import { UserProfile } from '../../../models/interfaces/user-profile';
import { LoadingController, AlertController } from '@ionic/angular';
// import { formErrorMessages } from '../../shared/form-error-mesages';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  hide = true;

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    // private authService: AuthService,
    private router: Router, 
    private translate: TranslateService
  ) { }

  ngOnInit() {
  }

  loginForm = this.formBuilder.group({
    email: ['', [
      Validators.required,
      Validators.email
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(4)
    ]]
  });

  /**
   * Getter para acessar os controls do campo do formulario de forma resumida,
   * ex.: input.name, ao invez de registerForm.controls.name
   * 
   * https://angular.io/api/forms/AbstractControl 
   */
  get input() {
    return this.loginForm.controls;
  }

  formErrorMessages = {
    'name': [
      { type: 'required', message: 'Qual o seu nome?' },
      { type: 'minlength', message: 'Necessário mínimo de 3 caracteres' },
      { type: 'maxlength', message: 'Não exceda 40 caracteres' },
      { type: 'pattern', message: 'Use somente letras' }
    ],
    'email': [
      { type: 'required', message: 'Insira um email inválido' },
      { type: 'email', message: 'Insira um email com formato inválido' }
    ],
    'password': [
      { type: 'required', message: 'Defina sua senha de acesso' },
      { type: 'minlength', message: 'Necessário mínimo de 4 caracteres' }
    ]
  };

  getErrorMessage(field) {
    console.log(field)
    for (const error of this.formErrorMessages[field]) {
      console.log(error.type);
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
    const user: UserProfile = this.loginForm.value;
    const loading = await this.loadingCtrl.create();
    await loading.present();

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
    if (this.input.email.valid) {
      const user: UserProfile = this.loginForm.value;
      const loading = await this.loadingCtrl.create();

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
      }
      catch (error) {
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
