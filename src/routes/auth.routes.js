import { Router } from 'express';
import { addValidation } from '../utils/index.js';
import {
  accountTypeSchema,
  loginSchema,
  personalDetailsSchema,
  registerSchema,
  resendOTPSchema,
  verifyEmailSchema
} from '../schemas/auth.validator.js';
import {
  addAccountType,
  addPersonalDetails,
  login,
  logout,
  register,
  resendOTP,
  verifyEmail
} from '../controllers/auth.controller.js';
import {
  multipleUpload,
  rateLimiter,
  verifyJWT
} from '../middlewares/index.js';
import { ROLES } from '../constants/index.js';

const router = new Router();

router.post('/register', addValidation(registerSchema), register);
router.post('/verify-email', addValidation(verifyEmailSchema), verifyEmail);

router.post(
  '/resend-otp',
  addValidation(resendOTPSchema),
  rateLimiter,
  resendOTP
);

router.post(
  '/account-type',
  addValidation(accountTypeSchema),
  verifyJWT([ROLES.USER]),
  addAccountType
);

router.post(
  '/personal-details',
  verifyJWT([ROLES.USER]),
  multipleUpload('documents').fields([
    { name: 'frontSide', maxCount: 1 },
    { name: 'backSide', maxCount: 1 }
  ]),
  addValidation(personalDetailsSchema),
  addPersonalDetails
);

router.post('/login', addValidation(loginSchema), login);
router.post('/logout', verifyJWT([ROLES.USER]), logout);

export default router;
