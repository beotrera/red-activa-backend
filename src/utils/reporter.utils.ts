import { UserRole, Gender } from '../enums';

const PREFIX_MAP: Partial<Record<UserRole, { [G in Gender]?: string } & { default?: string }>> = {
  [UserRole.DOCTOR]: { [Gender.MALE]: 'Dr.', [Gender.FEMALE]: 'Dra.' },
  [UserRole.NURSE]: { default: 'Enf.' },
  [UserRole.SOCIAL_WORKER]: { default: 'Lic.' },
  [UserRole.PSYCHOLOGIST]: { default: 'Lic.' },
  [UserRole.ADMINISTRATOR]: { default: '' },
};

export const buildReportedBy = (role: UserRole, gender: Gender, fullName: string): string => {
  const roleMap = PREFIX_MAP[role];
  if (!roleMap) return fullName;
  const prefix = roleMap[gender] ?? roleMap.default ?? '';
  return prefix ? `${prefix} ${fullName}` : fullName;
};
