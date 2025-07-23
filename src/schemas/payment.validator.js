import Joi from 'joi';
import { SUBSCRIPTION_PLANS } from '../constants';

export const subscribeToPlanSchema = Joi.object({
  planName: Joi.string()
    .valid(SUBSCRIPTION_PLANS.ROBO_PRO, SUBSCRIPTION_PLANS.ROBO_ELITE)
    .required(),
  interval: Joi.string().valid('Monthly', 'Yearly').required()
});
