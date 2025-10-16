import Subscription from '../../models/subscription.model.js';
import { checkField } from '../../utils/index.js';
import { PLAN_PRICE_IDS } from '../../constants/index.js';
import dayjs from 'dayjs';

export class SubscriptionService {
  /**
   * @desc Get price ID (and optionally amount) for the plan + interval
   */
  static async getPriceId(planName, interval) {
    const key = `${planName.replace(' ', '_').toUpperCase()}_${interval.toUpperCase()}`;
    const priceId = PLAN_PRICE_IDS[key];
    checkField(!priceId, 'Invalid plan/interval combination');

    // if PLAN_PRICE_IDS maps to object, you can return amount too
    // e.g. PLAN_PRICE_IDS.ROBO_PRO_MONTHLY = { id: 'abc', amount: 1000 }
    const amount = typeof priceId === 'object' ? priceId.amount : null;

    return { priceId: typeof priceId === 'object' ? priceId.id : priceId, amount };
  }

  /**
   * @desc Get currently active (non-cancelled) subscription for user
   */
  static async getCurrentActiveSubscription(userId) {
    return await Subscription.findOne({
      user: userId,
      isActive: true,
      isCancelled: false,
      endDate: { $gte: new Date() }
    });
  }

  /**
   * @desc Cancel an existing subscription
   */
  static async cancelSubscription(subscription) {
    checkField(!subscription, 'No active subscription found to cancel.');

    subscription.isActive = false;
    subscription.isCancelled = true;
    subscription.endDate = new Date();
    return await subscription.save();
  }

  /**
   * @desc Create a new subscription (used after payment success)
   * Automatically sets start and end date
   */
  static async createSubscription(userId, planName, interval) {
    const now = dayjs();
    const endDate =
      interval?.toLowerCase() === 'yearly' ? now.add(1, 'year') : now.add(30, 'day');

    const subscription = await Subscription.create({
      user: userId,
      planName,
      interval,
      isActive: true,
      startDate: now.toDate(),
      endDate: endDate.toDate(),
      isCancelled: false
    });

    return subscription;
  }

  /**
   * @desc Renew or extend subscription duration (if user re-subscribes before expiry)
   */
  static async renewSubscription(userId, planName, interval) {
    const currentSub = await this.getCurrentActiveSubscription(userId);
    const now = dayjs();

    // If there's an active one, extend its end date
    if (currentSub) {
      const currentEnd = dayjs(currentSub.endDate);
      const newEnd =
        interval?.toLowerCase() === 'yearly'
          ? currentEnd.add(1, 'year')
          : currentEnd.add(30, 'day');

      currentSub.endDate = newEnd.toDate();
      await currentSub.save();
      return currentSub;
    }

    // Otherwise, create a new subscription
    return await this.createSubscription(userId, planName, interval);
  }

  /**
   * @desc Deactivate expired subscriptions (can be run in a daily cron job)
   */
  static async deactivateExpiredSubscriptions() {
    const result = await Subscription.updateMany(
      {
        isActive: true,
        isCancelled: false,
        endDate: { $lt: new Date() }
      },
      { $set: { isActive: false } }
    );
    return result;
  }
}
