import crypto from 'crypto';
import moment from 'moment';

export const generateJazzcashPayload = (amount, billReference = 'Ref001') => {
  const {
    JAZZCASH_MERCHANT_ID,
    JAZZCASH_PASSWORD,
    JAZZCASH_INTEGRITY_SALT,
    JAZZCASH_RETURN_URL
  } = process.env;

  const datetime = moment().format('YYYYMMDDHHmmss');

  const payload = {
    pp_Version: '1.1',
    pp_TxnType: 'CARD',
    pp_Language: 'EN',
    pp_MerchantID: JAZZCASH_MERCHANT_ID,
    pp_Password: JAZZCASH_PASSWORD, // required in payload but NOT in hash
    pp_TxnRefNo: `T${datetime}`,
    pp_Amount: (amount * 100).toString(), // in paisa (string)
    pp_TxnCurrency: 'PKR',
    pp_TxnDateTime: datetime,
    pp_BillReference: billReference,
    pp_Description: 'Payment through JazzCash',
    pp_ReturnURL: JAZZCASH_RETURN_URL,
    ppmpf_1: 'Tijori Invest'
  };

  // Fields for hash — do NOT include pp_Password or empty fields
  const fieldsForHash = [
    'pp_Amount',
    'pp_BillReference',
    'pp_Description',
    'pp_Language',
    'pp_MerchantID',
    'pp_ReturnURL',
    'pp_TxnCurrency',
    'pp_TxnDateTime',
    'pp_TxnRefNo',
    'pp_TxnType',
    'pp_Version',
    'ppmpf_1'
  ];

  const hashString =
    JAZZCASH_INTEGRITY_SALT +
    '&' +
    fieldsForHash
      .map((field) => payload[field])
      .filter((v) => v !== undefined && v !== null && v !== '')
      .join('&');

  const secureHash = crypto
    .createHash('sha256')
    .update(hashString)
    .digest('hex')
    .toUpperCase();

  payload.pp_SecureHash = secureHash;

  return payload;
};
