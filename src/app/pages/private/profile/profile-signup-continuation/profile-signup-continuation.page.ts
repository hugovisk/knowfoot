import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from '../../../../services/user/profile/profile.service';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { debounceTime } from 'rxjs/operators'; 
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-signup-continuation',
  templateUrl: './profile-signup-continuation.page.html',
  styleUrls: ['./profile-signup-continuation.page.scss'],
})
export class ProfileSignupContinuationPage implements OnInit {
  public userProfile: any;

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService
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
  profileSignupForm = this.formBuilder.group({
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
  });

  ngOnInit() {
    this.userProfile = this.profileService.getUserProfileData();

    // this.profileService.getUserProfile().snapshotChanges().subscribe(actions =>{
    //   this.userProfile = actions.payload.data();
    // });
    // console.log(this.userProfile.name);
  }

  /**
 * Getter para acessar os controls do campo do formulario de forma resumida,
 * ex.: input.name, ao invez de registerForm.controls.name
 *
 * https://angular.io/api/forms/AbstractControl
 */
  get input() {
    return this.profileSignupForm.controls;
  }

  private timeoutID: any = 0;
  autoSave() {
    console.log('mudança');
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => {
        console.log('Salvo!');
      }, 2000);
  }

}
