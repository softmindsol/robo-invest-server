import { STATUS_CODES } from '../constants/index.js';
import { UserService } from '../services/auth/user.service.js';
import { asyncHandler, checkField, handleError } from '../utils/index.js';

export const checkAccountLock = async (req, _, next) => {
  const user = req.user;

  checkField(!user, 'User not found', STATUS_CODES.NOT_FOUND);

  if (user.isAccountLocked()) {
    const lockDuration = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
    handleError(
      next,
      STATUS_CODES.FORBIDDEN,
      `Account is temporarily locked due to multiple failed login attempts. Please try again in ${lockDuration} minutes.`
    );
  }

  next();
};

export const injectAccountType = asyncHandler(async (req, _, next) => {
  const userId = req.user._id;
  const user = await UserService.findUserById(userId);

  checkField(
    !user.accountType,
    'Account type required before adding other details'
  );

  next();
});
