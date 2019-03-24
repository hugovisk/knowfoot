import { FootSide, FootInjurie } from '../enums/foot.enum';
import { Gender } from '../enums/gender.enum';
import { Sport, SportPraticeFrequency, SportPraticeTime } from '../enums/sport.enum';

export interface AthleteProfile {
    birthDate: Date;
    createdAt?: object;
    contact: boolean;
    contactEmail?: string;
    contactPhone?: string;
    footDominant: FootSide;
    footInjuries: boolean;
    footInjuriesLeft?: FootInjurie[];
    footInjuriesRight?: FootInjurie[];
    furtherInformation?: string;
    gender: Gender;
    heightInCm: number;
    id?: string;
    isDeleted?: boolean;
    name: string;
    sport: Sport;
    sportPratice: boolean;
    sportPraticeFrequency?: SportPraticeFrequency;
    sportPraticeTime?: SportPraticeTime;
    updatedAt?: object;
    weightInKg: number;
}
