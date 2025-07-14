import ApiError from './ApiError.js';

function addValidation(schema) {
  return (req, res, next) => {
    const { error } = schema?.validate(req.body || {});

    if (error) {
      const errorMessage = error.details.map((err) => err.message).join(', ');
      return next(new ApiError(400, errorMessage));
    }

    next();
  };
}

export default addValidation;
