import { generateJazzcashPayload } from '../../utils/jazzcash.js';
import crypto from 'crypto';
export const initiateJazzcashPayment = async (req, res) => {
  try {
    const { amount = 1000, billReference = 'billRef123' } = req.body; // Allow billReference from request
    const payload = await generateJazzcashPayload(amount, billReference);
    console.log('🚀 ~ initiateJazzcashPayment ~ payload:', payload);

    return res.status(200).json({
      success: true,
      postUrl: process.env.JAZZCASH_POST_URL,
      payload
    });
  } catch (error) {
    console.error('Jazzcash Payment Error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Payment initiation failed' });
  }
};

export const handleJazzcashCallback = async (req, res) => {
  try {
    const response = req.body;
    console.log('🚀 ~ handleJazzcashCallback ~ response:', response);

    // Verify secure hash
    const sortedKeys = [
      'pp_Amount',
      'pp_AuthCode',
      'pp_BillReference',
      'pp_Language',
      'pp_MerchantID',
      'pp_ResponseCode',
      'pp_ResponseMessage',
      'pp_RetreivalReferenceNo',
      'pp_SecureHash',
      'pp_SubMerchantId',
      'pp_TxnCurrency',
      'pp_TxnDateTime',
      'pp_TxnRefNo',
      'pp_TxnType',
      'pp_Version',
      'ppmpf_1',
      'ppmpf_2',
      'ppmpf_3',
      'ppmpf_4',
      'ppmpf_5'
    ];

    let hashString = '';
    sortedKeys.forEach((key) => {
      if (response[key] && key !== 'pp_SecureHash') {
        hashString += `${response[key]}&`;
      }
    });
    hashString += process.env.JAZZCASH_INTEGRITY_SALT;

    const computedHash = crypto
      .createHash('sha256')
      .update(hashString)
      .digest('hex')
      .toUpperCase();

    if (computedHash !== response.pp_SecureHash) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid secure hash' });
    }

    // Handle response based on pp_ResponseCode
    if (response.pp_ResponseCode === '000') {
      // Success: Transaction completed
      return res
        .status(200)
        .json({ success: true, message: 'Payment successful', data: response });
    } else if (response.pp_ResponseCode === 'FE34') {
      // User cancelled transaction
      return res
        .status(200)
        .json({
          success: false,
          message: 'Payment cancelled by user',
          data: response
        });
    } else {
      // Other errors
      return res
        .status(400)
        .json({
          success: false,
          message: response.pp_ResponseMessage || 'Payment failed',
          data: response
        });
    }
  } catch (error) {
    console.error('Jazzcash Callback Error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Callback processing failed' });
  }
};
