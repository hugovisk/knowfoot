import { Injectable } from '@angular/core';

// import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { AuthService } from '../auth/auth.service';
import { UserProfile } from '../../../interfaces/user-profile';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public userProfile: AngularFirestoreDocument;
  public currentUser: firebase.User;

  constructor(
    public authService: AuthService,
    private firestore: AngularFirestore,
  ) {
    this.currentUser = this.authService.getUser();
    // this.userProfile = this.firestore.doc(`/userProfile/${this.currentUser.uid}`);
    this.userProfile = this.firestore.collection('userProfile').doc(this.currentUser.uid);
  }

  /**
   * Pega o caminho do documento do userProfile
   *
   * @returns caminho do userProfile do usuario corrente
   */
  getUserProfile(){
    return this.userProfile;
  }

  getUserProfileData(): Observable<any> {
    return this.userProfile.valueChanges();
  }

  /**
   *
   * @param name nome do usuario que atualizará o firestore
   */
  updateName(name: string): Promise<any> {
    return this.userProfile.update({ name });
  }

  /**
   *
   * @param birthDate data de aniverario do usuario que atualizará o firestore
   */
  updateBirthDate(birthDate: string): Promise<any> {
    return this.userProfile.update({ birthDate });
  }

  async updateEmail(newEmail: string, password: string): Promise<any> {
    try {
      await this.authService.reAuthUser(this.currentUser.email, password);
      await this.currentUser.updateEmail(newEmail);
      await this.userProfile.update({ email: newEmail });
    }
    catch (error) {
      throw error;
    }
  }

  async updatePassword(newPassword: string, oldPassword: string): Promise<any> {
    try {
      await this.authService.reAuthUser(this.currentUser.email, oldPassword);
      await this.currentUser.updatePassword(newPassword);
      await this.userProfile.update({ password: newPassword });
    }
    catch (error) {
      throw error;
    }
  }
}


