import { register, verifyEmail, resendOTP } from './auth/register.controller.js';
import { login, logout } from './auth/login.controller.js';
import {
  addAccountType,
  addPersonalDetails,
  addFinancialDetails,
  addBeneficiaryDetails
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
  addBeneficiaryDetails
};
