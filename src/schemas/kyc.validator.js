import Joi from 'joi';
import { ACCOUNT_TYPES } from '../constants/index.js';

const personalSchema = (accountType = '') => {
  let schema = Joi.object({
    firstName: Joi.string().trim().required().messages({
      'string.empty': 'First name cannot be empty.',
      'any.required': 'First name is required.'
    }),
    lastName: Joi.string().trim().required().messages({
      'string.empty': 'Last name cannot be empty.',
      'any.required': 'Last name is required.'
    }),
    cnic: Joi.string()
      .pattern(/^\d{5}-\d{7}-\d{1}$/)
      .required()
      .messages({
        'string.empty': 'CNIC cannot be empty.',
        'string.pattern': 'CNIC must be in the format 12345-1234567-1.',
        'any.required': 'CNIC is required.'
      }),
    issueDate: Joi.date().iso().required().messages({
      'date.base': 'Issue Date must be a valid date.',
      'date.iso': 'Issue Date must be in ISO 8601 format (YYYY-MM-DD).',
      'any.required': 'Issue Date is required.'
    }),
    expireDate: Joi.date()
      .iso()
      .greater(Joi.ref('issueDate'))
      .required()
      .messages({
        'date.base': 'Expire Date must be a valid date.',
        'date.iso': 'Expire Date must be in ISO 8601 format (YYYY-MM-DD).',
        'date.greater': 'Expire Date must be after Issue Date.',
        'any.required': 'Expire Date is required.'
      }),
    gender: Joi.string()
      .trim()
      .required()
      .valid('Male', 'Female', 'Other')
      .messages({
        'string.empty': 'Gender cannot be empty.',
        'any.required': 'Gender is required.',
        'any.only': 'Gender must be Male, Female, or Other.'
      }),
    maritalStatus: Joi.string()
      .trim()
      .required()
      .valid('Single', 'Married', 'Divorced', 'Widowed')
      .messages({
        'string.empty': 'Marital Status cannot be empty.',
        'any.required': 'Marital Status is required.',
        'any.only':
          'Marital Status must be Single, Married, Divorced, or Widowed.'
      }),
    dob: Joi.date().iso().less('now').required().messages({
      'date.base': 'Date of Birth must be a valid date.',
      'date.iso': 'Date of Birth must be in ISO 8601 format (YYYY-MM-DD).',
      'date.less': 'Date of Birth cannot be in the future.',
      'any.required': 'Date of Birth is required.'
    }),
    permanentAddress: Joi.string().trim().required().messages({
      'string.empty': 'Permanent Address cannot be empty.',
      'any.required': 'Permanent Address is required.'
    }),
    nameType: Joi.string()
      .trim()
      .default('Father')
      .valid('Father', 'Husband')
      .messages({
        'any.only': 'Name Type must be Father or Husband.'
      }),
    fatherOrHusband: Joi.string().trim().required().messages({
      'string.empty': 'Father/Husband name cannot be empty.',
      'any.required': 'Father/Husband name is required.'
    }),
    motherName: Joi.string().trim().required().messages({
      'string.empty': 'Mother name cannot be empty.',
      'any.required': 'Mother name is required.'
    }),
    birthPlace: Joi.string().trim().required().messages({
      'string.empty': 'Birth Place cannot be empty.',
      'any.required': 'Birth Place is required.'
    }),
    nationality: Joi.string().trim().default('Pakistani').messages({
      'string.empty': 'Nationality cannot be empty.'
    }),

    dualNationality: Joi.boolean().default(false).messages({
      'boolean.base': 'Dual Nationality must be a boolean.'
    })
  });

  if (accountType === ACCOUNT_TYPES.SAHULAT) {
    schema = schema.keys({
      pakistaniCitizen: Joi.boolean().required().messages({
        'boolean.base': 'Pakistani Citizen status must be a boolean.',
        'any.required':
          'Pakistani Citizen status is required for SAHULAT accounts.'
      })
    });
  }

  return schema;
};

