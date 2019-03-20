import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

import { AthleteProfile } from '../../models/interfaces/athlete-profile';
import { FootSide, FootInjurie } from '../../models/enums/foot.enum';
import { Gender } from '../../models/enums/gender.enum';
import { SportPraticeFrequency, Sport, SportPraticeTime } from '../../models/enums/sport.enum';

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

  getAthlete(athleteId: string): AngularFirestoreDocument<any> { 
    return this.atlheteList.doc(athleteId);
  }

  async createAthlete(athlete: AthleteProfile): Promise<any> {
    const creationDate = await firebase.firestore.FieldValue.serverTimestamp();
    // cria um atleta vazio e o firebase gera automaticamente um ID
    const newAthleteRef = await this.atlheteList.add({});

    return newAthleteRef.update({
      birthDate: athlete.birthDate,
      creationDate,
      contactEmail: athlete.contactEmail,
      contactPhone: athlete.contactPhone,
      dominantFoot: athlete.dominantFoot,
      furtherInformation: athlete.furtherInformation,
      gender: athlete.gender,
      height: athlete.height,
      id: newAthleteRef.id,
      isDeleted: false,
      leftFootInjuries: athlete.leftFootInjuries,
      name: athlete.name,
      rightFootInjuries: athlete.rightFootInjuries,
      sport: athlete.sport,
      sportPraticeFrequency: athlete.sportPraticeFrequency,
      sportPraticeTime: athlete.sportPraticeTime,
      weight: athlete.weight
    });
  }

  removeAthlete(athleteId: string): Promise<any> {
    return this.atlheteList.doc(athleteId).update({ isDeleted: true });
  }

  updateBirthDate(athleteId: string, birthDate: Date): Promise<any> {
    return this.atlheteList.doc(athleteId).update({ birthDate });
  }

  updateContactEmail(athleteId: string, contactEmail: string): Promise<any> {
    return this.atlheteList.doc(athleteId).update({ contactEmail });
  }

  updateContactPhone(athleteId: string, contactPhone: string): Promise<any> {
    return this.atlheteList.doc(athleteId).update({ contactPhone });
  }

  updateDominantFoot(athleteId: string, dominantFoot: FootSide): Promise<any> {
    return this.atlheteList.doc(athleteId).update({ dominantFoot });
  }

  updateFurtherInformation(athleteId: string, furtherInformation: string): Promise<any> {
    return this.atlheteList.doc(athleteId).update({ furtherInformation });
  }

  updateGender(athleteId: string, gender: Gender): Promise<any> {
    return this.atlheteList.doc(athleteId).update({ gender });
  }

  updateHeight(athleteId: string, height: number): Promise<any> {
    return this.atlheteList.doc(athleteId).update({ height });
  }

  updateLeftFootInjuries(athleteId: string, leftFootInjuries: FootInjurie[]): Promise<any> {
    return this.atlheteList.doc(athleteId).update({ leftFootInjuries });
  }

  updateName(athleteId: string, name: string): Promise<any> {
    return this.atlheteList.doc(athleteId).update({ name });
  }

  updateRightFootInjuries(athleteId: string, rightFootInjuries: FootInjurie[]): Promise<any> {
    return this.atlheteList.doc(athleteId).update({ rightFootInjuries });
  }

  updateSport(athleteId: string, sport: Sport): Promise<any> {
    return this.atlheteList.doc(athleteId).update({ sport });
  }

  updateSportPraticeFrequency(athleteId: string, sportPraticeFrequency: SportPraticeFrequency): Promise<any> {
    return this.atlheteList.doc(athleteId).update({ sportPraticeFrequency });
  }

  updateSportPraticeTime(athleteId: string, sportPraticeTime: SportPraticeTime): Promise<any> {
    return this.atlheteList.doc(athleteId).update({ sportPraticeTime });
  }

  updateWeight(athleteId: string, weight: number): Promise<any> {
    return this.atlheteList.doc(athleteId).update({ weight });
  }
}
