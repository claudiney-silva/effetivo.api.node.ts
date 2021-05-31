import { ChildControllers, ClassOptions, Controller, Middleware, Post, Wrapper } from '@overnightjs/core';
import { Response, Request } from 'express';
import { validateMiddleware } from '@src/middlewares/validate';
import { asyncHandler } from '@src/util/asyncHandler';
import { authSchema, refreshTokenSchema } from '@src/validations/authSchemas';
import { PassportGoogle } from './passportGoogle';
import { authService } from '@src/services/authService';
import { rateLimitMiddleware } from '@src/middlewares/rateLimit';
import APIError, { errors } from '@src/services/APIError';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação de usuário
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthJwt:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           required: true
 *           description: Token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYWYwMzljODU2YzZkMjNiNGE1ODRiZiIsImlhdCI6MTYyMjQxNDQ4NiwiZXhwIjoxNjIyNTAwODg2fQ.4J_mNAa8RRp9sp7iLaoovGb8b2h1rRhbcx90Ohwacrc
 *         refreshToken:
 *           type: string
 *           required: true
 *           description: Refresh Token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYWYwMzljODU2YzZkMjNiNGE1ODRiZiIsImlhdCI6MTYyMjQxNDQ4NiwiZXhwIjoxNjIzMDE5Mjg2fQ.z0KL7Pypsz-5NY-7UhgOBA2FjZErvm-Blxf2ulLgO38
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthData:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           required: true
 *           example: john@doe.com
 *         password:
 *           type: string
 *           required: true
 *           example: 123abcde
 */

@Controller('auth')
@ClassOptions({ mergeParams: true })
@ChildControllers([new PassportGoogle()])
export class AuthController {
  /**
   * @swagger
   * /api/auth:
   *   post:
   *     summary: Autenticação do usuário
   *     description: Autenticação do usuário
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AuthData'
   *     responses:
   *       200:
   *         description: Autenticação com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthJwt'
   *       401:
   *         $ref: '#/definitions/Error401'
   *       404:
   *         $ref: '#/definitions/Error404'
   *       422:
   *         $ref: '#/definitions/Error422'
   *       500:
   *         $ref: '#/definitions/Error500'
   */
  @Post('')
  @Middleware(rateLimitMiddleware(3))
  @Middleware(validateMiddleware(authSchema))
  @Wrapper(asyncHandler)
  public async auth(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    return res.send(await authService.auth(email, password));
  }

  /**
   * @swagger
   * /api/auth/refresh-token:
   *   post:
   *     summary: Renovar o Token
   *     description: Renovar o Token a partir do Refresh Token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refreshToken:
   *                 type: string
   *                 required: true
   *                 description: Refresh Token
   *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYWYwMzljODU2YzZkMjNiNGE1ODRiZiIsImlhdCI6MTYyMjQxNDQ4NiwiZXhwIjoxNjIzMDE5Mjg2fQ.z0KL7Pypsz-5NY-7UhgOBA2FjZErvm-Blxf2ulLgO38
   *     responses:
   *       200:
   *         description: Token Renovado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthJwt'
   *       401:
   *         $ref: '#/definitions/Error401'
   *       404:
   *         $ref: '#/definitions/Error404'
   *       422:
   *         $ref: '#/definitions/Error422'
   *       500:
   *         $ref: '#/definitions/Error500'
   */
  @Post('refresh-token')
  @Middleware(rateLimitMiddleware(30))
  @Middleware(validateMiddleware(refreshTokenSchema))
  @Wrapper(asyncHandler)
  public async refreshToken(req: Request, res: Response): Promise<Response> {
    const authHeader = req.headers?.authorization;

    if (!authHeader)
      throw new APIError({
        ...errors.UnauthorizedNoTokenProvided,
        message: 'No token provided',
        data: [{ param: 'header/authorization', message: 'not jwt token provided' }],
      });

    const [bearer, token] = authHeader?.split(' ');
    if (!bearer || !token) throw new APIError(errors.UnauthorizedTokenInvalid);

    const { refreshToken } = req.body;
    return res.send(await authService.refreshToken(token, refreshToken));
  }
}
