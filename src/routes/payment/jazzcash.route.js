import express from 'express';
import { initiateJazzcashPayment } from '../../controllers/payment/jazzcash.controller.js';

const router = express.Router();

router.post('', initiateJazzcashPayment);
router.post('/callback', (req, res) => {
  console.log('JazzCash callback:', req.body);
  // Verify hash, update DB, etc.
  res.send('Payment received!');
});

export default router;
