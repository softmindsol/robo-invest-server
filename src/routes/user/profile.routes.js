import { Router } from 'express';
import { addValidation } from '../../utils/index.js';
import { verifyJWT, multipleUpload } from '../../middlewares/index.js';
import { ROLES } from '../../constants/index.js';
import {
  getUserProfile,
  updatePersonalInformation,
  getProfileCompletion
} from '../../controllers/user/profile.controller.js';
import { updatePersonalInfoSchema } from '../../schemas/profile.validator.js';

const router = new Router();

router.get('/', verifyJWT([ROLES.USER]), getUserProfile);

router.get('/completion', verifyJWT([ROLES.USER]), getProfileCompletion);

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

export default router;
