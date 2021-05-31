import Joi from 'joi';

const email = Joi.string().email({ minDomainSegments: 2 }).required();

const password = Joi.string()
  .pattern(/^[a-zA-Z0-9]{3,30}$/)
  .required();

const firstName = Joi.string().min(3).max(30).required();

const lastName = Joi.string().min(3).max(30).required();

const emailNewsletters = Joi.boolean().required();

// SCHEMAS

export const userCreateSchema = Joi.object({
  firstName,
  lastName,
  email,
  password,
  emailNewsletters,
});

export const userUpdateSchema = Joi.object({
  firstName,
  lastName,
  password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
  emailNewsletters,
});
