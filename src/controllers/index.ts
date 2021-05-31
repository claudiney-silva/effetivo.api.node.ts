import config from 'config';
import { ChildControllers, ClassOptions, Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { time } from '@src/util/time';
import { UsersController } from './users';
import { AuthController } from './auth';
import { AdminController } from './admin';

/**
 * @swagger
 * tags:
 *   name: Geral
 *   description: Endpoints gerais
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     APIErrorSchema:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           required: true
 *           description: Http status code
 *         error:
 *           type: string
 *           required: true
 *           description: Error name
 *         key:
 *           type: string
 *           required: true
 *           description: UPPERCASE identifier reason of the error
 *         message:
 *           type: string
 *           required: false
 *           description: Error message
 *         data:
 *           type: array
 *           required: false
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 description: Field name
 *                 example: 'id'
 *               message:
 *                 type: string
 *                 description: Validation message
 *                 example: 'Field is required'
 */

/**
 * @swagger
 * definitions:
 *  field-id:
 *   type: string
 *   example: '5f9c723590e4da0d043f29c0'
 *  error-422:
 *    description: Validation Error
 *    content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/APIErrorSchema'
 *        example:
 *          status: 422
 *          error: UnprocessableError
 *          key: UNPROCESSABLE_INVALID_FIELDS
 *          message: Validation error
 *          data: [{"param":"id", "message":"Field is required"}]
 *  error-401:
 *    description: Não Autorizado
 *    content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/APIErrorSchema'
 *        example:
 *          status: 401
 *          error: Unauthorized
 *          key: NO_TOKEN_PROVIDED
 *          message: No token provided
 *          data: [{"param": "header/authorization","message": "not jwt token provided"}]
 *  error-404:
 *    description: Not Found Error
 *    content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/APIErrorSchema'
 *        example:
 *          status: 404
 *          error: NotFoundError
 *          key: NOTFOUNDERROR
 *          message: Not Found
 *  error-429:
 *    description: Too Many Requests
 *    content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/APIErrorSchema'
 *        example:
 *          status: 429
 *          error: TooManyRequests
 *          key: TOOMANUREQUESTS
 *          message: Too Many Requests
 *  error-500:
 *    description: Internal Server Error
 *    content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/APIErrorSchema'
 *        example:
 *          status: 500
 *          error: InternalServerError
 *          key: APIINTERNALERROR
 *          message: Something went wrong
 */

@Controller('api')
@ClassOptions({ mergeParams: true })
@ChildControllers([new UsersController(), new AuthController(), new AdminController()])
export class ApiController {
  /**
   * @swagger
   * /api:
   *   get:
   *     summary: Retorna dados sobre a API
   *     description: Retorna dados sobre a API
   *     tags: [Geral]
   *     responses:
   *       200:
   *         description: API em funcionamento
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 mode:
   *                   type: string
   *                   required: true
   *                   description: Modo que a API esta executando
   *                   example: production
   *                   enum: [production, test, development]
   *                 utc:
   *                   type: string
   *                   required: true
   *                   description: Timestamp da Data/Hora do Servidor
   *                   example: 2021-05-31T18:11:50.499Z
   *                 unix:
   *                   type: number
   *                   required: true
   *                   description: Data/Hora do Servidor em formato UNIX
   *                   example: 1622484710
   *                 version:
   *                   type: string
   *                   required: true
   *                   description: Versão da API
   *                   example: v0.0.1
   *       500:
   *         $ref: '#/definitions/error-500'
   */
  @Get('')
  public index(req: Request, res: Response): Response {
    const mode = process.env.NODE_ENV || 'development';
    const version = config.get<string>('App.version');
    return res.send({
      mode,
      utc: time.getDateUtc(),
      unix: time.getDateUnix(),
      version,
    });
  }
}
