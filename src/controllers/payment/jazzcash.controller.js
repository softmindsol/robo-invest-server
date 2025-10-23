import { generateJazzcashPayload } from '../utils/../../utils/jazzcash.js';

export const initiateJazzcashPayment = async (req, res) => {
  try {
    const { amount=1000 } = req.body;
    const payload = generateJazzcashPayload(amount);
    console.log("🚀 ~ initiateJazzcashPayment ~ payload:", payload)

    return res.status(200).json({
      success: true,
      postUrl: process.env.JAZZCASH_POST_URL,
      payload,
    });
  } catch (error) {
    console.error('Jazzcash Payment Error:', error);
    res.status(500).json({ success: false, message: 'Payment initiation failed' });
  }
};
