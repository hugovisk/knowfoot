import { EducationLevel, Occupation  } from '../enums/user.enum';
import { firestore } from 'firebase/app';

export interface UserProfile {
    creationDate?: firestore.FieldValue;
    name: string;
    email: string;
    password?: string;
    birthDate?: Date;
    education?: EducationLevel;
    occupation?: Occupation;
}