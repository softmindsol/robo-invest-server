import { PLAN_PRICE_IDS, STATUS_CODES } from '../../constants/index.js';
import { UserService } from '../../services/auth/user.service.js';
import Subscription from '../../models/subscription.model.js';
import { asyncHandler, checkField, sendResponse } from '../../utils/index.js';

export const subscribeToPlan = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { planName, interval } = req.body;

  await UserService.findUserById(userId);
  const key = `${planName.replace(' ', '_').toUpperCase()}_${interval.toUpperCase()}`;
  const priceId = PLAN_PRICE_IDS[key];

  checkField(!priceId, 'Invalid plan/interval combination');

  const currentSub = await Subscription.findOne({
    user: userId,
    isActive: true
  });

  checkField(
    currentSub &&
      currentSub.planName === planName &&
      currentSub.interval === interval,
    `You are already subscribed to ${planName} (${interval})`
  );

  if (currentSub) {
    currentSub.isActive = false;
    currentSub.endDate = new Date();
    await currentSub.save();
  }

  await Subscription.create({
    user: userId,
    planName,
    interval,
    isActive: true,
    startDate: new Date(),
    subscriptionId: priceId
  });

  sendResponse(
    res,
    STATUS_CODES.CREATED,
    `Subscribed to ${planName} (${interval})`
  );
});
