import { FootSide, FootInjurie } from '../enums/foot.enum';
import { Gender } from '../enums/gender.enum';
import { Sport, SportPraticeFrequency, SportPraticeTime } from '../enums/sport.enum';
import * as firebase from 'firebase/app';

export interface MedicalRecord {
    age?: number;
    birthDate: firebase.firestore.Timestamp | Date;
    createdAt?: firebase.firestore.FieldValue;
    contactEmail?: string;
    footDominant: FootSide;
    footInjuries: boolean;
    footInjuriesLeft?: FootInjurie[];
    footInjuriesRight?: FootInjurie[];
    gender: Gender;
    heightInCm: number;
    id?: string;
    isDeleted?: boolean;
    name: string;
    sport: Sport;
    sportPratice: boolean;
    sportPraticeFrequency?: SportPraticeFrequency;
    sportPraticeTime?: SportPraticeTime;
    updatedAt?: firebase.firestore.FieldValue;
    weightInKg: number;
}
