import { Schema } from 'joi';
import APIError, { ApiErrorParam, errors } from '@src/services/APIError';
import { Request, Response, NextFunction } from 'express';

export const validateMiddleware =
  (schema: Schema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const { details } = error;
      const data: ApiErrorParam[] = [];
      details.forEach(i => {
        const param = i.context?.key;
        const { message } = i;
        data.push({ param, message });
      });

      return next(new APIError({ ...errors.Unauthorized, message: 'Validation error', data }));
    }

    return next();
  };
