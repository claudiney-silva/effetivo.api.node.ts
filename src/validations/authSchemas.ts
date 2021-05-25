import Joi from 'joi';

const email = Joi.string().email({ minDomainSegments: 2 }).required();

const password = Joi.string()
  .pattern(/^[a-zA-Z0-9]{3,30}$/)
  .required();

const refreshToken = Joi.string().required();

// SCHEMAS

export const authSchema = Joi.object({
  email,
  password,
});

export const refreshTokenSchema = Joi.object({
  refreshToken,
});
