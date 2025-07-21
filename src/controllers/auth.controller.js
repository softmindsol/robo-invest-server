import {
  register,
  verifyEmail,
  resendOTP
} from './auth/register.controller.js';
import { login, logout } from './auth/login.controller.js';
import {
  forgotPassword,
  verifyResetOTP,
  resetPassword
} from './auth/reset-password.controller.js';
import {
  addAccountType,
  addPersonalDetails,
  addFinancialDetails,
  addBeneficiaryDetails,
  addInvestmentGoals
} from './auth/profile.controller.js';

export {
  register,
  login,
  logout,
  verifyEmail,
  resendOTP,
  addAccountType,
  addPersonalDetails,
  addFinancialDetails,
  addBeneficiaryDetails,
  addInvestmentGoals,
  forgotPassword,
  verifyResetOTP,
  resetPassword
};
