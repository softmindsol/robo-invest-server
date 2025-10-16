import { Router } from 'express';
import { ROLES } from '../../constants/index.js';

import { verifyJWT } from '../../middlewares/auth.middleware.js';
import addValidation from '../../utils/addValidation.js';
import { subscribeToPlanSchema } from '../../schemas/payment.validator.js';
import express from 'express';
import { handlePayfastSubscriptionIPN, subscribeViaPayfast } from '../../controllers/payment/subscription.controller.js';

const router = new Router();

/**
 * @route   POST /api/payment/subscribe-plan
 * @desc    Initiate PayFast payment for subscription plan
 * @access  User
 */
router.post(
  '/subscribe-plan',
  verifyJWT([ROLES.USER]),
  addValidation(subscribeToPlanSchema),
  subscribeViaPayfast
);

/**
 * @route   POST /api/payment/ipn
 * @desc    Handle PayFast IPN (server-to-server notification)
 * @access  Public (PayFast gateway)
 */
router.post('/ipn', express.urlencoded({ extended: true }), handlePayfastSubscriptionIPN);

export default router;
