import { Router, Request, Response } from 'express';
import { rateLimitMiddleware } from '@src/middlewares/rateLimit';
import { validateMiddleware } from '@src/middlewares/validate';
import { asyncHandler } from '@src/util/asyncHandler';
import { authSchema, refreshTokenSchema } from '@src/validations/authSchemas';
import { authService } from '@src/services/authService';
import APIError, { errors } from '@src/services/APIError';

export const router = Router();

router.post(
  '/',
  rateLimitMiddleware(3),
  validateMiddleware(authSchema),
  asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    return res.send(await authService.auth(email, password));
  })
);

router.post(
  '/refresh-token',
  rateLimitMiddleware(30),
  validateMiddleware(refreshTokenSchema),
  asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const authHeader = req.headers?.authorization;

    if (!authHeader)
      throw new APIError({
        ...errors.UnauthorizedNoTokenProvided,
        data: [{ param: 'header/authorization', message: 'not jwt token provided' }],
      });

    const [bearer, token] = authHeader?.split(' ');
    if (!bearer || !token) throw new APIError(errors.UnauthorizedTokenInvalid);

    const { refreshToken } = req.body;
    return res.send(await authService.refreshToken(token, refreshToken));
  })
);
