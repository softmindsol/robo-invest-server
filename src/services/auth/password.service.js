import bcrypt from 'bcrypt';
import { checkField } from '../../utils/index.js';
import { STATUS_CODES } from '../../constants/index.js';

export class PasswordService {
  /**
   * Validates if the new password is different from the last 3 passwords
   * @param {Object} user - User document
   * @param {string} newPassword - New password to validate
   * @throws {Error} If password is reused
   */
  static async validatePasswordReuse(user, newPassword) {
    const isReused = await user.isPasswordReused(newPassword);
    checkField(
      isReused,
      'Password cannot be the same as your last 3 passwords. Please choose a different password.',
      STATUS_CODES.BAD_REQUEST
    );
  }

  /**
   * Validates current password before allowing password change
   * @param {Object} user - User document
   * @param {string} currentPassword - Current password to validate
   * @throws {Error} If current password is incorrect
   */
  static async validateCurrentPassword(user, currentPassword) {
    const isCurrentPasswordCorrect = await user.isPasswordCorrect(currentPassword);
    checkField(
      !isCurrentPasswordCorrect,
      'Current password is incorrect',
      STATUS_CODES.BAD_REQUEST
    );
  }

  /**
   * Changes user password with validation
   * @param {Object} user - User document
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   */
  static async changePassword(user, currentPassword, newPassword) {
    // Validate current password
    await this.validateCurrentPassword(user, currentPassword);
    
    // Validate password reuse
    await this.validatePasswordReuse(user, newPassword);
    
    // Set new password (pre-save hook will handle hashing and history)
    user.password = newPassword;
    await user.save();
  }

  /**
   * Resets password with validation (for forgot password flow)
   * @param {Object} user - User document
   * @param {string} newPassword - New password
   */
  static async resetPassword(user, newPassword) {
    // Validate password reuse
    await this.validatePasswordReuse(user, newPassword);
    
    // Set new password (pre-save hook will handle hashing and history)
    user.password = newPassword;
    await user.save();
  }
}