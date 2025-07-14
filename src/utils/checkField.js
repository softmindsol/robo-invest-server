import ApiError from './ApiError.js';

const checkField = (field, message) => {
  if (field) throw new ApiError(400, message);
};

export default checkField;
