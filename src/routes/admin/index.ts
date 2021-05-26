import { authJwtMiddleware } from '@src/middlewares/authJwt';
import { roleMiddleware } from '@src/middlewares/role';
import { Role } from '@src/models/userModel';
import { Router, Request, Response } from 'express';

export const router = Router();

router.get('/', authJwtMiddleware(), roleMiddleware(Role.ADMIN), (req: Request, res: Response): Response => {
  return res.send({ message: 'success your are in admin mode.' });
});
