import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/user/auth.service';
import { UserAccount } from '../../../interfaces/user-account';
import { LoadingController, AlertController } from '@ionic/angular';
import { formErrorMessages } from '../shared/form-error-messages/form-error-mesages';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
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
  signupForm = this.formBuilder.group({
    name: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(40),
      Validators.pattern('[a-zA-ZÀ-ÿ \']*')// permitido somente letras e espaco
    ]],
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
   * Getter para acessar os controls do campo do formulario de forma resumida,
   * ex.: input.name, ao invez de registerForm.controls.name
   *
   * https://angular.io/api/forms/AbstractControl
   */
  get input() {
    return this.signupForm.controls;
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
 * Transfere o conteudo do formulario para a variavel registerPayload
 * TODO: validar errors
 */
  async signupUser() {
    const user: UserAccount = this.signupForm.value;
    const loading = await this.loadingCtrl.create();
    await loading.present();

    try {
      await this.authService.signupUser(user.email, user.password, user.name);
      await loading.dismiss();
      this.router.navigateByUrl('private/dashboard'); // redirecionar para profile
    }
    // tslint:disable-next-line: one-line
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
