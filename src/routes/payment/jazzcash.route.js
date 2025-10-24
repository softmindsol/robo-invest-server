import express from 'express';
import { handleJazzcashCallback, initiateJazzcashPayment } from '../../controllers/payment/jazzcash.controller.js';

const router = express.Router();

router.post('', initiateJazzcashPayment);
router.post('/callback', handleJazzcashCallback);

export default router;
