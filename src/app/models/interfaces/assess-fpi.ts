import { FootSide, FootPosture } from '../enums/foot.enum';
import { AssessMethod } from '../enums/assess.enum';
import * as firebase from 'firebase/app';


export interface AssessFpi {
    athleteId?: string;
    assessId?: string;
    assessMethod?: string | AssessMethod;
    createdAt?: firebase.firestore.FieldValue | Date;
    fpi?: {
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
                footPicture: {
                    [footView: string]: {
                        blob: Blob,
                        metadata?: object
                    }
                };
            };
        }
    };
    // footRight?: {
    //     assessment?: { [observation: string]: {score: number} };
    //     posture?: string | FootPosture;
    //     imageUrl?: { [footView: string]: { downloadUrl: string , path: string } };
    //     index?: number;
    // };
    isDeleted?: boolean;
    updatedAt?: firebase.firestore.FieldValue | Date;
}
