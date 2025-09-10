import { STATUS_CODES } from '../../constants/index.js';
import { asyncHandler, sendResponse } from '../../utils/index.js';
import { UserService } from '../../services/auth/user.service.js';
import { uploadBufferToCloudinary } from '../../utils/cloudinary.js';

const ACCOUNT_TYPES = { NORMAL: 'normal', SAHULAT: 'sahulat' };

const parseMaybeJson = (v) => {
  if (v === null) return v;
  if (typeof v === 'object') return v;
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
};

const FIELD_MAP = {
  personal_cnicFront: 'personal.cnicFront',
  personal_cnicBack: 'personal.cnicBack',

  financial_proofOfIncome: 'financial.proofOfIncome',
  financial_proofOfEmployment: 'financial.proofOfEmployment',
  financial_companyLetterhead: 'financial.companyLetterhead',

  beneficiary_cnicFront: 'beneficiary.cnicFront',
  beneficiary_cnicBack: 'beneficiary.cnicBack',

  beneficiary_passportUpload: 'beneficiary.passportUpload'
};

function setDeep(obj, path, value) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const last = i === parts.length - 1;
    if (last) {
      if (Array.isArray(cur[p])) {
        cur[p].push(...(Array.isArray(value) ? value : [value]));
      } else {
        cur[p] = value;
      }
    } else {
      cur[p] = cur[p] ?? {};
      cur = cur[p];
    }
  }
}

function stripDisallowedByAccountType({ accountType, financial, beneficiary }) {
  const type = (accountType || '').toString().toLowerCase();

  if (type === ACCOUNT_TYPES.NORMAL) {
    if (beneficiary?.passportUpload) delete beneficiary.passportUpload;
  } else if (type === ACCOUNT_TYPES.SAHULAT) {
    if (financial) {
      delete financial.proofOfIncome;
      delete financial.proofOfEmployment;
      delete financial.companyLetterhead;
    }
    // beneficiary passportUpload allowed for SAHULAT (keep if present)
  }
}

export const kycStepsWithUploads = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Parse body (multipart sends JSON as strings)
  const accountTypeRaw = parseMaybeJson(req.body.accountType);
  const accountType = (accountTypeRaw || '').toString().toLowerCase();

  const personal = parseMaybeJson(req.body.personal) || {};
  const financial = parseMaybeJson(req.body.financial) || {};
  const beneficiary = parseMaybeJson(req.body.beneficiary) || {};
  const investment = parseMaybeJson(req.body.investment) || {};

  await UserService.findUserById(userId);

  let allowedPaths;
  if (accountType === ACCOUNT_TYPES.NORMAL) {
    allowedPaths = new Set([
      'personal.cnicFront',
      'personal.cnicBack',
      'financial.proofOfIncome',
      'financial.proofOfEmployment',
      'financial.companyLetterhead',
      'beneficiary.cnicFront',
      'beneficiary.cnicBack'
    ]);
  } else if (accountType === ACCOUNT_TYPES.SAHULAT) {
    allowedPaths = new Set([
      'personal.cnicFront',
      'personal.cnicBack',
      'beneficiary.cnicFront',
      'beneficiary.cnicBack',
      'beneficiary.passportUpload'
    ]);
  } else {
    allowedPaths = new Set([
      'personal.cnicFront',
      'personal.cnicBack',
      'beneficiary.cnicFront',
      'beneficiary.cnicBack'
    ]);
  }

  const uploadedUrls = {}; // { payloadPath: url }
  if (req.files && Object.keys(req.files).length) {
    await Promise.all(
      Object.entries(req.files).map(async ([field, files]) => {
        const payloadPath = FIELD_MAP[field];
        if (!payloadPath || !allowedPaths.has(payloadPath)) return;

        const f = files[0];
        if (!f) return;

        const result = await uploadBufferToCloudinary(f.buffer, {
          folder: `kyc/${userId}/${field}`,
          publicId: undefined
        });
        uploadedUrls[payloadPath] = result.secure_url;
      })
    );
  }

  for (const [path, value] of Object.entries(uploadedUrls)) {
    if (path.startsWith('personal.'))
      setDeep(personal, path.split('.').slice(1).join('.'), value);
    else if (path.startsWith('financial.'))
      setDeep(financial, path.split('.').slice(1).join('.'), value);
    else if (path.startsWith('beneficiary.'))
      setDeep(beneficiary, path.split('.').slice(1).join('.'), value);
    else if (path.startsWith('investment.'))
      setDeep(investment, path.split('.').slice(1).join('.'), value);
  }

  stripDisallowedByAccountType({
    accountType,
    personal,
    financial,
    beneficiary
  });

  const updatedData = {
    accountType,
    personal,
    financial,
    beneficiary,
    investment
  };

  await UserService.updateUserDetails(userId, updatedData);

  sendResponse(
    res,
    STATUS_CODES.SUCCESS,
    'User KYC details updated successfully'
  );
});
