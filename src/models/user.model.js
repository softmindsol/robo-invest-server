import mongoose from 'mongoose';
import {
  emailVerificationSchema,
  personalDetailsSchema,
  financialDetailsSchema,
  beneficiaryDetailsSchema,
  investmentGoalsSchema,
  resetPasswordSchema,
  passwordHistorySchema
} from './schemas/user.schema.js';
import { userMethods, userPreSave } from './methods/user.methods.js';

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  termsAccepted: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ['User', 'Admin'],
    default: 'User'
  },
  accessToken: {
    type: [String],
    default: []
  },
  emailVerification: emailVerificationSchema,
  resetPassword: resetPasswordSchema,
  passwordHistory: {
    type: [passwordHistorySchema],
    default: []
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  isAccountActive: {
    type: Boolean,
    default: false
  },
  accountType: {
    type: String,
    enum: ['normal', 'sahulat']
  },
  personal: personalDetailsSchema,
  financial: financialDetailsSchema,
  beneficiary: beneficiaryDetailsSchema,
  investment: investmentGoalsSchema,
  subscription: {
    type: Schema.Types.ObjectId,
    ref: 'Subscription',
    default: null
  }
});

UserSchema.pre('save', userPreSave);
Object.assign(UserSchema.methods, userMethods);

const User = model('User', UserSchema);

export default User;
