import { FootSide, FootPosture } from '../enums/foot.enum';
import { Observation, ObservationView } from '../enums/fpi.enum';
import * as firebase from 'firebase/app';


export interface AssessFpi {
    athleteId?: string;
    assessId?: string;
    // assessment?: { [observation: string]: {score: number} };
    createdAt?: firebase.firestore.FieldValue | Date;
    footLeft?: {
        assessment?: { [observation: string]: {score: number} };
        posture?: string | FootPosture;
        imageUrl?: { rear: string, medial: string };
        index?: number;
    };
    footRight?: {
        assessment?: { [observation: string]: {score: number} };
        posture?: string | FootPosture;
        imageUrl?: { rear: string, medial: string };
        index?: number;
    };
    // footAssessed?: FootSide;
    // footPostureResult?: string | FootPosture;
    // footImage?: any[]; // TODO: definir tipo
    // indexResult?: number;
    updatedAt?: firebase.firestore.FieldValue | Date;
}
