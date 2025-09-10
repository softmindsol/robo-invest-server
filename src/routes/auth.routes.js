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
import { upload } from '../utils/cloudinary.js';
import { kycStepsWithUploads } from '../controllers/auth/kyc.controller.js';
import { coerceMultipartJson } from '../middlewares/util.middleware.js';

const router = new Router();

router.post('/register', addValidation(registerSchema), register);
router.post('/verify-email', addValidation(verifyEmailSchema), verifyEmail);

router.post('/resend-otp', verifyJWT(ROLES.USER), rateLimiter, resendOTP);

const kycFileFields = [
  { name: 'personal_cnicFront', maxCount: 1 },
  { name: 'personal_cnicBack', maxCount: 1 },
  { name: 'financial_proofOfIncome', maxCount: 1 },
  { name: 'financial_proofOfEmployment', maxCount: 1 },
  { name: 'financial_companyLetterhead', maxCount: 1 },
  { name: 'beneficiary_cnicFront', maxCount: 1 },
  { name: 'beneficiary_cnicBack', maxCount: 1 },
  { name: 'beneficiary_passportUpload', maxCount: 1 }
];

router.post(
  '/kyc-steps',
  verifyJWT([ROLES.USER]),
  upload.fields(kycFileFields),
  coerceMultipartJson([
    'accountType',
    'personal',
    'financial',
    'beneficiary',
    'investment'
  ]),
  addValidation(kycStepsSchema()),
  kycStepsWithUploads
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
