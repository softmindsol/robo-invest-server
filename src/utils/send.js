import ApiError from './ApiError.js';
import ApiResponse from './ApiResponse.js';

const sendResponse = (res, statusCode, message, data = {}) => {
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, message, data));
};

const handleError = (next, errorMessage, statusCode) => {
  return next(new ApiError(statusCode, errorMessage));
};

export { sendResponse, handleError };
