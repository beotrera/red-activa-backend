import { InstitutionType } from '../../enums';

export interface CreateInstitutionDto {
  name: string;
  type: InstitutionType;
  address: string;
  phone?: string;
  longitude: number;
  latitude: number;
}

export interface NearbyQuery {
  longitude: number;
  latitude: number;
  maxDistance?: number;
}
