import { FootSide, FootView } from '../enums/foot.enum';
import { SafeStyle } from '@angular/platform-browser';


export interface CurrentAssessFpi {
    // athleteId: string;
    assessment: { [observation: string]: { score: number } };
    footAssessed: FootSide;
    footPicture: {
        insideRearAngle: SafeStyle,
        rear: SafeStyle,
        medial: SafeStyle
    };
    footPosture?: string;
    footView: FootView;
    index?: number;
    observationSlide: number;
    suggestOtherFootAssessement?: boolean;
}
