import jwt from 'jsonwebtoken';
import {
  MESSAGES,
  ROLE_PERMISSIONS,
  STATUS_CODES
} from '../constants/index.js';
import Users from '../models/user.model.js';
import { asyncHandler, handleError } from '../utils/index.js';
import { ACCESS_TOKEN_SECRET } from '../configs/env.config.js';

export const verifyJWT = (roles = []) =>
  asyncHandler(async (req, _, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return handleError(
          next,
          MESSAGES.UNAUTHORIZED,
          STATUS_CODES.UNAUTHORIZED
        );
      }
      const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);

      const user = await Users.findById(decodedToken?._id).select('-password');

      if (!user) {
        return handleError(
          next,
          MESSAGES.UNAUTHORIZED,
          STATUS_CODES.UNAUTHORIZED
        );
      }
      if (roles.includes(user?.role)) {
        req.user = user;
        next();
      } else {
        return handleError(next, MESSAGES.FORBIDDEN, STATUS_CODES.FORBIDDEN);
      }
    } catch {
      return handleError(
        next,
        MESSAGES.UNAUTHORIZED,
        STATUS_CODES.UNAUTHORIZED
      );
    }
  });

export function checkPermission(module, action) {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.role) {
      return handleError(
        next,
        'User not authenticated or role missing',
        STATUS_CODES.UNAUTHORIZED
      );
    }

    const permissions = ROLE_PERMISSIONS[user.role];
    if (!permissions) {
      return handleError(
        next,
        'No permissions defined for this role',
        STATUS_CODES.FORBIDDEN
      );
    }

    const modulePerms = permissions.find((p) => p.startsWith(`${module}:`));
    if (!modulePerms) {
      return handleError(
        next,
        `Access denied to module: ${module}`,
        STATUS_CODES.FORBIDDEN
      );
    }

    const allowedActions = modulePerms.split(':')[1].split('/');

    if (!allowedActions.includes(action)) {
      return handleError(
        next,
        `You don't have ${action} permission on ${module}`,
        STATUS_CODES.FORBIDDEN
      );
    }

    next();
  };
}
