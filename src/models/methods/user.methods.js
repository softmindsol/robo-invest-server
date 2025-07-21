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
  },

  addToPasswordHistory: async function (hashedPassword) {
    // Add current password to history
    this.passwordHistory.unshift({
      password: hashedPassword,
      createdAt: new Date()
    });

    // Keep only last 3 passwords
    if (this.passwordHistory.length > 3) {
      this.passwordHistory = this.passwordHistory.slice(0, 3);
    }
  },

  isPasswordReused: async function (newPassword) {
    // Check if new password matches any of the last 3 passwords
    for (const historyEntry of this.passwordHistory) {
      const isMatch = await bcrypt.compare(newPassword, historyEntry.password);
      if (isMatch) {
        return true;
      }
    }
    return false;
  }
};

export const userPreSave = async function (next) {
  if (!this.isModified('password')) return next();
  
  // Store the old password in history before hashing the new one
  if (!this.isNew && this.password) {
    await this.addToPasswordHistory(this.password);
  }
  
  this.password = await bcrypt.hash(this.password, 10);
  next();
};