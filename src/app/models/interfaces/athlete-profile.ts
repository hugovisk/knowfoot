import { FootSide, FootInjurie } from '../enums/foot.enum';
import { Gender } from '../enums/gender.enum';
import { Sport, SportPraticeFrequency, SportPraticeTime } from '../enums/sport.enum';

export interface AthleteProfile {
    birthDate: Date;
    creationDate?: object;
    contactEmail?: string;
    contactPhone?: string;
    dominantFoot: FootSide;
    furtherInformation?: string;
    gender: Gender;
    height: number;
    id: string;
    isDeleted: boolean;
    leftFootInjuries: FootInjurie[];
    name: string;
    rightFootInjuries: FootInjurie[];
    sport: Sport;
    sportPraticeFrequency?: SportPraticeFrequency;
    sportPraticeTime?: SportPraticeTime;
    weight: number;
}
