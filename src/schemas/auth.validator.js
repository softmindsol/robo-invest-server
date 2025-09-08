import Joi from 'joi';
import { isValidPhoneNumber } from 'libphonenumber-js';

const registerSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address'
  }),

  phoneNumber: Joi.string()
    .custom((value, helpers) => {
      if (!isValidPhoneNumber(value)) {
        return helpers.message('Phone Number must be a valid global number');
      }
      return value;
    })
    .required()
    .messages({
      'string.base': 'Phone Number must be a valid string',
      'any.required': 'Phone Number is required'
    }),

  username: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(new RegExp('^[a-zA-Z][a-zA-Z0-9_.]*$'))
    .required()
    .messages({
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must not exceed 30 characters',
      'string.pattern.base':
        'Username must start with a letter and can only contain letters, numbers, underscores, and periods'
    }),

  password: Joi.string()
    .trim()
    .min(10)
    .max(128)
    .pattern(
      new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])')
    )
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 10 characters long',
      'string.max': 'Password must not exceed 128 characters',
      'string.pattern.base':
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),

  termsAccepted: Joi.boolean().valid(true).required().messages({
    'any.only': 'You must accept the terms and conditions.'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address'
  }),

  password: Joi.string().trim().min(10).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 10 characters long'
  })
});

const verifyEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address'
  }),
  otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
    'string.empty': 'OTP is required',
    'string.length': 'OTP must be exactly 6 digits',
    'string.pattern.base': 'OTP must contain only numbers'
  })
});

const resendOTPSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address'
  })
});

const accountTypeSchema = Joi.object({
  accountType: Joi.string().valid('normal', 'sahulat').required().messages({
    'any.required': 'Account type is required',
    'string.valid': 'Account type must be either "normal" or "sahulat"'
  })
});

const personalSchema = Joi.object({
  firstName: Joi.string().min(2).required().messages({
    'string.base': 'First Name must be a valid string',
    'string.empty': 'First Name is required',
    'string.min': 'First Name must be at least 2 characters long',
    'any.required': 'First Name is required'
  }),

  lastName: Joi.string().min(2).required().messages({
    'string.base': 'Last Name must be a valid string',
    'string.empty': 'Last Name is required',
    'string.min': 'Last Name must be at least 2 characters long',
    'any.required': 'Last Name is required'
  }),

  cnic: Joi.string()
    .length(13)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.base': 'CNIC Number must be a valid string of 13 digits',
      'string.empty': 'CNIC Number is required',
      'string.length': 'CNIC Number must be 13 digits long',
      'any.required': 'CNIC Number is required'
    }),

  issueDate: Joi.date().required().messages({
    'any.required': 'Issue Date is required'
  }),

  expireDate: Joi.date().greater(Joi.ref('issueDate')).required().messages({
    'any.required': 'Expire Date is required',
    'date.base': 'Expire Date must be a valid date',
    'date.greater': 'Expire Date must be after Issue Date'
  }),

  gender: Joi.string().valid('Male', 'Female', 'Other').required().messages({
    'string.base': 'Gender must be one of Male, Female, or Other',
    'any.required': 'Gender is required',
    'any.only': 'Gender must be one of Male, Female, or Other'
  }),

  maritalStatus: Joi.string()
    .valid('Single', 'Married', 'Divorced', 'Widowed')
    .required()
    .messages({
      'string.base':
        'Marital Status must be one of Single, Married, Divorced, or Widowed',
      'any.required': 'Marital Status is required',
      'any.only':
        'Marital Status must be one of Single, Married, Divorced, or Widowed'
    }),

  dob: Joi.date().less('now').required().messages({
    'any.required': 'Date of Birth is required',
    'date.less': 'Date of Birth must be in the past'
  }),

  permanentAddress: Joi.string().min(5).max(250).required().messages({
    'string.base': 'Permanent Address must be a valid string',
    'string.empty': 'Permanent Address is required',
    'string.min': 'Permanent Address must be at least 5 characters long',
    'string.max': 'Permanent Address cannot exceed 250 characters',
    'any.required': 'Permanent Address is required'
  }),

  nameType: Joi.string().valid('Father', 'Husband').required().messages({
    'string.base': 'You must select either Father or Husband',
    'any.required': 'Selection is required',
    'any.only': 'Selection must be either Father or Husband'
  }),
  fatherOrHusband: Joi.string().min(2).required().messages({
    'string.base': 'Father’s/Husband’s Name must be a valid string',
    'string.empty': 'Father’s/Husband’s Name cannot be empty',
    'any.required': 'Father’s/Husband’s Name is required'
  }),

  mothersName: Joi.string().min(2).required().messages({
    'string.base': 'Mother’s Name must be a valid string',
    'string.empty': 'Mother’s Name cannot be empty',
    'any.required': 'Mother’s Name is required'
  }),

  birthPlace: Joi.string().min(2).max(100).required().messages({
    'string.base': 'Place of Birth must be a valid string',
    'string.empty': 'Place of Birth cannot be empty',
    'any.required': 'Place of Birth is required'
  }),

  nationality: Joi.string().required().messages({
    'string.base': 'Nationality must be a valid string',
    'any.required': 'Nationality is required'
  }),

  dualNationality: Joi.boolean().valid(true, false).required().messages({
    'any.required': 'Dual Nationality is required',
    'any.only': 'Dual Nationality must be true or false'
  }),

  pakistaniCitizen: Joi.boolean()
    .valid(true)
    .when('$accountType', {
      is: 'sahulat',
      then: Joi.required().messages({
        'any.required': 'You must be a Pakistani Citizen to open this account'
      })
    })
    .optional()
});

