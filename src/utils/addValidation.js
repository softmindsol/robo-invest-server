import ApiError from './ApiError.js';

function addValidation(schema, getContext) {
  return (req, res, next) => {
    const context = getContext ? getContext(req) : {};
    const { error } = schema.validate(req.body || {}, { context });

    if (error) {
      const errorMessage = error.details.map((err) => err.message).join(', ');
      return next(new ApiError(400, errorMessage));
    }

    next();
  };
}

export default addValidation;
