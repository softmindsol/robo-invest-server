import { userDB } from '../../instances/db.instance.js';
import { checkField } from '../../utils/index.js';
import { STATUS_CODES, MAX_LOGIN_ATTEMPTS, LOCK_TIME } from '../../constants/index.js';

export class UserService {
  static async checkEmailExists(email) {
    const existingEmail = await userDB.findOne({ email });
    checkField(existingEmail, 'Email already exists');
  }

  static async checkUsernameExists(username) {
    const existingUsername = await userDB.findOne({ username });
    checkField(existingUsername, 'Username already exists');
  }

  static async findUserByEmail(email, selectPassword = false) {
    const projection = selectPassword ? '+password' : '';
    return await userDB.findOne({ email }, projection);
  }

  static async findUserById(userId) {
    const user = await userDB.findById(userId);
    checkField(!user, 'User not found', STATUS_CODES.NOT_FOUND);
    return user;
  }

  static async updateUserDetails(userId, updateData) {
    const user = await this.findUserById(userId);
    Object.assign(user, updateData);
    await user.save();
    return user;
  }

  static async handleLoginAttempt(user, isPasswordCorrect) {
    if (!isPasswordCorrect) {
      user.loginAttempts += 1;
      
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME);
      }
      
      await user.save();
      return false;
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    return true;
  }

  static async generateAndSaveToken(user) {
    const accessToken = user.generateAccessToken();
    user.accessToken.push(accessToken);
    await user.save();
    return accessToken;
  }
}