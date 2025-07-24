import { Router } from 'express';
import { addValidation } from '../utils/index.js';
import {
  accountTypeSchema,
  beneficiariesSchema,
  changePasswordSchema,
  financialDetailsSchema,
  forgotPasswordSchema,
  investmentGoalsSchema,
  loginSchema,
  personalDetailsSchema,
  registerSchema,
  resetPasswordSchema,
  termsValidationSchema,
  verifyEmailSchema
} from '../schemas/auth.validator.js';
import {
  addAccountType,
  addBeneficiaryDetails,
  addFinancialDetails,
  addInvestmentGoals,
  addPersonalDetails,
  addTermsAcceptance,
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
import {
  injectAccountType,
  multipleUpload,
  rateLimiter,
  verifyJWT
} from '../middlewares/index.js';
import { ROLES } from '../constants/index.js';

const router = new Router();

router.post('/register', addValidation(registerSchema), register);
router.post('/verify-email', addValidation(verifyEmailSchema), verifyEmail);

router.post('/resend-otp', verifyJWT(ROLES.USER), rateLimiter, resendOTP);

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

router.post(
  '/financial-details',
  verifyJWT([ROLES.USER]),
  injectAccountType,
  multipleUpload('documents').fields([
    { name: 'proofOfIncome', maxCount: 1 },
    { name: 'proofOfEmployment', maxCount: 1 },
    { name: 'companyLetterHead', maxCount: 1 }
  ]),
  addValidation(financialDetailsSchema, (req) => {
    return { accountType: req.user.accountType };
  }),
  addFinancialDetails
);

router.post(
  '/beneficiaries',
  verifyJWT([ROLES.USER]),
  injectAccountType,
  multipleUpload('documents').fields([
    { name: 'uploadFrontSideOfCNIC', maxCount: 1 },
    { name: 'uploadBackSideOfCNIC', maxCount: 1 },
    {
      name: 'uploadMainPassportPage',
      maxCount: 1
    }
  ]),
  addValidation(beneficiariesSchema, (req) => ({
    accountType: req.user.accountType
  })),
  addBeneficiaryDetails
);

router.post(
  '/investment-goals',
  verifyJWT([ROLES.USER]),
  addValidation(investmentGoalsSchema),
  addInvestmentGoals
);

router.post(
  '/terms-acceptance',
  verifyJWT([ROLES.USER]),
  addValidation(termsValidationSchema),
  addTermsAcceptance
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
