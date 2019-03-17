import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/user/auth/auth.service';
import { UserAccount } from '../../../interfaces/user-account';
import { LoadingController, AlertController } from '@ionic/angular';
import { formErrorMessages } from '../../shared/form-error-mesages';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  /**
  * Define no input de senha o valor do atributo type
  * e no botao de troca visibilidade o icone mostrado.
  * `true` caracteres não visíveis
  */
 hide = true;
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

  ngOnInit() {
  }

  /** 
   * Troca a visibilidade dos caracteres no campo de
   * senha e o icone no botao de troca de visibilidade,
   * mantendo o foco no input e o teclado visível 
   * 
   *  @param input atributo tag de elemento do input alvo
   *  @param ev
   * 
   *  https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
   *  https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
   */
  private onHideShow = (input: any, ev: Event) => {
    if (ev) {
      // evita que o acionamento do botão feche o teclado
      ev.preventDefault();
      ev.stopPropagation();
    }
    this.hide = !this.hide;
    input.setFocus();
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
 * Transfere o conteudo do formulario para a variavel registerPayload
 * TODO: validar errors
 */
  async loginUser() {
    const user: UserAccount = this.loginForm.value;
    const loading = await this.loadingCtrl.create();
    await loading.present();

    try {
      await this.authService.loginUser(user.email, user.password);
      await loading.dismiss();
      this.router.navigateByUrl('private/dashboard');
    }
    catch (error) {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        message: error,
        buttons: [{ text: 'Ok', role: 'cancel' }],
      });
      await alert.present();
    }
  }

}
