import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../lib';
import { ApiError } from '../enums';
import { authService } from '../services/auth.service';

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new CustomError(ApiError.Auth.unauthorized);
    }

    const token = authHeader.split(' ')[1];
    const payload = authService.verifyToken(token);

    res.locals.userId = payload.userId;
    res.locals.email = payload.email;
    res.locals.fullName = payload.fullName;
    res.locals.role = payload.role;
    res.locals.gender = payload.gender;
    res.locals.entity = payload.entity;
    res.locals.institutionId = payload.institutionId;
    res.locals.avatarUrl = payload.avatarUrl;

    next();
  } catch (err) {
    next(err);
  }
};
