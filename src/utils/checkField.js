import { STATUS_CODES } from '../constants/index.js';
import ApiError from './ApiError.js';

const checkField = (field, message, statusCode = STATUS_CODES.BAD_REQUEST) => {
  if (field) throw new ApiError(statusCode, message);
};

export default checkField;
