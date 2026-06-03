import { UserRole, Gender } from '../../enums';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  gender: Gender;
  entity: string;
  institutionId: string;
  avatarUrl: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  gender: Gender;
  entity: string;
  avatarUrl: string;
  token: string;
}
