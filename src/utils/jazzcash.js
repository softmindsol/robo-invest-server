import pkg from 'jazzcash-checkout';
import { createHash } from 'crypto';

const { credentials, setData, createRequest } = pkg;

// Validate environment variables
const requiredEnvVars = ['JAZZCASH_MERCHANT_ID', 'JAZZCASH_PASSWORD', 'JAZZCASH_INTEGRITY_SALT'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// Initialize JazzCash with credentials from environment variables
credentials({
  config: {
    merchantId: process.env.JAZZCASH_MERCHANT_ID,
    password: process.env.JAZZCASH_PASSWORD,
    hashKey: process.env.JAZZCASH_INTEGRITY_SALT,
  },
  environment: process.env.JAZZCASH_ENVIRONMENT || 'sandbox', // 'sandbox' or 'live'
});

// Helper function to generate a unique transaction reference number
const generateTxnRefNo = () => {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '');
  return `T${timestamp}`;
};

// Function to generate JazzCash payload
const generateJazzcashPayload = async (amount, billReference = 'billRef123') => {
  const data = {
    pp_Version: '1.1',
    pp_TxnType: 'CARD',
    pp_Language: 'EN',
    pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,
    pp_SubMerchantId: '',
    pp_TxnRefNo: generateTxnRefNo(),
    pp_Amount: (amount * 100).toString(), // Convert to paisa (e.g., 1000 PKR = 100000 paisa)
    pp_TxnCurrency: 'PKR',
    pp_TxnDateTime: new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14),
    pp_BillReference: billReference,
    pp_Description: 'Payment for Tijori Invest',
    pp_TxnExpiryDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, 14), // 3 days expiry
    pp_ReturnURL: process.env.JAZZCASH_RETURN_URL, // Your callback URL
    ppmpf_1: 'Tijori Invest',
    ppmpf_2: '',
    ppmpf_3: '',
    ppmpf_4: '',
    ppmpf_5: '',
  };

  // Set data in jazzcash-checkout
  setData(data);

  // Generate secure hash using createRequest for PAY
  const payload = await createRequest('PAY');

  return payload;
};

export { generateJazzcashPayload };