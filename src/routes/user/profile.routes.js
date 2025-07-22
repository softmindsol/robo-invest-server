import { Router } from 'express';
import { addValidation } from '../../utils/index.js';
import { verifyJWT, multipleUpload } from '../../middlewares/index.js';
import { ROLES } from '../../constants/index.js';
import {
  getUserProfile,
  updatePersonalInformation,
  updateContactInformation,
  updateFinancialInformation,
  updateBeneficiaryInformation,
  updateInvestmentGoals,
  getProfileCompletion
} from '../../controllers/user/profile.controller.js';
import {
  updatePersonalInfoSchema,
  updateContactInfoSchema,
  updateFinancialInfoSchema,
  updateBeneficiaryInfoSchema,
  updateInvestmentGoalsSchema
} from '../../schemas/profile.validator.js';

const router = new Router();

// Get complete user profile
router.get('/', verifyJWT([ROLES.USER]), getUserProfile);

// Get profile completion status
router.get('/completion', verifyJWT([ROLES.USER]), getProfileCompletion);

// Update personal information
router.put(
  '/personal',
  verifyJWT([ROLES.USER]),
  multipleUpload('documents').fields([
    { name: 'frontSide', maxCount: 1 },
    { name: 'backSide', maxCount: 1 }
  ]),
  addValidation(updatePersonalInfoSchema),
  updatePersonalInformation
);

// Update contact information
router.put(
  '/contact',
  verifyJWT([ROLES.USER]),
  addValidation(updateContactInfoSchema),
  updateContactInformation
);

// Update financial information
router.put(
  '/financial',
  verifyJWT([ROLES.USER]),
  multipleUpload('documents').fields([
    { name: 'proofOfIncome', maxCount: 1 },
    { name: 'proofOfEmployment', maxCount: 1 },
    { name: 'companyLetterHead', maxCount: 1 }
  ]),
  addValidation(updateFinancialInfoSchema, (req) => ({
    accountType: req.user.accountType
  })),
  updateFinancialInformation
);

// Update beneficiary information
router.put(
  '/beneficiary',
  verifyJWT([ROLES.USER]),
  multipleUpload('documents').fields([
    { name: 'uploadFrontSideOfCNIC', maxCount: 1 },
    { name: 'uploadBackSideOfCNIC', maxCount: 1 },
    { name: 'uploadMainPassportPage', maxCount: 1 }
  ]),
  addValidation(updateBeneficiaryInfoSchema, (req) => ({
    accountType: req.user.accountType
  })),
  updateBeneficiaryInformation
);

// Update investment goals
router.put(
  '/investment-goals',
  verifyJWT([ROLES.USER]),
  addValidation(updateInvestmentGoalsSchema),
  updateInvestmentGoals
);

export default router;