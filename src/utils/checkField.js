import { STATUS_CODES } from '../constants/index.js';
import ApiError from './ApiError.js';

const checkField = (field, message) => {
  if (field) throw new ApiError(STATUS_CODES.BAD_REQUEST, message);
};

export default checkField;
