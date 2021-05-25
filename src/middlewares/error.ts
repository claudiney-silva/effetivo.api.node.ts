import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@src/services/APIError';
import errorService from '@src/services/errorService';

export default function errorMiddleware(
  err: ApiError,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const apiError = errorService.format(err);
  res.status(apiError.status).send(apiError);
}
