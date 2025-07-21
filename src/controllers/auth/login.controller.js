import {
  asyncHandler,
  checkField,
  handleError,
  sendResponse
} from '../../utils/index.js';
import { userDB } from '../../instances/db.instance.js';
import { STATUS_CODES } from '../../constants/index.js';
import { UserService } from '../../services/auth/user.service.js';

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserService.findUserByEmail(email, true);
  checkField(!user, 'Invalid email or password');

  checkField(!user.emailVerification?.isVerified, 'Email not verified');

  if (user.isAccountLocked()) {
    handleError(
      next,
      STATUS_CODES.FORBIDDEN,
      'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
    );
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  const loginSuccess = await UserService.handleLoginAttempt(
    user,
    isPasswordCorrect
  );

  if (!loginSuccess) {
    checkField(!isPasswordCorrect, 'Invalid email or password');
  }

  const accessToken = await UserService.generateAndSaveToken(user);

  sendResponse(res, STATUS_CODES.SUCCESS, 'User logged in successfully', {
    accessToken
  });
});

export const logout = asyncHandler(async (req, res) => {
  const accessToken = req?.headers['authorization']?.split(' ')[1];
  const userId = req.user._id;

  checkField(!accessToken, 'You are already logged out');

  const user = await userDB.removeAccessToken(userId, accessToken);

  checkField(!user, 'User not found or session expired');

  sendResponse(res, STATUS_CODES.SUCCESS, 'User Logged out Successfully');
});
