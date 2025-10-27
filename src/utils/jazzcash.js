import crypto from 'crypto';
import { format } from 'date-fns';

const JAZZCASH_MERCHANT_ID = process.env.JAZZCASH_MERCHANT_ID;
const JAZZCASH_PASSWORD = process.env.JAZZCASH_PASSWORD;
const JAZZCASH_RETURN_URL =
  'https://api.tijoriinvest.pk/api/v1/jazzcash/callback';
const JAZZCASH_INTEGRITY_SALT = process.env.JAZZCASH_INTEGRITY_SALT;

export function getJazzcashPayload(productName, productPrice = 100) {
  // ERROR FIX 1: Convert amount to paisa/cents
  const amountInPaisa = parseInt(productPrice, 10) * 100;
  const now = new Date();
  const pp_TxnDateTime = format(now, 'yyyyMMddHHmmss');
  const expiryDateTime = new Date(now.getTime() + 60 * 60 * 1000); // Add 1 hour
  const pp_TxnExpiryDateTime = format(expiryDateTime, 'yyyyMMddHHmmss');
  const pp_TxnRefNo = 'T' + pp_TxnDateTime;

  const post_data = {
    pp_Version: '1.1',
    pp_TxnType: '',
    pp_Language: 'EN',
    pp_MerchantID: JAZZCASH_MERCHANT_ID,
    pp_SubMerchantID: '',
    pp_Password: JAZZCASH_PASSWORD,
    pp_UsageMode: 'SB',
    pp_BankID: 'TBANK',
    pp_ProductID: 'RETL',
    pp_TxnRefNo: pp_TxnRefNo,
    pp_Amount: amountInPaisa.toString(), // Use the corrected amount
    pp_TxnCurrency: 'PKR',
    pp_TxnDateTime: pp_TxnDateTime,
    pp_BillReference: 'billRef',
    pp_Description: 'Description of transaction',
    pp_TxnExpiryDateTime: pp_TxnExpiryDateTime,
    pp_ReturnURL: JAZZCASH_RETURN_URL,
    // pp_SecureHash will be added below
    ppmpf_1: '1',
    ppmpf_2: '2',
    ppmpf_3: '3',
    ppmpf_4: '4',
    ppmpf_5: '5'
  };

  // ERROR FIX 2: Correct hash generation logic for v1.1

  // 1. Get all keys from the data object, excluding pp_SecureHash
  const keys = Object.keys(post_data);

  // 2. Sort the keys alphabetically
  keys.sort();

  // 3. Build the string by starting with the Salt and appending the VALUE of each sorted key.
  let stringToHash = JAZZCASH_INTEGRITY_SALT;
  for (const key of keys) {
    const value = post_data[key];
    if (value !== null && value !== '') {
      stringToHash += '&' + value;
    }
  }

  // 4. Create the HMAC SHA256 hash
  const hmac = crypto.createHmac('sha256', JAZZCASH_INTEGRITY_SALT);
  hmac.update(stringToHash);
  const calculatedHash = hmac.digest('hex').toUpperCase();

  // 5. Add the secure hash to a new payload object to be returned
  const final_payload = { ...post_data, pp_SecureHash: calculatedHash };

  return final_payload;
}
