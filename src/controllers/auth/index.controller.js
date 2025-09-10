import { register, verifyEmail, resendOTP } from './register.controller.js';
import { login, logout } from './login.controller.js';
import {
  forgotPassword,
  verifyResetOTP,
  resetPassword
} from './reset-password.controller.js';
import { changePassword } from './change-password.controller.js';
import { kycStepsWithUploads } from './kyc.controller.js';

export {
  register,
  login,
  logout,
  kycStepsWithUploads,
  verifyEmail,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  changePassword
};
