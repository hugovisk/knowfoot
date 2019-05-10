import { FootSide, FootView } from '../enums/foot.enum';
// import { SafeStyle } from '@angular/platform-browser';


export interface CurrentAssessFpi {
    // athleteId: string;
    fpi: {
        foot?: {
            [footSide: string]: {
                assessment?: { [observation: string]: { score: number } },
                posture?: string,
                imageUrl?: {
                    [footView: string]: {
                        downloadUrl: string,
                        path: string
                    }
                },
                index?: number,
                footPicture: {
                    [footView: string]: {
                        blob: Blob,
                        metadata?: object
                    }
                }
            }
        };
        // assessment?: { [observation: string]: {score: number} };
        // posture?: string;
        // imageUrl?: { [footView: string]: { downloadUrl: string , path: string } };
        // index?: number;
        // footPicture: { [footView: string]: { blob: Blob , metadata?: object } };
        // footPicture: {
        //     insideRearAngle: {
        //         blob,
        //         metadata?
        //     }//string,
        //     rear: string,
        //     medial: string
        // };
    };
    footAssessed?: FootSide | string;
    // footPicture: {
    //     insideRearAngle: SafeStyle,
    //     rear: SafeStyle,
    //     medial: SafeStyle
    // };
    // footPosture?: string;
    footView: string;
    // index?: number;
    observationSlide: number;
    suggestOtherFootAssessement?: boolean;
}
