import { Router } from 'express';
import { ROLES } from '../../constants/index.js';
import { subscribeToPlan } from '../../controllers/payment/subscription.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import addValidation from '../../utils/addValidation.js';
import { subscribeToPlanSchema } from '../../schemas/payment.validator.js';

const router = new Router();

router.post(
  '/subscribe-plan',
  verifyJWT([ROLES.USER]),
  addValidation(subscribeToPlanSchema),
  subscribeToPlan
);

export default router;
