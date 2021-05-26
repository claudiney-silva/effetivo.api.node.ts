import { Request, Response, NextFunction } from 'express';
import { Role } from '@src/models/userModel';
import APIError, { errors } from '@src/services/APIError';

export const roleMiddleware =
  (role: Role) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { user } = req.myWebApp;

    // grant access if user has Role.ADMIN or role as parameter
    if (user?.roles.filter(r => r === Role.ADMIN || r === role).length) {
      return next();
    }
    return next(new APIError({ ...errors.Unauthorized, message: 'Restrict access' }));
  };
