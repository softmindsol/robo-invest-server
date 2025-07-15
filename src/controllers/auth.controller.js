import {
  asyncHandler,
  checkField,
  handleError,
  sendResponse
} from '../utils/index.js';
import { userDB } from '../instances/db.instance.js';
import { MESSAGES, STATUS_CODES } from '../constants/index.js';
import { createOTPWithExpiry } from '../helper/generateOtp.js';
import { LOCK_TIME, MAX_LOGIN_ATTEMPTS } from '../configs/env.config.js';

const register = asyncHandler(async (req, res) => {
  const { email, username } = req.body;
  const existingEmail = await userDB.findOne({ email });
  checkField(existingEmail, 'Email already exists');

  const existingUsername = await userDB.findOne({ username });
  checkField(existingUsername, 'Username already exists');

  const user = await userDB.create(req.body);
  const { otp, expiry } = createOTPWithExpiry();

  user.emailVerification.otp = otp;
  user.emailVerification.expiry = expiry;

  await user.save();

  sendResponse(
    res,
    STATUS_CODES.CREATED,
    `Email Send Successfully on ${user.email}`,
    { otp }
  );
});

const verifyEmail = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await userDB.findOne({ email });

  if (!user) {
    handleError(next, STATUS_CODES.NOT_FOUND, MESSAGES.NOT_FOUND);
  }

  checkField(user.emailVerification.isVerified, 'Email already verified');
  checkField(
    !user.emailVerification.otp || !user.emailVerification.expiry,
    'OTP not set or expired'
  );

  checkField(user.emailVerification.expiry < new Date(), 'OTP has expired');
  checkField(user.emailVerification.otp !== otp, 'Invalid OTP');

  user.emailVerification.isVerified = true;
  user.emailVerification.otp = null;
  user.emailVerification.expiry = null;
  user.emailVerification.updatedAt = new Date();

  await user.save();

  sendResponse(res, STATUS_CODES.SUCCESS, 'Email verified successfully');
});

const resendOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await userDB.findOne({ email });

  if (!user) {
    handleError(next, STATUS_CODES.NOT_FOUND, MESSAGES.NOT_FOUND);
  }

  checkField(user.emailVerification.isVerified, 'Email already verified');

  const { otp, expiry } = createOTPWithExpiry();

  user.emailVerification.otp = otp;
  user.emailVerification.expiry = expiry;
  user.emailVerification.updatedAt = new Date();

  await user.save();

  sendResponse(res, STATUS_CODES.SUCCESS, `New OTP sent to ${user.email}`, otp);
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userDB.findOne({ email }, '+password');
  checkField(!user, 'Invalid email or password');

  if (user.isAccountLocked()) {
    handleError(
      next,
      STATUS_CODES.FORBIDDEN,
      'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
    );
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    user.loginAttempts += 1;

    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_TIME);
    }

    await user.save();
    checkField(!isPasswordCorrect, 'Invalid email or password');
  }

  user.loginAttempts = 0;
  user.lockUntil = undefined;

  const accessToken = user.generateAccessToken();
  user.accessToken.push(accessToken);

  await user.save();

  sendResponse(res, STATUS_CODES.SUCCESS, 'User logged in successfully', {
    accessToken
  });
});

const logout = asyncHandler(async (req, res) => {
  const accessToken = req?.headers['authorization']?.split(' ')[1];
  const userId = req.user._id;

  checkField(!accessToken, 'You are already logged out');

  const user = await userDB.removeAccessToken(userId, accessToken);

  checkField(!user, 'User not found or session expired');

  sendResponse(res, STATUS_CODES.SUCCESS, 'User Logged out Successfully');
});

export { register, login, logout, verifyEmail, resendOTP };
