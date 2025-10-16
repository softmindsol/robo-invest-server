import { asyncHandler, sendResponse } from '../../utils/index.js';
import { STATUS_CODES } from '../../constants/index.js';
import { UserService } from '../../services/auth/user.service.js';

export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await UserService.findUserById(userId, ['subscription']);

  const {
    accessToken,
    emailVerification,
    loginAttempts,
    passwordHistory,
    ...profileData
  } = user?.toObject();
  console.log(
    '🚀 ~   accessToken,emailVerification,  loginAttempts,passwordHistory:',
    accessToken,
    emailVerification,
    loginAttempts,
    passwordHistory
  );

  sendResponse(
    res,
    STATUS_CODES.SUCCESS,
    'User profile retrieved successfully',
    { profile: profileData }
  );
});

export const updatePersonalInformation = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const personalInfo = req.body;
  const documents = req.files;

  const user = await UserService.findUserById(userId);

  if (!user.personalDetails) {
    user.personalDetails = {};
  }

  const updatedPersonalInfo = { ...personalInfo };

  if (documents?.frontSide?.[0]) {
    updatedPersonalInfo.uploadFrontSideOfCNIC = documents.frontSide[0].filename;
  }

  if (documents?.backSide?.[0]) {
    updatedPersonalInfo.uploadBackSideOfCNIC = documents.backSide[0].filename;
  }

  user.personalDetails = {
    ...user.personalDetails,
    ...updatedPersonalInfo
  };

  await user.save();

  sendResponse(
    res,
    STATUS_CODES.SUCCESS,
    'Personal information updated successfully'
  );
});

export const updateInvestmentRisk = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { riskLevel } = req.body;

  if (!riskLevel) {
    return sendResponse(
      res,
      STATUS_CODES.BAD_REQUEST,
      'Risk level is required.'
    );
  }

  const user = await UserService.findUserById(userId);

  if (!user.investment) {
    user.investment = {};
  }

  user.investment.riskLevel = riskLevel;

  await user.save();

  sendResponse(
    res,
    STATUS_CODES.SUCCESS,
    'Investment risk level updated successfully',
    { riskLevel: user.investment.riskLevel }
  );
});
