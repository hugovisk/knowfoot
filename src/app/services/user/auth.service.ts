import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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
  // isAuth(): Promise<boolean> {
  //   return new Promise((resolve) => {
  //     this.afAuth.authState.subscribe(auth => {
  //       resolve(auth ? true : false);
  //     });
  //   });
  // }

  async isAuth(): Promise<boolean> {
    let auth: firebase.User;
    await this.afAuth.authState.subscribe(res => auth = res);
    if (auth) {
      return true;
    } else {
      this.router.navigate(['landing']);
      return false;
    }
  }


  /**
   * Redirecionamento de autenticação,
   * se nao autenticado redireciona para 'landing'
   *
   * https://angular.io/api/router/Router#navigate
   *
   * TODO: funcao chamada no app.component em initializeApp()... precisa?
  */
  // async authRouting(): Promise<void> {
  //   if (await this.isAuth()) {
  //     this.router.navigate(['private', 'dashboard']);
  //   } else {
  //     this.router.navigate(['landing']);
  //   }
  // }

  /**
   * Getter do usuario logado
   *
   * @returns objeto da conta do usuario
   *
   * https://firebase.google.com/docs/reference/js/firebase.auth.Auth#currentUser
   * https://firebase.google.com/docs/reference/js/firebase.User
   */
  getUser(): firebase.User {
    return this.afAuth.auth.currentUser;
  }

  /**
   * Faz a autenticacao do usuario no app
   *
   * @param email
   * @param password
   *
   * https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signInWithEmailAndPassword
   *
   * TODO: fazer tratamento de erros
   */
  async loginUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    try {
      return await this.afAuth.auth.signInWithEmailAndPassword(email, password);
     // return credential; // testar o return direto
    }
    catch (error) {
      // TODO: tratar o erro
      // for (let error in errorCodes) {
      //   if(error === error.code)
      //   return error.message;
      // }
      if (error.code === 'auth/user-not-found') {
        error.message = 'Usuario NAO encontrado';
      }
      throw error;
    }
  }

  /**
   *
   * @param email
   * @param password
   *
   * https://firebase.google.com/docs/reference/js/firebase.firestore.FieldValue
   * https://firebase.google.com/docs/reference/js/firebase.auth.Auth#createUserWithEmailAndPassword
   * https://firebase.google.com/docs/reference/js/firebase.auth#.UserCredential
   * https://firebase.google.com/docs/reference/js/firebase.User#updateProfile
   * https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#doc
   * https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#set
   *
   *  TODO: tratamento de erros
   */
  // signupUser(email: string, password: string): Promise<any> {
  //   // cria o usuario
  //   return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
  //     // autentica o novo usuario
  //     .then((newUser: firebase.auth.UserCredential) => {
  //       // cria a coleção userProfile, se nao houver, e armazena o email no id do usuario
  //       this.firestore.doc(`/userProfile/${newUser.user.uid}`).set({ email });
  //     });
  // }

  async signupUser(email: string, password: string, name: string): Promise<any> {
    try {
      const creationDate = await firebase.firestore.FieldValue.serverTimestamp();
      const newUser = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      await this.afAuth.auth.currentUser.updateProfile({ displayName: name });
      // cria a coleção userProfile, se nao houver, e armazena o email no id do usuario
      this.firestore.doc(`/userProfile/${newUser.user.uid}`).set({
        email,
        name,
        creationDate
      });
    }
    catch (error) {
      console.log(error);
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
  errorMessage(errorCode: string): string | void {
    if (errorCode === 'auth/user-not-found') {
      return 'Usuario NAO encontrado';
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
    }
    catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signOut
   */
  logoutUser(): Promise<void> {
    return this.afAuth.auth.signOut();
  }


}
