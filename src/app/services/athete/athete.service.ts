import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../user/auth/auth.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AtheteService {
  atlheteList: AngularFirestoreCollection<any>;
  userId: string;

  constructor(
    public afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
  ) {
    this.afAuth.authState.subscribe(user => {
      this.userId = user.uid;
      this.atlheteList = this.firestore.collection(`/userProfile/${user.uid}/atlheteList`);
      });
  }

  getAtlheteList(): AngularFirestoreCollection<any> {
    return this.atlheteList;
  }

  getAthlete(athleteId: string): AngularFirestoreDocument<any> { // TODO: criar interface de atleta
    return this.atlheteList.doc(athleteId);
  }

  async createAthlete(): Promise<any> {
    const creationDate = await firebase.firestore.FieldValue.serverTimestamp();
    // cria um atleta vazio e o firebase gera automaticamente um ID
    const newAthlete = await this.atlheteList.add({});

    return newAthlete.update({
      id: newAthlete.id
    });
  }
}
