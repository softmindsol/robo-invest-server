import { Router } from 'express';
import { addValidation } from '../../utils/index.js';
import { verifyJWT, multipleUpload } from '../../middlewares/index.js';
import { ROLES } from '../../constants/index.js';
import {
  getUserProfile,
  updateInvestmentRisk,
  updatePersonalInformation
} from '../../controllers/user/profile.controller.js';
import {
  updateInvestmentRiskSchema,
  updatePersonalInfoSchema
} from '../../schemas/profile.validator.js';

const router = new Router();

router.get('/', verifyJWT([ROLES.USER]), getUserProfile);

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

router.patch(
  '/risk',
  verifyJWT([ROLES.USER]),
  addValidation(updateInvestmentRiskSchema),
  updateInvestmentRisk
);

export default router;
