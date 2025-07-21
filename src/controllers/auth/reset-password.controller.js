import { STATUS_CODES } from '../../constants/index.js';
import { createOTPWithExpiry } from '../../helper/generateOtp.js';
import User from '../../models/user.model.js';
import {
  asyncHandler,
  checkField,
  //   sendEmail,
  sendResponse
} from '../../utils/index.js';
// import { generateOtpEmail } from '../../helper/emailTemplates.js';

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  checkField(!user, 'User not found', STATUS_CODES.NOT_FOUND);

  const { otp, expiry } = createOTPWithExpiry();

  if (!user.resetPassword) {
    user.resetPassword = {};
  }

  user.resetPassword = { otp, expiry, verified: false };

  //   await sendEmail({
  //     to: email,
  //     subject: 'Reset Your Password - Tijori',
  //     htmlContent: generateOtpEmail(otp)
  //   });

  await user.save();

  sendResponse(res, STATUS_CODES.SUCCESS, `OTP sent to ${email}`, {
    otp
  });
});

export const verifyResetOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
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

  const user = await User.findOne({ email });
  checkField(!user, 'User not found', STATUS_CODES.NOT_FOUND);

  checkField(
    !user.resetPassword?.verified,
    'OTP not verified or invalid request'
  );

  user.password = newPassword;
  user.resetPassword = undefined;
  await user.save();

  sendResponse(res, STATUS_CODES.SUCCESS, 'Password reset successful');
});
