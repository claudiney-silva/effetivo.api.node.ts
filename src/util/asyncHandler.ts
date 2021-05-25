/* eslint-disable @typescript-eslint/ban-types */
import { Request, Response, NextFunction } from 'express';

export const asyncHandler =
  (fn: Function) =>
  async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    return fn(req, res, next).catch((err: Error) => {
      next(err);
    });
  };
