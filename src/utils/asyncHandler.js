import logger from '../utils/logger.js';
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.log('🚀 ~ asyncHandler ~ error:', error);
    logger.error(error.message);
    next(error);
  }
};

export default asyncHandler;
