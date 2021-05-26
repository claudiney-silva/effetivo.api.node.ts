import { Router, Request, Response } from 'express';
import { UserCreateDto, userMapper } from '@src/mappers/userMapper';
import { userService } from '@src/services/userService';
import { authJwtMiddleware, NO_FORCE_EMAIL_VERIFIED } from '@src/middlewares/authJwt';
import { validateMiddleware } from '@src/middlewares/validate';
import { userCreateSchema } from '@src/validations/userSchemas';
import { asyncHandler } from '@src/util/asyncHandler';

export const router = Router();

router.get(
  '/me',
  authJwtMiddleware(NO_FORCE_EMAIL_VERIFIED),
  async (req: Request, res: Response): Promise<Response> => {
    return res.send(req.myWebApp.user);
  }
);

router.post(
  '/',
  validateMiddleware(userCreateSchema),
  asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const dto: UserCreateDto = req.body;
    dto.origin = 'local';

    const user = userMapper.toDomainDto(dto);

    return res.status(200).send(await userService.create(user));
  })
);
