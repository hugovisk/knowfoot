import { FootSide, FootInjurie } from '../models/enums/foot.enum';
import { Gender } from '../models/enums/gender.enum';
import { Sport, SportPraticeFrequency, SportPraticeTime } from '../models/enums/sport.enum';

export interface AthleteProfile {
    birthDate: Date;
    creationDate?: object;
    contactEmail?: string;
    contactPhone?: string;
    dominantFoot: FootSide;
    furtherInformation?: string;
    gender: Gender;
    height: number;
    isDeleted: boolean;
    leftFootInjuries: FootInjurie[];
    name: string;
    rightFootInjuries: FootInjurie[];
    sport: Sport;
    sportPraticeFrequency?: SportPraticeFrequency | null;
    sportPraticeHowLong?: SportPraticeTime | null;
    weight: number;
}
