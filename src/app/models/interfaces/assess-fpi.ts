import { FootSide, FootPosture } from '../enums/foot.enum';
import { AssessMethod } from '../enums/assess.enum';
import * as firebase from 'firebase/app';


export interface AssessFpi {
    assessId?: string;
    athleteId: string;
    assessMethod: string | AssessMethod;
    createdAt?: firebase.firestore.FieldValue | Date;
    foot?: {
        [footSide: string]: {
            assessment?: { [observation: string]: { score: number } };
            posture?: string | FootPosture;
            imageUrl?: {
                [footView: string]: {
                    downloadUrl: string,
                    path: string
                }
            };
            index?: number;
            footPicture?: {
                [footView: string]: {
                    blob?: Blob,
                    metadata?: Object
                }
            };
        };
    };
    isDeleted?: boolean;
    updatedAt?: firebase.firestore.FieldValue | Date;
}
