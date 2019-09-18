import { FootPosture } from '../enums/foot.enum';
import { AssessMethod } from '../enums/assess.enum';
import * as firebase from 'firebase/app';


export interface Assess {
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
            indexResult?: number;
            footPicture?: {
                [footView: string]: {
                    blob?: Blob,
                    metadata?: object
                }
            };
        };
    };
    isDeleted?: boolean;
    updatedAt?: firebase.firestore.FieldValue | Date;
}
