import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/user/auth/auth.service';
import { UserAccount } from '../../../interfaces/user-account';
import { LoadingController, AlertController } from '@ionic/angular';
import { formErrorMessages } from '../shared/form-error-messages/form-error-mesages';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  /**
   * Importa mensagens de erro
   */
  validationMessages = formErrorMessages;

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  /**
  *
  * https://angular.io/guide/reactive-forms#generating-form-controls-with-formbuilder
  * 
  * obs: validacao do ion-item do ion-input dispara no momento de foco
  * mesmo se o paramentro do input touched=false. Comportamento esperado 
  * e' disparar a validacao quando o input perde o foco a primeira vez e
  * o parametro touched=true.
  * TODO: Abrir bug fix https://github.com/ionic-team/ionic/issues/
  */
  resetPasswordForm = this.formBuilder.group({
    email: ['', [
      Validators.required,
      Validators.email
    ]]
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
    return this.resetPasswordForm.controls;
  }

  /**
   * Envia link de redefinicao de senha para email informado
   */
  async resetPassword() {
    const user: UserAccount = this.resetPasswordForm.value;
    const loading = await this.loadingCtrl.create();

    try {
      await loading.present();
      await this.authService.resetPassword(user.email);
      await loading.dismiss();

      const alert = await this.alertCtrl.create({
        message: 'Um link para redefinir sua senha foi enviado',
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
