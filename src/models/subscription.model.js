import { Schema, model } from 'mongoose';

export const subscriptionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscriptionId: { type: String, required: true },
  planName: { type: String, enum: ['Robo Pro', 'Robo Elite'], required: true },
  interval: { type: String, default: 'Monthly', enum: ['Monthly', 'Yearly'] },
  isActive: { type: Boolean },
  startDate: { type: Date },
  endDate: { type: Date },
  isCancelled: { type: Boolean, default: false }
});

const Subscription = model('Subscription', subscriptionSchema);

export default Subscription;
