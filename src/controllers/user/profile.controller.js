import { asyncHandler, sendResponse, checkField } from '../../utils/index.js';
import { STATUS_CODES } from '../../constants/index.js';
import { UserService } from '../../services/auth/user.service.js';

export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const user = await UserService.findUserById(userId);
  
  // Structure the response to match the frontend form
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
      fathersOrHusbandsName: user.personalDetails?.fathersOrHusbandsName || { selection: '', name: '' },
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

  // Initialize personalDetails if it doesn't exist
  if (!user.personalDetails) {
    user.personalDetails = {};
  }

  // Handle file uploads if provided
  const updatedPersonalInfo = { ...personalInfo };
  
  if (documents?.frontSide?.[0]) {
    updatedPersonalInfo.uploadFrontSideOfCNIC = documents.frontSide[0].filename;
  }
  
  if (documents?.backSide?.[0]) {
    updatedPersonalInfo.uploadBackSideOfCNIC = documents.backSide[0].filename;
  }

  // Update personal details
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

export const updateContactInformation = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { phoneNumber, permanentAddress } = req.body;

  const user = await UserService.findUserById(userId);

  // Update phone number at user level
  if (phoneNumber) {
    user.phoneNumber = phoneNumber;
  }

  // Update address in personal details
  if (permanentAddress) {
    if (!user.personalDetails) {
      user.personalDetails = {};
    }
    user.personalDetails.permanentAddress = permanentAddress;
  }

  await user.save();

  sendResponse(
    res,
    STATUS_CODES.SUCCESS,
    'Contact information updated successfully'
  );
});

export const updateFinancialInformation = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const financialInfo = req.body;
  const documents = req.files;

  const user = await UserService.findUserById(userId);

  // Initialize financialDetails if it doesn't exist
  if (!user.financialDetails) {
    user.financialDetails = {};
  }

  const updatedFinancialInfo = { ...financialInfo };

  // Handle document uploads for Normal account type
  if (user.accountType === 'Normal') {
    if (documents?.proofOfIncome?.[0]) {
      updatedFinancialInfo.proofOfIncome = documents.proofOfIncome[0].filename;
    }
    
    if (documents?.proofOfEmployment?.[0]) {
      updatedFinancialInfo.proofOfEmployment = documents.proofOfEmployment[0].filename;
    }
    
    if (documents?.companyLetterHead?.[0]) {
      updatedFinancialInfo.companyLetterhead = documents.companyLetterHead[0].filename;
    }
  }

  // Update financial details
  user.financialDetails = {
    ...user.financialDetails,
    ...updatedFinancialInfo
  };

  await user.save();

  sendResponse(
    res,
    STATUS_CODES.SUCCESS,
    'Financial information updated successfully'
  );
});

export const updateBeneficiaryInformation = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const beneficiaryInfo = req.body;
  const documents = req.files;

  const user = await UserService.findUserById(userId);

  // Initialize beneficiaryDetails if it doesn't exist
  if (!user.beneficiaryDetails) {
    user.beneficiaryDetails = {};
  }

  const updatedBeneficiaryInfo = { ...beneficiaryInfo };

  // Handle document uploads
  if (documents?.uploadFrontSideOfCNIC?.[0]) {
    updatedBeneficiaryInfo.uploadFrontSideOfCNIC = documents.uploadFrontSideOfCNIC[0].filename;
  }
  
  if (documents?.uploadBackSideOfCNIC?.[0]) {
    updatedBeneficiaryInfo.uploadBackSideOfCNIC = documents.uploadBackSideOfCNIC[0].filename;
  }
  
  if (documents?.uploadMainPassportPage?.[0]) {
    updatedBeneficiaryInfo.uploadMainPassportPage = documents.uploadMainPassportPage[0].filename;
  }

  // Update beneficiary details
  user.beneficiaryDetails = {
    ...user.beneficiaryDetails,
    ...updatedBeneficiaryInfo
  };

  await user.save();

  sendResponse(
    res,
    STATUS_CODES.SUCCESS,
    'Beneficiary information updated successfully'
  );
});

export const updateInvestmentGoals = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const investmentInfo = req.body;

  const user = await UserService.findUserById(userId);

  // Initialize investmentGoals if it doesn't exist
  if (!user.investmentGoals) {
    user.investmentGoals = {};
  }

  // Update investment goals
  user.investmentGoals = {
    ...user.investmentGoals,
    ...investmentInfo
  };

  await user.save();

  sendResponse(
    res,
    STATUS_CODES.SUCCESS,
    'Investment goals updated successfully'
  );
});

export const getProfileCompletion = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const user = await UserService.findUserById(userId);
  
  // Calculate profile completion percentage
  const completionStatus = {
    personalInformation: {
      completed: !!(
        user.personalDetails?.firstName &&
        user.personalDetails?.lastName &&
        user.personalDetails?.CNICNumber &&
        user.personalDetails?.dateOfBirth &&
        user.personalDetails?.gender &&
        user.personalDetails?.maritalStatus
      ),
      percentage: 0
    },
    contactInformation: {
      completed: !!(user.phoneNumber && user.personalDetails?.permanentAddress),
      percentage: 0
    },
    financialInformation: {
      completed: !!(
        user.financialDetails?.occupation &&
        user.financialDetails?.incomeSource &&
        user.financialDetails?.salaryAmount
      ),
      percentage: 0
    },
    beneficiaryInformation: {
      completed: !!(
        user.beneficiaryDetails?.name &&
        user.beneficiaryDetails?.relationship
      ),
      percentage: 0
    },
    investmentGoals: {
      completed: !!(
        user.investmentGoals?.objective &&
        user.investmentGoals?.timeHorizon
      ),
      percentage: 0
    }
  };

  // Calculate percentages
  const sections = Object.keys(completionStatus);
  const completedSections = sections.filter(section => completionStatus[section].completed).length;
  const overallPercentage = Math.round((completedSections / sections.length) * 100);

  sections.forEach(section => {
    completionStatus[section].percentage = completionStatus[section].completed ? 100 : 0;
  });

  sendResponse(
    res,
    STATUS_CODES.SUCCESS,
    'Profile completion status retrieved successfully',
    {
      overallPercentage,
      sections: completionStatus,
      completedSections,
      totalSections: sections.length
    }
  );
});