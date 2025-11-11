export const validateQuery = (schema) => async (req, res, next) => {
  const valdationQueryResult = await schema.validateAsync(req.query, {
    abortEarly: false,
    convert: true,
  });
  req.validatedQuery = valdationQueryResult;
  next();
};