const financialSchema = (accountType = '') => {
  let schema = Joi.object({
    occupation: Joi.string().trim().required().messages({
      'string.empty': 'Occupation cannot be empty.',
      'any.required': 'Occupation is required.'
    }),
    occupationIndustry: Joi.string().trim().required().messages({
      'string.empty': 'Occupation Industry cannot be empty.',
      'any.required': 'Occupation Industry is required.'
    }),
    incomeSource: Joi.string().trim().required().messages({
      'string.empty': 'Income Source cannot be empty.',
      'any.required': 'Income Source is required.'
    }),
    employerAddress: Joi.string().trim().required().messages({
      'string.empty': 'Employer Address cannot be empty.',
      'any.required': 'Employer Address is required.'
    }),
    employerCountry: Joi.string().trim().required().messages({
      'string.empty': 'Employer Country cannot be empty.',
      'any.required': 'Employer Country is required.'
    }),
    yearsEmployed: Joi.number().integer().min(0).required().messages({
      'number.base': 'Years Employed must be a number.',
      'number.integer': 'Years Employed must be an integer.',
      'number.min': 'Years Employed cannot be negative.',
      'any.required': 'Years Employed is required.'
    }),
    salaryAmount: Joi.number().min(0).required().messages({
      'number.base': 'Salary Amount must be a number.',
      'number.min': 'Salary Amount cannot be negative.',
      'any.required': 'Salary Amount is required.'
    }),
    taxFilingStatus: Joi.boolean().required().messages({
      'boolean.base': 'Tax Filing Status must be a boolean.',
      'any.required': 'Tax Filing Status is required.'
    }),
    ntn: Joi.string()
      .trim()
      .when('taxFilingStatus', {
        is: true,
        then: Joi.string().required().messages({
          'string.empty': 'NTN cannot be empty when Tax Filing Status is true.',
          'any.required': 'NTN is required when Tax Filing Status is true.'
        }),
        otherwise: Joi.string().allow('').optional()
      }),
    deductZakat: Joi.boolean().required().messages({
      'boolean.base': 'Deduct Zakat must be a boolean.',
      'any.required': 'Deduct Zakat is required.'
    }),
    investmentAccount: Joi.boolean().required().messages({
      'boolean.base': 'Investment Account must be a boolean.',
      'any.required': 'Investment Account is required.'
    })
  });

  if (accountType === ACCOUNT_TYPES.NORMAL) {
    schema = schema.keys({
      grossAnnualIncome: Joi.number().min(0).required().messages({
        'number.base': 'Gross Annual Income must be a number.',
        'number.min': 'Gross Annual Income cannot be negative.',
        'any.required': 'Gross Annual Income is required for NORMAL accounts.'
      }),
      numberOfDependents: Joi.number().integer().min(0).required().messages({
        'number.base': 'Number of Dependents must be a number.',
        'number.integer': 'Number of Dependents must be an integer.',
        'number.min': 'Number of Dependents cannot be negative.',
        'any.required': 'Number of Dependents is required for NORMAL accounts.'
      })
    });
  }

  return schema;
};

