import { EducationLevel, Occupation  } from '../enums/user.enum';

export interface UserProfile {
    creationDate?: object;
    name: string;
    email: string;
    password?: string;
    birthDate: Date;
    education: EducationLevel;
    occupation: Occupation;
}
