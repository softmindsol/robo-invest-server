import { Router } from 'express';
import { addValidation } from '../utils/index.js';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema
} from '../schemas/auth.validator.js';
import {
  changePassword,
  forgotPassword,
  kycSteps,
  login,
  logout,
  register,
  resendOTP,
  resetPassword,
  verifyEmail,
  verifyResetOTP
} from '../controllers/auth/index.controller.js';
import { rateLimiter, verifyJWT } from '../middlewares/index.js';
import { ROLES } from '../constants/index.js';
import { kycStepsSchema } from '../schemas/kyc.validator.js';

const router = new Router();

router.post('/register', addValidation(registerSchema), register);
router.post('/verify-email', addValidation(verifyEmailSchema), verifyEmail);

router.post('/resend-otp', verifyJWT(ROLES.USER), rateLimiter, resendOTP);

router.post(
  '/kyc-steps',
  verifyJWT([ROLES.USER]),
  addValidation(kycStepsSchema()),
  kycSteps
);

router.post('/login', addValidation(loginSchema), login);
router.post('/logout', verifyJWT([ROLES.USER]), logout);

router.post(
  '/change-password',
  verifyJWT([ROLES.USER]),
  addValidation(changePasswordSchema),
  changePassword
);

router.post(
  '/forgot-password',
  addValidation(forgotPasswordSchema),
  forgotPassword
);
router.post(
  '/verify-reset-otp',
  addValidation(verifyEmailSchema),
  rateLimiter,
  verifyResetOTP
);
router.post(
  '/reset-password',
  addValidation(resetPasswordSchema),
  resetPassword
);

export default router;
