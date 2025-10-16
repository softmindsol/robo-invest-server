import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const paymentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    basketId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending'
    },
    planName: { type: String },
    interval: { type: String },
    accessToken: { type: String },
    tokenExpiry: { type: Number },
    errCode: { type: String },
    isValid: { type: Boolean, default: false },
    rawPayload: { type: Object },
    validatedAt: { type: Date }
  },
  { timestamps: true }
);

export const Payment = model('Payment', paymentSchema);
