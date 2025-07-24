import jwt from 'jsonwebtoken';
import RefreshToken from '../../models/refresh-token.model.js';
import { userDB } from '../../instances/db.instance.js';
import { 
  REFRESH_TOKEN_SECRET, 
  REFRESH_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET 
} from '../../configs/env.config.js';
import { checkField } from '../../utils/index.js';
import { STATUS_CODES } from '../../constants/index.js';

export class TokenService {
  /**
   * Generate both access and refresh tokens for a user
   */
  static async generateTokenPair(user, deviceInfo = {}) {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    
    // Calculate expiry date
    const expiryMs = this.parseExpiry(REFRESH_TOKEN_EXPIRY);
    const expiresAt = new Date(Date.now() + expiryMs);
    
    // Store refresh token in database
    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      deviceInfo,
      expiresAt
    });
    
    // Store access token in user document (for logout functionality)
    user.accessToken.push(accessToken);
    await user.save();
    
    return { accessToken, refreshToken };
  }
  
  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(refreshToken, deviceInfo = {}) {
    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired');
      }
      throw new Error('Invalid refresh token');
    }
    
    // Find refresh token in database
    const storedToken = await RefreshToken.findOne({ 
      token: refreshToken,
      isActive: true 
    }).populate('user');
    
    checkField(!storedToken, 'Refresh token not found or revoked', STATUS_CODES.UNAUTHORIZED);
    checkField(!storedToken.isValid(), 'Refresh token expired or invalid', STATUS_CODES.UNAUTHORIZED);
    
    const user = storedToken.user;
    checkField(!user, 'User not found', STATUS_CODES.UNAUTHORIZED);
    checkField(!user.isAccountActive, 'Account is inactive', STATUS_CODES.FORBIDDEN);
    
    // Generate new token pair (token rotation)
    const newTokenPair = await this.generateTokenPair(user, deviceInfo);
    
    // Revoke old refresh token
    await storedToken.revoke('system', 'Token rotation');
    
    // Update last used timestamp
    storedToken.lastUsedAt = new Date();
    await storedToken.save();
    
    return newTokenPair;
  }
  
  /**
   * Revoke refresh token
   */
  static async revokeRefreshToken(refreshToken, revokedBy = 'user', reason = 'Manual logout') {
    const storedToken = await RefreshToken.findOne({ 
      token: refreshToken,
      isActive: true 
    });
    
    if (storedToken) {
      await storedToken.revoke(revokedBy, reason);
    }
    
    return storedToken;
  }
  
  /**
   * Revoke all refresh tokens for a user
   */
  static async revokeAllUserTokens(userId, revokedBy = 'user', reason = 'Logout from all devices') {
    await RefreshToken.revokeAllForUser(userId, revokedBy, reason);
    
    // Also clear access tokens from user document
    const user = await userDB.findById(userId);
    if (user) {
      user.accessToken = [];
      await user.save();
    }
  }
  
  /**
   * Get all active sessions for a user
   */
  static async getUserSessions(userId) {
    return await RefreshToken.find({
      user: userId,
      isActive: true
    }).select('deviceInfo lastUsedAt createdAt expiresAt').sort({ lastUsedAt: -1 });
  }
  
  /**
   * Validate access token
   */
  static async validateAccessToken(token) {
    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      const user = await userDB.findById(decoded._id);
      
      checkField(!user, 'User not found', STATUS_CODES.UNAUTHORIZED);
      checkField(!user.accessToken.includes(token), 'Token not found in user session', STATUS_CODES.UNAUTHORIZED);
      
      return { user, decoded };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Access token expired');
      }
      throw new Error('Invalid access token');
    }
  }
  
  /**
   * Clean up expired tokens
   */
  static async cleanupExpiredTokens() {
    return await RefreshToken.cleanupExpired();
  }
  
  /**
   * Parse expiry string to milliseconds
   */
  static parseExpiry(expiry) {
    const units = {
      's': 1000,
      'm': 60 * 1000,
      'h': 60 * 60 * 1000,
      'd': 24 * 60 * 60 * 1000
    };
    
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error('Invalid expiry format');
    }
    
    const [, value, unit] = match;
    return parseInt(value) * units[unit];
  }
  
  /**
   * Extract device info from request
   */
  static extractDeviceInfo(req) {
    return {
      userAgent: req.get('User-Agent') || 'Unknown',
      ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
      deviceId: req.get('X-Device-ID') || null
    };
  }
}