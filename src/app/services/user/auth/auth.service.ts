import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

import { firebaseErrorMessages } from '../../shared/firebase-error-messages';
import { UserProfile } from '../../../models/interfaces/user-profile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public nfUser: firebase.User; // usuario do knowfoot

  /**
   * Importa as mensagens de erro
   */
  private errorMessages = firebaseErrorMessages;

  constructor(
    public afAuth: AngularFireAuth,
    public firestore: AngularFirestore,
    private router: Router
  ) { }

  /**
   * Verifica se usuario esta autenticado no firebase.
   * Se não autenticado, direciona para landing.
   *
   * @returns true para autenticado
   *
   * https://angular.io/guide/observables#subscribing
   * https://github.com/angular/angularfire2/blob/master/docs/auth/getting-started.md
   * https://angularfirebase.com/snippets/angularfire2-version-4-authentication-service/
   * https://firebase.google.com/docs/reference/js/firebase.auth.Auth
   * https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onAuthStateChanged
   */

  isAuth(): Promise<boolean> {
    return new Promise((resolve) => {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          console.log('User is logged in');
          resolve(true);
        } else {
          console.log('User is not logged in');
          this.router.navigate(['landing']);
          resolve(false);
        }
      });
    });
  }

  /**
   * Getter do usuario logado
   *
   * @returns objeto da conta do usuario
   *
   * https://firebase.google.com/docs/reference/js/firebase.auth.Auth#currentUser
   * https://firebase.google.com/docs/reference/js/firebase.User
   */
  getUser() {
    return this.afAuth.auth.currentUser;
  }

  /**
   * Faz a autenticacao do usuario no app
   *
   * @param email vinculado a conta
   * @param password senha definida pelo usuario
   *
   * https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signInWithEmailAndPassword
   *
   */
  async loginUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    try {
      return await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error);
      throw this.errorHandler(error.code);
    }
  }

  /**
   *
   * @param user objeto com as informacoes do usuario
   * /models/interfaces/user-profile'
   *
   * https://firebase.google.com/docs/reference/js/firebase.firestore.FieldValue
   * https://firebase.google.com/docs/reference/js/firebase.auth.Auth#createUserWithEmailAndPassword
   * https://firebase.google.com/docs/reference/js/firebase.auth#.UserCredential
   * https://firebase.google.com/docs/reference/js/firebase.User#updateProfile
   * https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#doc
   * https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#set
   *
   */
  async signupUser(user: UserProfile): Promise<any> {
    try {
      const creationDate = await firebase.firestore.FieldValue.serverTimestamp();
      const newUser = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
      await this.afAuth.auth.currentUser.updateProfile({ displayName: user.name });
      // cria a coleção userProfile, se nao houver, e armazena os dados do usuario
      this.firestore.doc(`/userProfile/${newUser.user.uid}`).set(user);
    } catch (error) {
      console.log(error);
      throw this.errorHandler(error.code);
    }
  }


  /**
   * Envia um email para redefinicao de senha no email informado
   * @param email
   *
   * https://firebase.google.com/docs/reference/js/firebase.auth.Auth#sendPasswordResetEmail
   *
   * TODO: fazer tratamento de erros
   * TODO: continuar o reset da senha dentro do app
   * TODO: configurar o conteudo do email de reset
   */
  async resetPassword(email: string): Promise<any> {
    try {
      return await this.afAuth.auth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log(error);
      throw this.errorHandler(error.code);
    }
  }

  /**
   * https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signOut
   * 
   * TODO: verificar dados offline
   */
  async logoutUser(): Promise<void> {
    await this.afAuth.auth.signOut();
  }

  /**
   * Por medida de segurança algumas operaçĩes necessitam que o token de
   * autenticação seja recente
   *
   * @param email email do usuario ativo
   * @param password senha de autenticacao do usuario ativo
   *
   * https://firebase.google.com/docs/reference/js/firebase.auth.EmailAuthProvider#.credential
   * https://firebase.google.com/docs/reference/js/firebase.User#reauthenticateAndRetrieveDataWithCredential
   */
  async reAuthUser(email: string, password: string): Promise<any> {
    try {
      const credential = await firebase.auth.EmailAuthProvider.credential(this.getUser().email, password);
      await this.getUser().reauthenticateAndRetrieveDataWithCredential(credential);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verifca mensagens de erro do firebase
   *
   * @param errorCode codigo de erro do firebase.auth
   * @returns mensagem em portugues para ser repassada pelo AuthService.
   *
   * https://firebase.google.com/docs/reference/js/firebase.auth.Error
   */
  errorHandler(errorCode: string): string | void {
    for (const error of this.errorMessages.auth) {
      if (errorCode === error.code) {
        return error.message;
      }
    }
  }
}
