import { Router } from 'express';
import { addValidation } from '../utils/index.js';
import {
  loginSchema,
  registerSchema,
  resendOTPSchema,
  verifyEmailSchema
} from '../schemas/auth.validator.js';
import {
  login,
  logout,
  register,
  resendOTP,
  verifyEmail
} from '../controllers/auth.controller.js';
import { rateLimiter, verifyJWT } from '../middlewares/index.js';

const router = new Router();

router.post('/register', addValidation(registerSchema), register);
router.post('/verify-email', addValidation(verifyEmailSchema), verifyEmail);
router.post(
  '/resend-otp',
  addValidation(resendOTPSchema),
  rateLimiter,
  resendOTP
);
router.post('/login', addValidation(loginSchema), login);
router.post('/logout', verifyJWT(), logout);

export default router;
