import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

import { AthleteProfile } from '../../models/interfaces/athlete-profile';

@Injectable({
  providedIn: 'root'
})
export class AthleteService {
  // athletes: Observable<AthleteProfile[]>;
  /** ID do usuário */
  userId: string;

  /** Caminho para a coleção de atletas no firestore */
  private athletesCollection: AngularFirestoreCollection<AthleteProfile>;

  /** Caminho para a coleção de atletas no firestore */
  private athletesAlphabeticalCollection: AngularFirestoreCollection<AthleteProfile>;


  constructor(
    public afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
  ) {
    /**
     * Pegando `user.uid`.
     * Definindo caminho da coleção de atletas no firestore.
     * Fazendo uma query que retorne atletas ativos e ordenados
     * por ordem alfabetica.
     *
     * OBS. usando requisição assincrona do subscribe para evitar
     * que o `user` retorne null quando inicializar o serviço e
     * também evitar que os dados recebidos fiquem em cache
     * caso o usuario faça logout e outro usuario faça login no mesmo
     * dispositivo.
     *
     * https://firebase.google.com/docs/firestore/query-data/indexing
     */
    this.afAuth.authState.subscribe(user => {
      this.userId = user.uid;
      this.athletesCollection = this.firestore.collection<AthleteProfile>(`/userProfile/${user.uid}/athletes`);
      this.athletesAlphabeticalCollection =
        this.firestore.collection<AthleteProfile>(`/userProfile/${user.uid}/athletes`, ref =>
        // necessario criar index no firestore para esta query
        ref.where('isDeleted', '==' , false).orderBy('name', 'asc'));
    });
  }

  getAthletesCollection(): AngularFirestoreCollection<AthleteProfile> {
    return this.athletesCollection;
  }

  getAthletesAlphabeticalOrder(): Observable<any> {
    return this.athletesAlphabeticalCollection.valueChanges();
  }

  getAthletes(): Observable<any> {
    return this.getAthletesCollection().valueChanges();
  }

  getAthleteDocument(athleteId: string): AngularFirestoreDocument<any> {
    return this.athletesCollection.doc(athleteId);
  }

  getAthlete(athleteId: string): Observable<any> {
    return this.athletesCollection.doc(athleteId).valueChanges();
  }

  /**
   * Calcula a idade atual baseado na data de nascimento
   *
   * @param birthDate data de aniverssario
   *
   * getTime() retorna o numero de milisegundos entre 0:00 de janeiro de 1970 ate a data
   * especificada.
   */
  athleteAge(birthDate: any): number {
    const now = firebase.firestore.Timestamp.now().toDate();
    const timeDifference = now.getTime() - birthDate.toDate().getTime();
    return new Date(timeDifference).getUTCFullYear() - 1970;
  }

  /**
   * 
   * @param athlete objeto com as informações de cadastro do atleta
   */
  async createAthlete(athlete: AthleteProfile): Promise<any> {
    athlete.id = await this.firestore.createId();
    athlete.createdAt = await firebase.firestore.FieldValue.serverTimestamp();
    athlete.updatedAt = athlete.createdAt;
    athlete.isDeleted = false;
    try {
      await this.athletesCollection.doc(athlete.id).set(athlete);
      return athlete.id;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * 
   * @param athleteId chave do atleta que será marcado como deletado
   * e não sera listado na query
   */
  async removeAthlete(athleteId: string): Promise<any> {
    try {
      return await this.athletesCollection.doc(athleteId).update({ isDeleted: true });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Função genérica para atualizar qualquer campo do atleta ou criar um novo campo
   * 
   * @param athleteId chave do atleta que terá o campo atualizado
   * @param key nome do campo que será atuaizado ou criado
   * @param value novo valor que será inserido
   */
  async updateAthleteField(athleteId: string, key: string, value: any): Promise<any> {
    try {
      const updatedAt = await firebase.firestore.FieldValue.serverTimestamp();
      return await this.athletesCollection.doc(athleteId).update({ [key]: value, updatedAt });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
