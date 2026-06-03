import { Request, Response, NextFunction } from 'express';
import { WSresponse } from '../lib';
import { authService } from '../services/auth.service';

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    res.send(new WSresponse(true, result));
  } catch (err) {
    next(err);
  }
};

const logout = (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.send(new WSresponse(true, { message: 'Logged out successfully' }));
  } catch (err) {
    next(err);
  }
};

export const authController = { login, logout };
