import {
  asyncHandler,
  checkField,
  sendEmail,
  sendResponse
} from '../../utils/index.js';
import { userDB } from '../../instances/db.instance.js';
import { STATUS_CODES, MESSAGES } from '../../constants/index.js';
import { createOTPWithExpiry } from '../../helper/generateOtp.js';
import { generateOtpEmail } from '../../helper/emailTemplates.js';
import { UserService } from '../../services/auth/user.service.js';

export const register = asyncHandler(async (req, res) => {
  const { email, username } = req.body;

  await UserService.checkEmailExists(email);
  await UserService.checkUsernameExists(username);

  const user = await userDB.create(req.body);
  const { otp, expiry } = createOTPWithExpiry();

  await sendEmail({
    to: user.email,
    subject: 'Your Email Verification OTP - Tijori Robo Investing',
    htmlContent: generateOtpEmail(otp)
  });

  user.emailVerification.otp = otp;
  user.emailVerification.expiry = expiry;

  await user.save();

  sendResponse(
    res,
    STATUS_CODES.CREATED,
    `Email Send Successfully on ${user.email}`
  );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await UserService.findUserByEmail(email);

  checkField(!user, MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);

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

export const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await UserService.findUserByEmail(email);

  checkField(!user, MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
  checkField(user.emailVerification.isVerified, 'Email already verified');

  const { otp, expiry } = createOTPWithExpiry();

  user.emailVerification.otp = otp;
  user.emailVerification.expiry = expiry;
  user.emailVerification.updatedAt = new Date();

  await user.save();

  sendResponse(res, STATUS_CODES.SUCCESS, `New OTP sent to ${user.email}`);
});
