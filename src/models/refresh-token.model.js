import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const refreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  deviceInfo: {
    userAgent: String,
    ipAddress: String,
    deviceId: String
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  },
  lastUsedAt: {
    type: Date,
    default: Date.now
  },
  revokedAt: {
    type: Date,
    default: null
  },
  revokedBy: {
    type: String,
    enum: ['user', 'admin', 'system', 'security'],
    default: null
  },
  revokedReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for cleanup queries
refreshTokenSchema.index({ user: 1, isActive: 1 });
refreshTokenSchema.index({ expiresAt: 1 });

// Methods
refreshTokenSchema.methods.revoke = function(revokedBy = 'user', reason = 'Manual revocation') {
  this.isActive = false;
  this.revokedAt = new Date();
  this.revokedBy = revokedBy;
  this.revokedReason = reason;
  return this.save();
};

refreshTokenSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

refreshTokenSchema.methods.isValid = function() {
  return this.isActive && !this.isExpired();
};

// Static methods
refreshTokenSchema.statics.revokeAllForUser = function(userId, revokedBy = 'user', reason = 'Revoke all sessions') {
  return this.updateMany(
    { user: userId, isActive: true },
    {
      isActive: false,
      revokedAt: new Date(),
      revokedBy,
      revokedReason: reason
    }
  );
};

refreshTokenSchema.statics.cleanupExpired = function() {
  return this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isActive: false, revokedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } // 30 days old revoked tokens
    ]
  });
};

const RefreshToken = model('RefreshToken', refreshTokenSchema);

export default RefreshToken;