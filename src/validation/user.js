import Joi from 'joi';

export const updateUserSchema = Joi.object({
  username: Joi.string().min(2).max(30),
});
