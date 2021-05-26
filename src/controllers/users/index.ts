import { Controller, Post, Get, Middleware, Wrapper } from '@overnightjs/core';
import { Response, Request } from 'express';
import { validateMiddleware } from '@src/middlewares/validate';
import { asyncHandler } from '@src/util/asyncHandler';
import { userCreateSchema } from '@src/validations/userSchemas';
import { userService } from '@src/services/userService';
import { UserCreateDto, userMapper } from '@src/mappers/userMapper';
import { authJwtMiddleware, NO_FORCE_EMAIL_VERIFIED } from '@src/middlewares/authJwt';

@Controller('users')
export class UsersController {
  @Post('create')
  @Middleware(validateMiddleware(userCreateSchema))
  @Wrapper(asyncHandler)
  public async create(req: Request, res: Response): Promise<Response> {
    const dto: UserCreateDto = req.body;
    dto.origin = 'local';

    const user = userMapper.toDomainDto(dto);

    return res.send(await userService.create(user));
  }

  @Get('me')
  @Middleware(authJwtMiddleware(NO_FORCE_EMAIL_VERIFIED))
  public async me(req: Request, res: Response): Promise<Response> {
    return res.send({ user: req.myWebApp.user });
  }
}
