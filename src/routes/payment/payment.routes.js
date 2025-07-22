import { Router } from 'express';
import { ROLES } from '../../constants/index.js';
import { subscribeToPlan } from '../../controllers/payment/subscription.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const router = new Router();

router.post('/subscribe-plan', verifyJWT([ROLES.USER]), subscribeToPlan);

export default router;
