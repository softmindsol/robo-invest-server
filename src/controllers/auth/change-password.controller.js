import { asyncHandler, sendResponse } from '../../utils/index.js';
import { STATUS_CODES } from '../../constants/index.js';
import { PasswordService } from '../../services/auth/password.service.js';

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = req.user;

  // Change password with validation
  await PasswordService.changePassword(user, currentPassword, newPassword);

  sendResponse(res, STATUS_CODES.SUCCESS, 'Password changed successfully');
});
