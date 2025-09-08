import { register, verifyEmail, resendOTP } from './register.controller.js';
import { login, logout } from './login.controller.js';
import {
  forgotPassword,
  verifyResetOTP,
  resetPassword
} from './reset-password.controller.js';
import { changePassword } from './change-password.controller.js';

export {
  register,
  login,
  logout,
  verifyEmail,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  changePassword
};
