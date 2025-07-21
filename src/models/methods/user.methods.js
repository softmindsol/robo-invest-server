import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY
} from '../../configs/env.config.js';

export const userMethods = {
  isPasswordCorrect: async function (password) {
    return await bcrypt.compare(password, this.password);
  },

  generateAccessToken: function () {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        role: this.role,
        accountType: this.accountType
      },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRY
      }
    );
  },

  isAccountLocked: function () {
    return this.lockUntil && this.lockUntil > Date.now();
  }
};

export const userPreSave = async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
};