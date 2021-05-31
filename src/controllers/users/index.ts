import { Controller, Post, Get, Middleware, Wrapper } from '@overnightjs/core';
import { Response, Request } from 'express';
import { validateMiddleware } from '@src/middlewares/validate';
import { asyncHandler } from '@src/util/asyncHandler';
import { userCreateSchema } from '@src/validations/userSchemas';
import { userService } from '@src/services/userService';
import { UserCreateDto, userMapper } from '@src/mappers/userMapper';
import { authJwtMiddleware, NO_FORCE_EMAIL_VERIFIED } from '@src/middlewares/authJwt';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento do usuário
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *         - emailNewsletters
 *       properties:
 *         email:
 *           type: string
 *           description: E-mail
 *         password:
 *           type: string
 *           description: Senha
 *         firstName:
 *           type: string
 *           description: Nome
 *         lastName:
 *           type: string
 *           description: Sobrenome
 *         emailNewsletters:
 *           type: boolean
 *           description: Receber newsletters?
 *       example:
 *         email: john@doe.com
 *         password: 123abcde
 *         firstName: John
 *         lastName: Doe
 *         emailNewsletters: true
 */

/**
 * @swagger
 * definitions:
 *   User:
 *     required:
 *       - username
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       path:
 *         type: string
 */

@Controller('users')
export class UsersController {
  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Cria um usuário
   *     description: Cria um usuário
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       200:
   *         description: Usuário criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       422:
   *         $ref: '#/definitions/Error422'
   *       500:
   *         $ref: '#/definitions/Error500'
   */
  @Post('')
  @Middleware(validateMiddleware(userCreateSchema))
  @Wrapper(asyncHandler)
  public async create(req: Request, res: Response): Promise<Response> {
    const dto: UserCreateDto = req.body;
    dto.origin = 'local';

    const user = userMapper.toDomainDto(dto);

    return res.send(await userService.create(user));
  }

  /**
   * @swagger
   * /api/users/me:
   *   get:
   *     description: Retorna os dados do usuário
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: Usuário criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       401:
   *         $ref: '#/definitions/Error401'
   *       422:
   *         $ref: '#/definitions/Error422'
   *       500:
   *         $ref: '#/definitions/Error500'
   */
  @Get('me')
  @Middleware(authJwtMiddleware(NO_FORCE_EMAIL_VERIFIED))
  public async me(req: Request, res: Response): Promise<Response> {
    return res.send({ user: req.myWebApp.user });
  }

  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Lista de todos usuários
   *     description: Lista de todos usuários
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: Lista de todos usuários
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   */
  @Get('')
  public async users(req: Request, res: Response): Promise<Response> {
    return res.send(await userService.findAll());
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Retorna usuário pelo ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: O ID do usuário
   *         example: 60af039c856c6d23b4a584bf
   *     responses:
   *       200:
   *         description: O usuário pelo ID
   *         contens:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       404:
   *         description: Usuário não encontrado
   */
  @Get(':id')
  public async getUser(req: Request, res: Response): Promise<Response> {
    return res.send(await userService.findById(req.params.id));
  }
}
