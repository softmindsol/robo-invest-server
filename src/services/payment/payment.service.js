import { Payment } from '../../models/payment.model.js';

export const PaymentService = {
  /**
   * @desc Create a new pending payment record
   */
  async createTransaction(data) {
    const payment = await Payment.create(data);
    return payment;
  },

  /**
   * @desc Store or update PayFast access token
   */
  async storeAccessToken(basketId, tokenData) {
    const updated = await Payment.findOneAndUpdate(
      { basketId },
      {
        accessToken: tokenData.ACCESS_TOKEN,
        tokenExpiry: tokenData.EXPIRES_IN
      },
      { new: true, upsert: true }
    );
    return updated;
  },

  /**
   * @desc Update transaction status after IPN callback
   */
  async updateTransactionStatus({ basketId, errCode, isValid, amount, rawPayload }) {
    const status = errCode === '000' || errCode === '00' ? 'success' : 'failed';

    const updated = await Payment.findOneAndUpdate(
      { basketId },
      {
        status,
        isValid,
        errCode,
        amount,
        rawPayload,
        validatedAt: new Date()
      },
      { new: true }
    );

    return updated;
  },

  /**
   * @desc Get payment by basket ID
   */
  async getPaymentByBasketId(basketId) {
    return await Payment.findOne({ basketId });
  }
};
