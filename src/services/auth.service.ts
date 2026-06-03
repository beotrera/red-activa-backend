import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../config/config';
import { UserModel } from '../models/user.model';
import { IInstitution } from '../models/institution.model';
import { CustomError } from '../lib';
import { ApiError } from '../enums';
import { LoginPayload, AuthTokenPayload, AuthUser } from '../types';

const generateToken = (payload: AuthTokenPayload): string =>
  jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn as any });

const login = async ({ email, password }: LoginPayload): Promise<AuthUser> => {
  // Single query — populate institution name for the token entity field
  const user = await UserModel.findOne({ email })
    .select('+password')
    .populate<{ institution: IInstitution }>('institution', 'name _id');

  if (!user) throw new CustomError(ApiError.Auth.invalidCredentials);

  const valid = await user.comparePassword(password);
  if (!valid) throw new CustomError(ApiError.Auth.invalidCredentials);

  const institution = user.institution as unknown as IInstitution;

  const payload: AuthTokenPayload = {
    userId: (user._id as mongoose.Types.ObjectId).toString(),
    email: user.email,
    fullName: `${user.firstName} ${user.lastName}`,
    role: user.role,
    gender: user.gender,
    entity: institution?.name ?? '',
    institutionId: (institution?._id as mongoose.Types.ObjectId)?.toString() ?? '',
    avatarUrl: user.avatarUrl || '',
  };

  const token = generateToken(payload);

  return {
    id: payload.userId,
    email: payload.email,
    fullName: payload.fullName,
    role: payload.role,
    gender: payload.gender,
    entity: payload.entity,
    avatarUrl: payload.avatarUrl,
    token,
  };
};

const verifyToken = (token: string): AuthTokenPayload => {
  try {
    return jwt.verify(token, config.jwt.secret) as AuthTokenPayload;
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') throw new CustomError(ApiError.Auth.tokenExpired);
    throw new CustomError(ApiError.Auth.unauthorized);
  }
};

export const authService = { login, verifyToken };
