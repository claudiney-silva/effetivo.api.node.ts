import { Request, Response, NextFunction } from 'express';
import { authService } from '@src/services/authService';
import APIError, { errors } from '@src/services/APIError';

export const FORCE_EMAIL_VERIFIED = true;
export const NO_FORCE_EMAIL_VERIFIED = false;

export const authJwtMiddleware =
  (forceEmailVerified = FORCE_EMAIL_VERIFIED) =>
  async (req: Partial<Request>, res: Partial<Response>, next: NextFunction): Promise<void> => {
    const authHeader = req.headers?.authorization;

    if (!authHeader) return next(new APIError(errors.UnauthorizedNoTokenProvided));

    const [bearer, token] = authHeader?.split(' ');
    if (!bearer || !token) throw new APIError(errors.UnauthorizedTokenInvalid);

    try {
      const user = await authService.grantToken(token, { forceEmailVerified });
      req.myWebApp = { user };
      return next();
    } catch (err) {
      return next(err);
    }
  };
