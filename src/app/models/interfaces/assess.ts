import { SafeStyle } from '@angular/platform-browser';
import { FootPosture, FootSide, FootView } from '../enums/foot.enum';
import { AssessMethod } from '../enums/assess.enum';
import * as firebase from 'firebase/app';


interface Assess {
    assessId?: string;
    patientId?: string;
    assessMethod?: AssessMethod; // string |
    createdAt?: firebase.firestore.FieldValue | Date;
    foot?: {};
    isDeleted?: boolean;
    updatedAt?: firebase.firestore.FieldValue | Date;
}

export interface PreAssessFpi extends Assess {
    patientName: string;
    foot?: {
        [footSide: string]: {
            view?: {
                [footView: string]: {
                    imageUrl: string,
                    imageBlob: Blob
                }
            };
        };
    };
}

export interface AssessFpi extends Assess {
    foot?: {
        [footSide: string]: {
            assessment?: { [observation: string]: { score: number } };
            posture?: FootPosture; // string |
            imageUrl?: {
                [footView: string]: {
                    downloadUrl: string,
                    path: string
                }
            };
            imageBlob?: {
                [footView: string]: {
                    blob?: Blob,
                    metadata?: object
                }
            };
            resultIndex?: number;
        };
    };
}

export interface AssessFpiCurrent extends AssessFpi {
    footAssessed?: FootSide | string;
    footPictureActive?: SafeStyle;
    footPictureView?: { [observation: string]: SafeStyle };
    footView?: FootView | string;
    observationSlide?: number;
}


export interface AssessDrop extends Assess {
    foot?: {
        [footSide: string]: {
            assessment?: { [measurement: string]: { scoreInMm: number } };
            posture?: FootPosture; // string |
            resultScoreInMm?: number;
        };
    };
}

