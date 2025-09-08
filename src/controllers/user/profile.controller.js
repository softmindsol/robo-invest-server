import { asyncHandler, sendResponse } from '../../utils/index.js';
import { STATUS_CODES } from '../../constants/index.js';
import { UserService } from '../../services/auth/user.service.js';

export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await UserService.findUserById(userId);

  const profileData = {
    personalInformation: {
      firstName: user.personalDetails?.firstName || '',
      lastName: user.personalDetails?.lastName || '',
      cnicNumber: user.personalDetails?.CNICNumber || '',
      issueDate: user.personalDetails?.issueDate || null,
      expireDate: user.personalDetails?.expireDate || null,
      gender: user.personalDetails?.gender || '',
      maritalStatus: user.personalDetails?.maritalStatus || '',
      dateOfBirth: user.personalDetails?.dateOfBirth || null,
      permanentAddress: user.personalDetails?.permanentAddress || '',
      emailAddress: user.email,
      fathersOrHusbandsName: user.personalDetails?.fathersOrHusbandsName || {
        selection: '',
        name: ''
      },
      mothersName: user.personalDetails?.mothersName || '',
      phoneNumber: user.phoneNumber || '',
      placeOfBirth: user.personalDetails?.placeOfBirth || '',
      nationality: user.personalDetails?.nationality || '',
      uploadFrontSideOfCNIC: user.personalDetails?.uploadFrontSideOfCNIC || '',
      uploadBackSideOfCNIC: user.personalDetails?.uploadBackSideOfCNIC || '',
      dualNationality: user.personalDetails?.dualNationality || false
    },
    accountInformation: {
      username: user.username,
      accountType: user.accountType || '',
      isAccountActive: user.isAccountActive,
      emailVerified: user.emailVerification?.isVerified || false
    },
    financialDetails: user.financialDetails || {},
    beneficiaryDetails: user.beneficiaryDetails || {},
    investmentGoals: user.investmentGoals || {}
  };

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
