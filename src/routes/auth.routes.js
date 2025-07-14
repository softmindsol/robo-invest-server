import { Router } from 'express';
import { addValidation } from '../utils/index.js';
import { loginSchema, registerSchema } from '../schemas/auth.validator.js';
import {
  login,
  logout,
  register,
  resendOTP,
  verifyEmail
} from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/index.js';

const router = new Router();

router.post('/register', addValidation(registerSchema), register);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOTP);
router.post('/login', addValidation(loginSchema), login);
router.post('/logout', verifyJWT(), logout);

export default router;