const beneficiarySchema = (accountType = '') => {
  let schema = Joi.object({
    name: Joi.string().trim().required().messages({
      'string.empty': 'Beneficiary name cannot be empty.',
      'any.required': 'Beneficiary name is required.'
    }),
    cnic: Joi.string()
      .pattern(/^\d{5}-\d{7}-\d{1}$/)
      .required()
      .messages({
        'string.empty': 'Beneficiary CNIC cannot be empty.',
        'string.pattern':
          'Beneficiary CNIC must be in the format 12345-1234567-1.',
        'any.required': 'Beneficiary CNIC is required.'
      }),
    relationship: Joi.string().trim().required().messages({
      'string.empty': 'Beneficiary relationship cannot be empty.',
      'any.required': 'Beneficiary relationship is required.'
    }),
    address: Joi.string().trim().required().messages({
      'string.empty': 'Beneficiary address cannot be empty.',
      'any.required': 'Beneficiary address is required.'
    }),
    contactNumber: Joi.string()
      .pattern(/^\d{4}-\d{7}$/)
      .required()
      .messages({
        'string.empty': 'Beneficiary contact number cannot be empty.',
        'string.pattern':
          'Beneficiary contact number must be in the format 0300-1234567.',
        'any.required': 'Beneficiary contact number is required.'
      })
  });

  if (accountType === ACCOUNT_TYPES.NORMAL) {
    schema = schema.keys({
      isUsCitizen: Joi.boolean().required().messages({
        'any.required': 'Is US Citizen is required.'
      }),
      isUsResident: Joi.boolean().required().messages({
        'any.required': 'Is US Resident is required.'
      }),
      hasUsAddress: Joi.boolean().required().messages({
        'any.required': 'Has US Address is required.'
      }),
      usAddressEmail: Joi.string()
        .email()
        .when('hasUsAddress', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.allow('').optional()
        })
        .messages({
          'string.email': 'US Address Email must be a valid email.',
          'any.required':
            'US Address Email is required when has US Address is true.'
        }),
      hasUsTelephone: Joi.boolean().required().messages({
        'any.required': 'Has US Telephone is required.'
      }),
      usTelephoneNumber: Joi.string()
        .when('hasUsTelephone', {
          is: true,
          then: Joi.string().required(),
          otherwise: Joi.allow('').optional()
        })
        .messages({
          'any.required':
            'US Telephone Number is required when has US Telephone is true.'
        }),
      usAuthorizedSignatory: Joi.boolean().required().messages({
        'any.required': 'Is US Authorized Signatory is required.'
      }),
      isPublicFigure: Joi.boolean().required().messages({
        'any.required': 'Is Public Figure is required.'
      }),
      publicFigureDetails: Joi.string()
        .when('isPublicFigure', {
          is: true,
          then: Joi.string().required(),
          otherwise: Joi.allow('').optional()
        })
        .messages({
          'any.required':
            'Public Figure Details are required when is Public Figure is true.'
        }),
      isAccountRefusal: Joi.boolean().required().messages({
        'any.required': 'Is Account Refusal is required.'
      }),
      accountRefusalDetails: Joi.string()
        .when('isAccountRefusal', {
          is: true,
          then: Joi.string().required(),
          otherwise: Joi.allow('').optional()
        })
        .messages({
          'any.required':
            'Account Refusal Details are required when is Account Refusal is true.'
        }),
      hasOffshoreLinks: Joi.boolean().required().messages({
        'any.required': 'Has Offshore Links is required.'
      }),
      offshoreLinksDetails: Joi.string()
        .when('hasOffshoreLinks', {
          is: true,
          then: Joi.string().required(),
          otherwise: Joi.allow('').optional()
        })
        .messages({
          'any.required':
            'Offshore Links Details are required when has Offshore Links is true.'
        }),
      hasHighValueDeals: Joi.boolean().required().messages({
        'any.required': 'Has High Value Deals is required.'
      }),
      highValueDealsDetails: Joi.string()
        .when('hasHighValueDeals', {
          is: true,
          then: Joi.string().required(),
          otherwise: Joi.allow('').optional()
        })
        .messages({
          'any.required':
            'High Value Deals Details are required when has High Value Deals is true.'
        })
    });
  } else if (accountType === ACCOUNT_TYPES.SAHULAT) {
    schema = schema.keys({
      isForeigner: Joi.boolean().required().messages({
        'any.required': 'Is Foreigner is required.'
      }),
      passportNumber: Joi.string()
        .when('isForeigner', {
          is: true,
          then: Joi.string().required(),
          otherwise: Joi.allow('').optional()
        })
        .messages({
          'any.required':
            'Passport Number is required when is Foreigner is true.'
        }),
      placeOfIssue: Joi.string()
        .when('isForeigner', {
          is: true,
          then: Joi.string().required(),
          otherwise: Joi.allow('').optional()
        })
        .messages({
          'any.required':
            'Place of Issue is required when is Foreigner is true.'
        }),
      dateOfIssue: Joi.date()
        .iso()
        .when('isForeigner', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.allow(null).optional()
        })
        .messages({
          'date.iso': 'Date of Issue must be a valid ISO 8601 date.',
          'any.required': 'Date of Issue is required when is Foreigner is true.'
        }),
      dateOfExpiry: Joi.date()
        .iso()
        .when('isForeigner', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.allow(null).optional()
        })
        .messages({
          'date.iso': 'Date of Expiry must be a valid ISO 8601 date.',
          'any.required':
            'Date of Expiry is required when is Foreigner is true.'
        })
    });
  }

  return schema;
};

const investmentSchema = Joi.object({
  objective: Joi.string().required(),

  timeHorizon: Joi.string().required(),

  monthlyIncome: Joi.string().required(),

  educationLevel: Joi.string().required(),

  investmentExperience: Joi.string().required(),

  totalNetWorth: Joi.string().required(),

  dependentsOnIncome: Joi.string().required(),

  marketVolatilityReaction: Joi.string().required()
});

export const kycStepsSchema = () =>
  Joi.object({
    accountType: Joi.string()
      .valid(ACCOUNT_TYPES.NORMAL, ACCOUNT_TYPES.SAHULAT)
      .required()
      .messages({
        'any.required': 'Account type is required',
        'any.only': 'Account type must be either "normal" or "sahulat"'
      }),

    personal: Joi.when('accountType', {
      is: ACCOUNT_TYPES.SAHULAT,
      then: personalSchema(ACCOUNT_TYPES.SAHULAT),
      otherwise: personalSchema(ACCOUNT_TYPES.NORMAL)
    })
      .required()
      .messages({ 'any.required': 'Personal section is required' }),

    financial: Joi.when('accountType', {
      is: ACCOUNT_TYPES.SAHULAT,
      then: financialSchema(ACCOUNT_TYPES.SAHULAT),
      otherwise: financialSchema(ACCOUNT_TYPES.NORMAL)
    })
      .required()
      .messages({ 'any.required': 'Financial section is required' }),

    beneficiary: Joi.when('accountType', {
      is: ACCOUNT_TYPES.SAHULAT,
      then: beneficiarySchema(ACCOUNT_TYPES.SAHULAT),
      otherwise: beneficiarySchema(ACCOUNT_TYPES.NORMAL)
    }).optional(),

    investment: investmentSchema
      .required()
      .messages({ 'any.required': 'Investment section is required' })
  });
