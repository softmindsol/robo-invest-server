import { asyncHandler, checkField, sendResponse } from '../../utils/index.js';
import { ACCOUNT_TYPES, STATUS_CODES } from '../../constants/index.js';
import { UserService } from '../../services/auth/user.service.js';

export const addAccountType = asyncHandler(async (req, res) => {
  const { accountType } = req.body;
  const userId = req.user._id;

  await UserService.updateUserDetails(userId, { accountType });

  sendResponse(
    res,
    STATUS_CODES.SUCCESS,
    'User account type updated successfully'
  );
});

export const addPersonalDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const personalDetails = req.body;
  const documents = req.files;

  const user = await UserService.findUserById(userId);

  const frontCNICImage = documents['frontSide'][0]?.filename;
  const backCNICImage = documents['backSide'][0]?.filename;

  checkField(
    !frontCNICImage || !backCNICImage,
    'Both front and back CNIC images must be uploaded'
  );

  // Initialize personalDetails if it doesn't exist
  if (!user.personalDetails) {
    user.personalDetails = {};
  }

  // Merge the form data with file paths
  user.personalDetails = {
    ...personalDetails,
    uploadFrontSideOfCNIC: frontCNICImage,
    uploadBackSideOfCNIC: backCNICImage
  };

  await user.save();

  sendResponse(
    res,
    STATUS_CODES.SUCCESS,
    'Personal details updated successfully'
  );
});

export const addFinancialDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const financialDetails = req.body;
  const documents = req.files;

  const user = await UserService.findUserById(userId);

  const accountType = user.accountType;

  // Initialize financialDetails if it doesn't exist
  if (!user.financialDetails) {
    user.financialDetails = {};
  }

  const updatedFinancialDetails = { ...financialDetails };

  if (accountType === ACCOUNT_TYPES.NORMAL) {
    const proofOfIncome = documents?.proofOfIncome?.[0]?.filename;
    const proofOfEmployment = documents?.proofOfEmployment?.[0]?.filename;
    const companyLetterHead = documents?.companyLetterHead?.[0]?.filename;

    checkField(
      !proofOfIncome || !proofOfEmployment || !companyLetterHead,
      'All three documents (Proof of Income, Proof of Employment, Company Letter Head) must be uploaded for Normal account'
    );

    updatedFinancialDetails.proofOfIncome = proofOfIncome;
    updatedFinancialDetails.proofOfEmployment = proofOfEmployment;
    updatedFinancialDetails.companyLetterhead = companyLetterHead;
  }

  user.financialDetails = updatedFinancialDetails;

  await user.save();

  sendResponse(
    res,
    STATUS_CODES.SUCCESS,
    'Financial details updated successfully'
  );
});

export const addBeneficiaryDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const beneficiaryDetails = req.body;
  const documents = req.files;

  const user = await UserService.findUserById(userId);

  const accountType = user.accountType;

  // Initialize beneficiaryDetails if it doesn't exist
  if (!user.beneficiaryDetails) {
    user.beneficiaryDetails = {};
  }

  const updatedBeneficiaryDetails = { ...beneficiaryDetails };

  if (accountType === ACCOUNT_TYPES.SAHULAT) {
    const uploadMainPassportPage =
      documents?.uploadMainPassportPage?.[0]?.filename;

    updatedBeneficiaryDetails.uploadMainPassportPage = uploadMainPassportPage;
  }

  user.beneficiaryDetails = updatedBeneficiaryDetails;
  await user.save();

  sendResponse(
    res,
    STATUS_CODES.SUCCESS,
    'Beneficiary details updated successfully'
  );
});
