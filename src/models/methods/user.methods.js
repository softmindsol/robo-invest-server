import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY
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

  generateRefreshToken: function () {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        tokenType: 'refresh'
      },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: REFRESH_TOKEN_EXPIRY
      }
    );
  },

  isAccountLocked: function () {
    return this.lockUntil && this.lockUntil > Date.now();
  },

  addToPasswordHistory: function (hashedPassword) {
    // Initialize passwordHistory if it doesn't exist
    if (!this.passwordHistory) {
      this.passwordHistory = [];
    }

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
    // Return false if no password history exists
    if (!this.passwordHistory || this.passwordHistory.length === 0) {
      return false;
    }

    // Check if new password matches any of the last 3 passwords
    for (const historyEntry of this.passwordHistory) {
      // Skip if password is null, undefined, or empty
      if (
        !historyEntry ||
        !historyEntry.password ||
        historyEntry.password.trim() === ''
      ) {
        continue;
      }

      try {
        const isMatch = await bcrypt.compare(
          newPassword,
          historyEntry.password
        );
        if (isMatch) {
          return true;
        }
      } catch (error) {
        console.error('Error comparing password with history:', error);
        continue;
      }
    }
    return false;
  }
};

export const userPreSave = async function (next) {
  // Only process if password is being modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // If this is not a new user, store the current password in history
    if (!this.isNew) {
      // Get the current password from the database before it gets overwritten
      const currentUser = await this.constructor
        .findById(this._id)
        .select('+password');

      if (
        currentUser &&
        currentUser.password &&
        currentUser.password.trim() !== ''
      ) {
        // Add the current hashed password to history
        this.addToPasswordHistory(currentUser.password);
      }
    }

    // Hash the new password
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
};
