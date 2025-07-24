import jwt from 'jsonwebtoken';
import { MESSAGES, STATUS_CODES } from '../constants/index.js';
import Users from '../models/user.model.js';
import { asyncHandler, checkField, handleError } from '../utils/index.js';
import { ACCESS_TOKEN_SECRET } from '../configs/env.config.js';
import { TokenService } from '../services/auth/token.service.js';

export const verifyJWT = (roles = []) =>
  asyncHandler(async (req, _, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      checkField(!token, MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

      // Validate access token using TokenService
      const { user } = await TokenService.validateAccessToken(token);

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
          'Access token expired. Please refresh your token or log in again.'
        );
      } else if (error.message.includes('expired')) {
        handleError(next, STATUS_CODES.UNAUTHORIZED, error.message);
      }
      handleError(next, STATUS_CODES.UNAUTHORIZED, 'Invalid token');
    }
  });
