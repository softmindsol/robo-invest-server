import { SubscriptionService } from '../../services/payment/subscription.service.js';
import { UserService } from '../../services/auth/user.service.js';
import { asyncHandler, checkField, sendResponse } from '../../utils/index.js';
import { STATUS_CODES } from '../../constants/index.js';

export const subscribeToPlan = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { planName, interval } = req.body;

  await UserService.findUserById(userId);

  await SubscriptionService.getPriceId(planName, interval);

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

  const newSubscription = await SubscriptionService.createSubscription(
    userId,
    planName,
    interval
  );

  await UserService.updateUserDetails(userId, {
    subscription: newSubscription._id
  });

  sendResponse(
    res,
    STATUS_CODES.CREATED,
    `Subscribed to ${planName} (${interval})`
  );
});
