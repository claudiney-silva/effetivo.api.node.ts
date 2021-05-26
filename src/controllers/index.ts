import config from 'config';
import { ChildControllers, ClassOptions, Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { time } from '@src/util/time';
import { UsersController } from './users';
import { AuthController } from './auth';
import { AdminController } from './admin';

/**
 * @swagger
 * definitions:
 *  field-id:
 *   type: string
 *   example: '5f9c723590e4da0d043f29c0'
 *  field-keyword:
 *   type: string
 *   example: 'keyword'
 *  Error400:
 *   type: object
 *   properties:
 *    status:
 *     type: number
 *     required: true
 *     description: Http status code
 *     example: 400
 *    error:
 *     type: string
 *     required: true
 *     description: Error name
 *     example: UnprocessableError
 *    key:
 *     type: string
 *     required: true
 *     description: UPPERCASE identifier reason of the error
 *     example: UNPROCESSABLE_INVALID_FIELDS
 *    message:
 *     type: string
 *     required: false
 *     description: Error message
 *     example: Validation error
 *    data:
 *     type: array
 *     required: false
 *     items:
 *      type: object
 *      properties:
 *       field:
 *        type: string
 *        description: Field name
 *        example: 'id'
 *       message:
 *        type: string
 *        description: Validation message
 *        example: 'Field is required'
 *  Error401:
 *   type: object
 *   properties:
 *    status:
 *     type: number
 *     required: true
 *     description: Http status code
 *     example: 401
 *    error:
 *     type: string
 *     required: true
 *     description: Error name
 *     example: UnauthorizedError
 *    key:
 *     type: string
 *     required: true
 *     description: UPPERCASE identifier reason of the error
 *     example: ANAUTHORIZED_NO_TOKEN_PROVIDED
 *     enum: ['UNAUTHORIZEDERROR', 'ANAUTHORIZED_NO_TOKEN_PROVIDED', 'UNAUTHORIZED_INVALID_TOKEN', 'UNAUTHORIZED_INACTIVE_ACCOUNT', 'UNAUTHORIZED_BLOCKED_ACCOUNT', 'UNAUTHORIZED_UNVERIFIED_EMAIL', 'UNAUTHORIZED_TOKEN_EXPIRED']
 *    message:
 *     type: string
 *     required: false
 *     description: Error message
 *     example: No token provided
 *  Error404:
 *   type: object
 *   properties:
 *    status:
 *     type: number
 *     required: true
 *     description: Http status code
 *     example: 404
 *    error:
 *     type: string
 *     required: true
 *     description: Error name
 *     example: NotFoundError
 *    key:
 *     type: string
 *     required: true
 *     description: UPPERCASE identifier reason of the error
 *     example: NOTFOUNDERROR
 *    message:
 *     type: string
 *     required: false
 *     description: Error message
 *     example: Not Found
 *  Error500:
 *   type: object
 *   properties:
 *    status:
 *     type: number
 *     required: true
 *     description: Http status code
 *     example: 500
 *    error:
 *     type: string
 *     required: true
 *     description: Error name
 *     example: InternalServerError
 *    key:
 *     type: string
 *     required: true
 *     description: UPPERCASE identifier reason of the error
 *     example: APIINTERNALERROR
 *    message:
 *     type: string
 *     required: false
 *     description: Error message
 *     example: Something went wrong
 */

@Controller('api')
@ClassOptions({ mergeParams: true })
@ChildControllers([new UsersController(), new AuthController(), new AdminController()])
export class ApiController {
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