const financialSchema = Joi.object({
  occupation: Joi.string().required(),
  occupationIndustry: Joi.string().required(),
  incomeSource: Joi.string().required(),
  employerAddress: Joi.string().required(),
  employerCountry: Joi.string().required(),
  yearsEmployed: Joi.number().min(0).required(),
  salaryAmount: Joi.number().min(0).required(),
  taxFilingStatus: Joi.boolean().required(),
  ntn: Joi.string().required(),
  deductZakat: Joi.boolean().default(false),
  investmentAccount: Joi.boolean().default(false),
  grossAnnualIncome: Joi.when('$accountType', {
    is: 'normal',
    then: Joi.number().min(0).required(),
    otherwise: Joi.forbidden()
  }),
  numberOfDependents: Joi.when('$accountType', {
    is: 'normal',
    then: Joi.number().min(0).required(),
    otherwise: Joi.forbidden()
  })
});

const beneficiariesSchema = Joi.object({
  name: Joi.string(),
  CNICNumber: Joi.string()
    .length(13)
    .pattern(/^[0-9]+$/)
    .messages({
      'string.base': 'CNIC Number must be a valid string of 13 digits',
      'string.empty': 'CNIC Number is required',
      'string.length': 'CNIC Number must be 13 digits long'
    }),
  address: Joi.string(),
  contactNumber: Joi.string(),
  relationship: Joi.string(),
  isForeigner: Joi.boolean(),

  passportDetails: Joi.when('isForeigner', {
    is: true,
    then: Joi.object({
      passportNumber: Joi.string()
        .trim()
        .pattern(/^[A-Za-z0-9]{5,20}$/)
        .allow('')
        .messages({
          'string.base': 'Passport Number must be a valid string',
          'string.pattern.base':
            'Passport Number must be 5–20 characters, letters or numbers only'
        }),
      placeOfIssue: Joi.string(),
      dateOfIssue: Joi.date().optional().messages({
        'date.base': 'Date of Issue must be a valid date'
      }),

      dateOfExpiry: Joi.date()
        .greater(Joi.ref('dateOfIssue'))
        .optional()
        .messages({
          'date.base': 'Date of Expiry must be a valid date',
          'date.greater': 'Date of Expiry must be after Date of Issue'
        })
    }),
    otherwise: Joi.forbidden()
  }),

  fatcaCompliance: Joi.when('$accountType', {
    is: 'normal',
    then: Joi.object({
      hasUSCitizenshipOrGreenCard: Joi.boolean(),
      bornInUSA: Joi.boolean(),
      hasUSAddress: Joi.boolean(),
      USAddress: Joi.string().allow('').when('hasUSAddress', {
        is: true,
        then: Joi.string()
      }),
      hasUSTelephone: Joi.boolean(),
      USTelephone: Joi.alternatives().conditional('hasUSTelephone', {
        is: true,
        then: Joi.string()
          .allow('')
          .custom((value, helpers) => {
            if (!value) return value;

            if (!isValidPhoneNumber(value)) {
              return helpers.message(
                'Phone Number must be a valid global number'
              );
            }
            return value;
          })
          .messages({
            'string.base': 'Phone Number must be a valid string'
          }),
        otherwise: Joi.string().allow('').optional()
      }),
      POAWithUSTransferAgent: Joi.boolean()
    }),
    otherwise: Joi.forbidden()
  }),

  standardDueDiligence: Joi.when('$accountType', {
    is: 'normal',
    then: Joi.object({
      isPEP: Joi.boolean(),
      pepDetails: Joi.string().allow('').when('isPEP', {
        is: true,
        then: Joi.string()
      }),
      hasRefusedAccount: Joi.boolean(),
      refusalDetails: Joi.string().allow('').when('hasRefusedAccount', {
        is: true,
        then: Joi.string()
      }),
      hasOffshoreLinks: Joi.boolean(),
      offshoreLinksDetails: Joi.string().allow('').when('hasOffshoreLinks', {
        is: true,
        then: Joi.string()
      }),
      ownsHighValueItems: Joi.boolean(),
      highValueDetails: Joi.string().allow('').when('ownsHighValueItems', {
        is: true,
        then: Joi.string()
      })
    }),
    otherwise: Joi.forbidden()
  })
});

