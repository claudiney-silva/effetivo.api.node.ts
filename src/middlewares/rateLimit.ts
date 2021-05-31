import rateLimit, { RateLimit } from 'express-rate-limit';
import { NextFunction, Request, Response } from 'express';
import APIError, { errors } from '@src/services/APIError';

export const rateLimitMiddleware = (max = 5): RateLimit =>
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute in milliseconds
    max,
    keyGenerator(req: Request): string {
      return `${req.ip}_${req.originalUrl}`;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handler(_: Request, res: Response, next: NextFunction): void {
      return next(new APIError({ ...errors.TooManyRequests, message: 'Too Many Requests' }));

      // throw new Error('Too many requests to this endpoint');
      /*
        res.status(429).send(
            ApiError.format({
                code: 429,
                message: "Too many requests to the '/forecast endpoint'",
            }),
        );
      */
    },
  });
