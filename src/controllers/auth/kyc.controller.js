import { STATUS_CODES } from '../../constants/index.js';
import { asyncHandler, sendResponse } from '../../utils/index.js';
import { UserService } from '../../services/auth/user.service.js';

export const kycSteps = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const payload = req.body;
  await UserService.findUserById(userId);

  const updatedData = {
    accountType: payload.accountType,
    personal: payload.personal,
    financial: payload.financial,
    beneficiary: payload.beneficiary,
    investment: payload.investment
  };

  await UserService.updateUserDetails(userId, updatedData);

  sendResponse(
    res,
    STATUS_CODES.SUCCESS,
    'User KYC details updated successfully'
  );
});
