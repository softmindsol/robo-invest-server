import jwt from 'jsonwebtoken';
import { MESSAGES, STATUS_CODES } from '../constants/index.js';
import Users from '../models/user.model.js';
import { asyncHandler, checkField, handleError } from '../utils/index.js';
import { ACCESS_TOKEN_SECRET } from '../configs/env.config.js';

export const verifyJWT = (roles = []) =>
  asyncHandler(async (req, _, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      checkField(!token, MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
      const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
      const user = await Users.findById(decodedToken?._id).select('-password');

      checkField(!user, MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

      if (roles.length && !roles.includes(user.role)) {
        handleError(next, STATUS_CODES.FORBIDDEN, MESSAGES.FORBIDDEN);
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        handleError(
          next,
          STATUS_CODES.UNAUTHORIZED,
          'Session expired. Please log in again.'
        );
      }
      handleError(next, STATUS_CODES.UNAUTHORIZED, 'Invalid token');
    }
  });
