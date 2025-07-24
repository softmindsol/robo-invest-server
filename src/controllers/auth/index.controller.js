import { register, verifyEmail, resendOTP } from './register.controller.js';
import { login, logout } from './login.controller.js';
import {
  forgotPassword,
  verifyResetOTP,
  resetPassword
} from './reset-password.controller.js';
import { changePassword } from './change-password.controller.js';
import {
  addAccountType,
  addPersonalDetails,
  addFinancialDetails,
  addBeneficiaryDetails,
  addInvestmentGoals,
  addTermsAcceptance
} from './profile.controller.js';

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
  resetPassword,
  changePassword,
  addTermsAcceptance
};
