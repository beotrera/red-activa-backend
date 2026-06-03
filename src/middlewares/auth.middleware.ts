import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { CustomError } from '../lib';
import { ApiError } from '../enums';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new CustomError(ApiError.Auth.unauthorized);
    }

    const token = authHeader.split(' ')[1];
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new CustomError(ApiError.Auth.unauthorized);
    }

    res.locals.userId = data.user.id;
    next();
  } catch (err) {
    next(err);
  }
};
