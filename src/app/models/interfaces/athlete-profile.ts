import { FootSide, FootInjurie } from '../enums/foot.enum';
import { Gender } from '../enums/gender.enum';
import { Sport, SportPraticeFrequency, SportPraticeTime } from '../enums/sport.enum';

export interface AthleteProfile {
    birthDate: string;
    createdAt?: object;
    contactEmail?: string;
    contactPhone?: string;
    dominantFoot: FootSide;
    furtherInformation?: string;
    gender: Gender;
    heightInCm: number;
    id?: string;
    isDeleted?: boolean;
    leftFootInjuries: FootInjurie[];
    name: string;
    rightFootInjuries: FootInjurie[];
    sport: Sport;
    sportPraticeFrequency?: SportPraticeFrequency;
    sportPraticeTime?: SportPraticeTime;
    updatedAt?: object;
    weightInKg: number;
}
