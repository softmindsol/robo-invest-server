import { SubscriptionService } from '../../services/payment/subscription.service.js';
import { UserService } from '../../services/auth/user.service.js';
import { asyncHandler, checkField, sendResponse } from '../../utils/index.js';
import { STATUS_CODES } from '../../constants/index.js';
import axios from 'axios';
import qs from 'querystring';
import { PaymentService } from '../../services/payment/payment.service.js';
import crypto from 'crypto';

const MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID;
const SECURED_KEY = process.env.PAYFAST_SECURED_KEY;
const TOKEN_URL = process.env.PAYFAST_TOKEN_URL;
const POST_URL = process.env.PAYFAST_POST_URL;

/**
 * @desc Subscribe user via PayFast (creates a payment request for plan)
 */
export const subscribeViaPayfast = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { planName, interval } = req.body;

  const user = await UserService.findUserById(userId);
  const priceDetails = await SubscriptionService.getPriceId(planName, interval);

  const currentSub =
    await SubscriptionService.getCurrentActiveSubscription(userId);

  checkField(
    currentSub &&
      currentSub.planName === planName &&
      currentSub.interval === interval,
    `You are already subscribed to ${planName} (${interval})`
  );

  if (currentSub) {
    await SubscriptionService.cancelSubscription(currentSub);
  }

  const basketId = `sub_${userId}_${Date.now()}`;

  const amount = priceDetails.amount || 0;
  checkField(!amount, 'Invalid plan amount.');

  const txnamt = String(amount);

  const tokenResponse = await axios.post(
    TOKEN_URL,
    qs.stringify({
      MERCHANT_ID,
      SECURED_KEY,
      BASKET_ID: basketId,
      TXNAMT: txnamt,
      CURRENCY_CODE: 'PKR'
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Tijori/1.0 (PayFast Integration)'
      }
    }
  );
  console.log('🚀 ~ tokenResponse:', tokenResponse);

  const token = tokenResponse?.data?.ACCESS_TOKEN;
  checkField(!token, 'Failed to generate PayFast access token.');

  await PaymentService.createTransaction({
    user: userId,
    basketId,
    amount,
    status: 'pending',
    token,
    planName,
    interval
  });

  const signatureData = [MERCHANT_ID, token, txnamt, SECURED_KEY].join('|');
  const SIGNATURE = Math.random().toString(36).slice(2, 15);

  const formFields = {
    MERCHANT_ID,
    MERCHANT_NAME: 'Tijori',
    TOKEN: token,
    PROCCODE: '00',
    TXNAMT: txnamt,
    CURRENCY_CODE: 'PKR',
    CUSTOMER_MOBILE_NO: user.personalDetails?.phoneNumber || '0302886109',
    SIGNATURE: SIGNATURE,
    VERSION: 'MERCHANTCART-0.1',
    TXNDESC: `${planName} (${interval}) subscription`,
    SUCCESS_URL: `${process.env.CLIENT_URL}/subscription/success`,
    FAILURE_URL: `${process.env.CLIENT_URL}/subscription/failure`,
    BASKET_ID: basketId,
    CHECKOUT_URL: `${process.env.API_URL}/api/v1/payment/ipn`,
    ORDER_DATE: new Date().toISOString().slice(0, 10),
    CUSTOMER_EMAIL_ADDRESS: user.email,
    TRAN_TYPE: 'ECOMM_PURCHASE'
  };

  const inputs = Object.entries(formFields)
    .map(
      ([key, value]) =>
        `<input type="hidden" name="${key}" value="${String(value).replace(/"/g, '&quot;')}" />`
    )
    .join('\n');

  const html = `
     <p>Redirecting to PayFast...</p>
    <form id='PayFast_payment_form' name='PayFast-payment-form' method="post" action="${POST_URL}" >
      ${inputs}
      <!-- The submit button is now hidden and auto-submitted by script -->
    </form>
    <script>
      document.getElementById('PayFast_payment_form').submit();
    </script>
  `;
  console.log('🚀 ~ html:', html);

  sendResponse(res, STATUS_CODES.SUCCESS, 'Redirect to PayFast', {  });
});

/**
 * @desc Handle PayFast IPN & activate subscription after success
 */
export const handlePayfastSubscriptionIPN = asyncHandler(async (req, res) => {
  const payload = req.body;
  const { basket_id, err_code, validation_hash, transaction_amount } = payload;

  if (!basket_id || err_code === undefined || !validation_hash) {
    return sendResponse(res, STATUS_CODES.BAD_REQUEST, 'Invalid IPN payload.');
  }

  const expectedHash = crypto
    .createHash('sha256')
    .update(`${basket_id}|${SECURED_KEY}|${MERCHANT_ID}|${err_code}`)
    .digest('hex');

  const isValid = expectedHash === validation_hash;

  const updatedPayment = await PaymentService.updateTransactionStatus({
    basketId: basket_id,
    errCode: err_code,
    isValid,
    amount: transaction_amount,
    rawPayload: payload
  });

  if (isValid && (err_code === '000' || err_code === '00')) {
    const { userId, planName, interval } = updatedPayment;

    const newSubscription = await SubscriptionService.createSubscription(
      userId,
      planName,
      interval
    );

    await UserService.updateUserDetails(userId, {
      subscription: newSubscription._id
    });
  }

  res.status(200).send('OK');
});
