import { ChildControllers, ClassOptions, Controller, Middleware, Post, Wrapper } from '@overnightjs/core';
import { Response, Request } from 'express';
import { validateMiddleware } from '@src/middlewares/validate';
import { asyncHandler } from '@src/util/asyncHandler';
import { authSchema, refreshTokenSchema } from '@src/validations/authSchemas';
import { PassportGoogle } from './passportGoogle';
import { authService } from '@src/services/authService';
import { rateLimitMiddleware } from '@src/middlewares/rateLimit';
import APIError, { errors } from '@src/services/APIError';

@Controller('auth')
@ClassOptions({ mergeParams: true })
@ChildControllers([new PassportGoogle()])
export class AuthController {
  @Post('api/auth')
  @Middleware(rateLimitMiddleware(3))
  @Middleware(validateMiddleware(authSchema))
  @Wrapper(asyncHandler)
  public async auth(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    return res.send(await authService.auth(email, password));
  }

  @Post('api/auth/refresh-token')
  @Middleware(rateLimitMiddleware(30))
  @Middleware(validateMiddleware(refreshTokenSchema))
  @Wrapper(asyncHandler)
  public async refreshToken(req: Request, res: Response): Promise<Response> {
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
  }
}
