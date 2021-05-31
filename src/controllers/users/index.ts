import { Controller, Middleware, Wrapper, Post, Get, Put, Delete } from '@overnightjs/core';
import { Response, Request } from 'express';
import { validateMiddleware } from '@src/middlewares/validate';
import { asyncHandler } from '@src/util/asyncHandler';
import { userCreateSchema, userUpdateSchema } from '@src/validations/userSchemas';
import { userService } from '@src/services/userService';
import { UserCreateDto, userMapper, UserUpdateDto } from '@src/mappers/userMapper';
import { authJwtMiddleware, NO_FORCE_EMAIL_VERIFIED } from '@src/middlewares/authJwt';
import APIError, { errors } from '@src/services/APIError';

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
 *     UserSchema:
 *       type: object
 *       properties:
 *         id:
 *           $ref: '#/definitions/field-id'
 *         email:
 *           type: string
 *           required: true
 *           description: E-mail
 *           example: john@doe.com
 *         firstName:
 *           type: string
 *           required: true
 *           description: Nome
 *           example: John
 *         lastName:
 *           type: string
 *           required: true
 *           description: Sobrenome
 *           example: Doe
 *         active:
 *           type: boolean
 *           required: true
 *           description: Usuário Ativo/Inativo.
 *           example: true
 *         roles:
 *           type: array
 *           required: true
 *           description: Array com todas os perfis de permissão
 *           items:
 *             type: string
 *             example: user
 *             enum: [user, editor, manager, admin]
 *         origin:
 *           type: array
 *           required: true
 *           description: Array com todas as origens de login/sigin
 *           items:
 *             type: string
 *             example: local
 *             enum: [local, google]
 *         meta:
 *           type: object
 *           properties:
 *             emailNewsletters:
 *               type: boolean
 *               required: true
 *               description: Receber newsletters?
 *               example: true
 *             emailVerified:
 *               type: boolean
 *               required: false
 *               description: Criar o usuário e marcar o e-mail como verificado
 *               example: false
 *             authErrors:
 *               type: number
 *               required: false
 *               description: Número de vezes consecutivas que o usuário tentou logar e errou a senha
 *             secureToken:
 *               type: string
 *               required: false
 *               description: Token para autorizar o Reset Password
 *             secureTokenExpires:
 *               type: string
 *               required: false
 *               description: Data que o secureToke expira
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserCreateSchema:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           required: true
 *           description: E-mail
 *         password:
 *           type: string
 *           required: true
 *           description: Senha
 *         firstName:
 *           type: string
 *           required: true
 *           description: Nome
 *         lastName:
 *           type: string
 *           required: true
 *           description: Sobrenome
 *         emailNewsletters:
 *           type: boolean
 *           required: true
 *           description: Receber newsletters?
 *         emailVerified:
 *           type: boolean
 *           required: false
 *           description: Criar o usuário e marcar o e-mail como verificado
 *       example:
 *         email: john@doe.com
 *         password: 123abcde
 *         firstName: John
 *         lastName: Doe
 *         emailNewsletters: true
 *     UserUpdateSchema:
 *       type: object
 *       properties:
 *         password:
 *           type: string
 *           required: true
 *           description: Senha
 *         firstName:
 *           type: string
 *           required: true
 *           description: Nome
 *         lastName:
 *           type: string
 *           required: true
 *           description: Sobrenome
 *         emailNewsletters:
 *           type: boolean
 *           required: true
 *           description: Receber newsletters?
 *       example:
 *         password: 123abcde
 *         firstName: John
 *         lastName: Doe
 *         emailNewsletters: true
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
   *             $ref: '#/components/schemas/UserCreateSchema'
   *     responses:
   *       200:
   *         description: Usuário criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserSchema'
   *       422:
   *         $ref: '#/definitions/error-422'
   *       500:
   *         $ref: '#/definitions/error-500'
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
   *     security:
   *       - bearerAuth: []
   *     summary: Retorna os dados do usuário
   *     description: Retorna os dados do usuário
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: Usuário retornado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserSchema'
   *       401:
   *         $ref: '#/definitions/error-401'
   *       500:
   *         $ref: '#/definitions/error-500'
   */
  @Get('me')
  @Middleware(authJwtMiddleware(NO_FORCE_EMAIL_VERIFIED))
  @Wrapper(asyncHandler)
  public async readMe(req: Request, res: Response): Promise<Response> {
    return res.send({ user: req.myWebApp.user });
  }

  /**
   * @swagger
   * /api/users:
   *   get:
   *     security:
   *       - bearerAuth: []
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
   *                 $ref: '#/components/schemas/UserSchema'
   *       401:
   *         $ref: '#/definitions/error-401'
   *       500:
   *         $ref: '#/definitions/error-500'
   */
  @Get('')
  @Middleware(authJwtMiddleware(NO_FORCE_EMAIL_VERIFIED))
  @Wrapper(asyncHandler)
  public async readAll(req: Request, res: Response): Promise<Response> {
    // TODO colocar o middleware 'role' para limitar a Role.ADMIN
    return res.send(await userService.findAll());
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     security:
   *       - bearerAuth: []
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
   *         description: O usuário
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserSchema'
   *       401:
   *         $ref: '#/definitions/error-401'
   *       404:
   *         $ref: '#/definitions/error-404'
   *       500:
   *         $ref: '#/definitions/error-500'
   */
  @Get(':id')
  @Middleware(authJwtMiddleware(NO_FORCE_EMAIL_VERIFIED))
  @Wrapper(asyncHandler)
  public async read(req: Request, res: Response): Promise<Response> {
    return res.send(await userService.findById(req.params.id));
  }

  /**
   * @swagger
   * /api/users/{id}:
   *  put:
   *    summary: Atualiza o usuário pelo ID
   *    description: Atualiza o usuário pelo ID
   *    tags: [Users]
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *          required: true
   *          description: O ID do usuário
   *          example: 60af039c856c6d23b4a584bf
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/UserUpdateSchema'
   *    responses:
   *       200:
   *         description: O usuário alterado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserSchema'
   *       401:
   *         $ref: '#/definitions/error-401'
   *       404:
   *         $ref: '#/definitions/error-404'
   *       422:
   *         $ref: '#/definitions/error-422'
   *       500:
   *         $ref: '#/definitions/error-500'
   */
  @Put(':id')
  @Middleware(authJwtMiddleware(NO_FORCE_EMAIL_VERIFIED))
  @Middleware(validateMiddleware(userUpdateSchema))
  @Wrapper(asyncHandler)
  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const dto: UserUpdateDto = req.body;

    const user = await userService.findById(id);
    if (!user) {
      throw new APIError({
        ...errors.NotFound,
        message: 'User Not Found',
      });
    }

    user.firstName = dto.firstName;
    user.lastName = dto.lastName;
    user.password = dto.password;

    // TODO Alterar o emailNewsletters
    // TODO Apagar o campo password antes de retornar
    // TODO colocar o middleware 'role' para limitar a Role.ADMIN

    // user.meta.put('emailNewsletters', dto.emailNewsletters);

    return res.send(await userService.save(user));
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     summary: Remove o usuário pelo ID
   *     description:  Remove o usuário pelo ID
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
   *         description: Usuário removido
   *       401:
   *         $ref: '#/definitions/error-401'
   *       404:
   *         $ref: '#/definitions/error-404'
   *       500:
   *         $ref: '#/definitions/error-500'
   */
  @Delete(':id')
  @Middleware(authJwtMiddleware(NO_FORCE_EMAIL_VERIFIED))
  @Wrapper(asyncHandler)
  public async delete(req: Request, res: Response): Promise<Response> {
    // TODO colocar o middleware 'role' para limitar a Role.ADMIN

    await userService.deleteById(req.params.id);
    return res.send({ test: 'ok' });
  }
}
