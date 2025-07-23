import Subscription from '../../models/subscription.model.js';
import { checkField } from '../../utils/index.js';
import { PLAN_PRICE_IDS } from '../../constants/index.js';

export class SubscriptionService {
  static async getPriceId(planName, interval) {
    const key = `${planName.replace(' ', '_').toUpperCase()}_${interval.toUpperCase()}`;
    const priceId = PLAN_PRICE_IDS[key];
    checkField(!priceId, 'Invalid plan/interval combination');
    return priceId;
  }

  static async getCurrentActiveSubscription(userId) {
    return await Subscription.findOne({ user: userId, isActive: true });
  }

  static async cancelSubscription(subscription) {
    subscription.isActive = false;
    subscription.endDate = new Date();
    subscription.isCancelled = true;
    return await subscription.save();
  }

  static async createSubscription(userId, planName, interval) {
    return await Subscription.create({
      user: userId,
      planName,
      interval,
      isActive: true,
      startDate: new Date()
    });
  }
}
