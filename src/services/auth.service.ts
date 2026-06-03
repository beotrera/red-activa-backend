import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../config/config';
import { UserModel, IUser } from '../models/user.mongo.model';
import { CustomError } from '../lib';
import { ApiError } from '../enums';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
}

const generateToken = (user: IUser): string => {
  const payload: AuthTokenPayload = { userId: (user._id as mongoose.Types.ObjectId).toString(), email: user.email };
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn as any });
};

const login = async ({ email, password }: LoginPayload) => {
  const user = await UserModel.findOne({ email }).select('+password');
  if (!user) throw new CustomError(ApiError.Auth.invalidCredentials);

  const valid = await user.comparePassword(password);
  if (!valid) throw new CustomError(ApiError.Auth.invalidCredentials);

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      position: user.position,
    },
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

export const authService = {
  login,
  verifyToken,
};
