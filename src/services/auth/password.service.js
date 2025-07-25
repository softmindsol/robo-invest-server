import { checkField } from '../../utils/index.js';
import { STATUS_CODES } from '../../constants/index.js';
import logger from '../../utils/logger.js';

export class PasswordService {
  /**
   * Validates if the new password is different from the last 3 passwords
   * @param {Object} user - User document
   * @param {string} newPassword - New password to validate
   * @throws {Error} If password is reused
   */
  static async validatePasswordReuse(user, newPassword) {
    try {
      const isReused = await user.isPasswordReused(newPassword);
      checkField(
        isReused,
        'Password cannot be the same as your last 3 passwords. Please choose a different password.',
        STATUS_CODES.BAD_REQUEST
      );
    } catch (error) {
      logger.error('Error validating password reuse:', error);
    }
  }

  /**
   * Validates current password before allowing password change
   * @param {Object} user - User document with password field selected
   * @param {string} currentPassword - Current password to validate
   * @throws {Error} If current password is incorrect
   */
  static async validateCurrentPassword(user, currentPassword) {
    const isCurrentPasswordCorrect =
      await user.isPasswordCorrect(currentPassword);
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
    const userWithPassword = await user.constructor
      .findById(user._id)
      .select('+password');

    // Validate current password
    await this.validateCurrentPassword(userWithPassword, currentPassword);

    // Validate password reuse
    await this.validatePasswordReuse(userWithPassword, newPassword);

    userWithPassword.password = newPassword;
    await userWithPassword.save();
  }

  /**
   * Resets password with validation (for forgot password flow)
   * @param {Object} user - User document
   * @param {string} newPassword - New password
   */
  static async resetPassword(user, newPassword) {
    const userWithPassword = await user.constructor
      .findById(user._id)
      .select('+password');

    await this.validatePasswordReuse(userWithPassword, newPassword);

    userWithPassword.password = newPassword;
    await userWithPassword.save();
  }
}
