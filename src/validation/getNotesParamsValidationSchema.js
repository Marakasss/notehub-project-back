import Joi from 'joi';

export const getNotesParamsValidationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  perPage: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().allow('').default(''),
  sortBy: Joi.string().valid('createdAt', 'updatedAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  tag: Joi.string()
    .valid(
      'All',
      'Work',
      'Personal',
      'Meeting',
      'Shopping',
      'Ideas',
      'Travel',
      'Finance',
      'Health',
      'Important',
      'Todo',
    )
    .default('All'),
});
