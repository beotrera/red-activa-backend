import { Gender, ConsciousnessLevel, PersonStatus } from '../../enums';

export interface CreatePersonDto {
  estimatedAge: number;
  gender: Gender;
  height: string;
  weight: string;
  distinctiveFeatures: string;
  consciousnessLevel: ConsciousnessLevel;
  location?: string;
  institution: string;
  dateOfAdmission: string;
  reportedBy?: string;
  assignedTo?: string;
  notes?: string;
}

export interface UpdatePersonDto extends Partial<CreatePersonDto> {
  status?: PersonStatus;
}

export interface PersonFilters {
  status?: PersonStatus;
  institution?: string;
  gender?: Gender;
}
