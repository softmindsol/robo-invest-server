import jwt from 'jsonwebtoken';
import { MESSAGES, STATUS_CODES } from '../constants/index.js';
import Users from '../models/user.model.js';
import { asyncHandler, handleError } from '../utils/index.js';
import { ACCESS_TOKEN_SECRET } from '../configs/env.config.js';

export const verifyJWT = (roles = []) =>
  asyncHandler(async (req, _, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        handleError(next, STATUS_CODES.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
      }
      const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
      const user = await Users.findById(decodedToken?._id).select('-password');

      if (!user) {
        handleError(next, STATUS_CODES.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
      }
      if (roles.length && !roles.includes(user.role)) {
        return handleError(next, STATUS_CODES.FORBIDDEN, MESSAGES.FORBIDDEN);
      }

      req.user = user;

      next();
    } catch {
      handleError(next, STATUS_CODES.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }
  });
