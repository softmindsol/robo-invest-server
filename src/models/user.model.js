import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY
} from '../configs/env.config.js';

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['User', 'Admin'],
    default: 'User'
  },
  accessToken: {
    type: [String],
    default: []
  },
  accountType: {
    type: String,
    enum: ['Normal', 'Sahulat']
  },
  emailVerification: {
    otp: {
      type: String
    },
    expiry: {
      type: Date
    },
    updatedAt: {
      type: Date
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  passwordHistory: [{ type: String }],
  lastPasswordChange: { type: Date },
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
  }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY
    }
  );
};

UserSchema.methods.isAccountLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

const User = model('User', UserSchema);

export default User;
