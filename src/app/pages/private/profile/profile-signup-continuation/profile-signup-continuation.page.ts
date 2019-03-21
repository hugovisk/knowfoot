import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { ProfileService } from '../../../../services/user/profile/profile.service';
import { UserProfile } from '../../../../models/interfaces/user-profile';
// import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { formSelectsContent } from '../../../shared/form-selects-content';

import { AuthService } from '../../../../services/user/auth/auth.service';


@Component({
  selector: 'app-profile-signup-continuation',
  templateUrl: './profile-signup-continuation.page.html',
  styleUrls: ['./profile-signup-continuation.page.scss'],
})
export class ProfileSignupContinuationPage implements OnInit {
  public userProfile: Observable<any>;
  public dataTest: any;
  selectContent = formSelectsContent;

  userTest: UserProfile;
  private timeoutID: any = 0;

  constructor(
    public auth: AuthService,
    private formBuilder: FormBuilder,
    private profileService: ProfileService
  ) {
    // this.userProfile = this.profileService.getUserProfileData();

    // this.userProfile.subscribe((res: UserProfile) => {
    //   this.dataTest = res;
    // });
  }

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
    birthDate: ['', Validators.required],
    education: ['', Validators.required],
    occupation: ['', Validators.required],
  });

  ngOnInit() {

    this.userProfile = this.profileService.getUserProfileData();

    this.userProfile.subscribe((res: UserProfile) => {
      this.dataTest = res;
    });


        // this.profileService.getUserProfile().snapshotChanges().subscribe(actions =>{
    //   this.dataTest = actions.payload.data();
    // });
    // console.log(this.dataTest.email);
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

  autoSave(key: string) {
    clearTimeout(this.timeoutID);
    console.log('mudança blur');
    if (this.input[key].valid && this.profileSignupForm.value[key] !== this.dataTest[key]) {
      console.log(this.profileSignupForm.value[key]);
      console.log('Salvo blur!');
    }
  }

  autoSaveDebounce(key: string) {
    // console.log(this.dataTest[key]);
    console.log('mudança change');

    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => {
      if (this.input[key].valid && this.profileSignupForm.value[key] !== this.dataTest[key]) {
        console.log(this.profileSignupForm.value[key]);
        console.log('Salvo change!');
      }
    }, 3000);
  }

  logOut() {
    this.auth.logoutUser();
  }


}


