import { STATUS_CODES } from '../../constants/index.js';
import { createOTPWithExpiry } from '../../helper/generateOtp.js';
import { UserService } from '../../services/auth/user.service.js';
import { PasswordService } from '../../services/auth/password.service.js';
import {
  asyncHandler,
  checkField,
  sendEmail,
  sendResponse
} from '../../utils/index.js';
import { generateOtpEmail } from '../../helper/emailTemplates.js';

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await UserService.findUserByEmail(email);
  checkField(!user, 'User not found', STATUS_CODES.NOT_FOUND);

  const { otp, expiry } = createOTPWithExpiry();

  if (!user.resetPassword) {
    user.resetPassword = {};
  }

  user.resetPassword = { otp, expiry, verified: false };

  await sendEmail({
    to: email,
    subject: 'Reset Your Password - Tijori',
    htmlContent: generateOtpEmail(otp)
  });

  await user.save();

  sendResponse(res, STATUS_CODES.SUCCESS, `OTP sent to ${email}`, {
    otp
  });
});

export const verifyResetOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await UserService.findUserByEmail(email);
  checkField(!user, 'User not found', STATUS_CODES.NOT_FOUND);

  checkField(
    !user.resetPassword?.otp ||
      user.resetPassword.otp !== otp ||
      user.resetPassword.expiry < new Date(),
    'Invalid or expired OTP'
  );

  user.resetPassword.verified = true;
  user.resetPassword.otp = null;
  user.resetPassword.expiry = null;
  user.resetPassword.updatedAt = new Date();

  await user.save();

  sendResponse(res, STATUS_CODES.SUCCESS, 'OTP verified successfully');
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await UserService.findUserByEmail(email);
  checkField(!user, 'User not found', STATUS_CODES.NOT_FOUND);

  checkField(
    !user.resetPassword?.verified,
    'OTP not verified or invalid request'
  );

  // Use PasswordService to reset password with validation
  await PasswordService.resetPassword(user, newPassword);

  user.resetPassword = undefined;

  sendResponse(res, STATUS_CODES.SUCCESS, 'Password reset successful');
});