const investmentGoalsSchema = Joi.object({
  objective: Joi.string()
    .valid('Retirement', 'Higher Education', 'Buy property', 'Long term wealth')
    .required(),

  timeHorizon: Joi.string()
    .valid(
      '1 to 2 years',
      '3 to 5 years',
      '6 to 10 years',
      '11 to 20 years',
      'Over 20 years'
    )
    .required(),

  monthlyIncome: Joi.string()
    .valid(
      '25,000 to 50,000',
      '50,000 to 100,000',
      '100,000 to 200,000',
      '200,000 to 500,000',
      '500,000 to 1 million',
      'Rs. 1 million +'
    )
    .required(),

  educationLevel: Joi.string()
    .valid(
      'Matric',
      'Intermediate',
      'A Levels',
      'Bachelors',
      'Masters or Higher'
    )
    .required(),

  investmentExperience: Joi.string()
    .valid('Beginner', 'Intermediate', 'Advance')
    .required(),

  totalNetWorth: Joi.string()
    .valid(
      'Under Rs. 1 million',
      'Between Rs. 1 and 3 million',
      'Between Rs. 5 and 10 million',
      'More than Rs. 10 million'
    )
    .required(),

  dependentsOnIncome: Joi.string()
    .valid('0', '1', '2 or more', '4 or more')
    .required(),

  marketVolatilityReaction: Joi.string()
    .valid('Buy more', 'Sell everything', 'Hold investments, do nothing')
    .required()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address'
  })
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address'
  }),
  newPassword: Joi.string()
    .trim()
    .min(10)
    .max(128)
    .pattern(
      new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])')
    )
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 10 characters long',
      'string.max': 'Password must not exceed 128 characters',
      'string.pattern.base':
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
    })
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().trim().required().messages({
    'string.empty': 'Current password is required'
  }),
  newPassword: Joi.string()
    .trim()
    .min(10)
    .max(128)
    .pattern(
      new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])')
    )
    .required()
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 10 characters long',
      'string.max': 'New password must not exceed 128 characters',
      'string.pattern.base':
        'New password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
    })
});

export {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendOTPSchema,
  accountTypeSchema,
  personalSchema,
  financialSchema,
  beneficiariesSchema,
  investmentGoalsSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema
};
