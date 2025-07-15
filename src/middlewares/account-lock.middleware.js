import { STATUS_CODES } from '../constants/index.js';
import { handleError } from '../utils/index.js';

const checkAccountLock = async (req, _, next) => {
  const user = req.user;

  if (!user) {
    handleError(next, STATUS_CODES.NOT_FOUND, 'User not found');
  }

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

export default checkAccountLock;
