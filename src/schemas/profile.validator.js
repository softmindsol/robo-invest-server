import Joi from 'joi';
import { isValidPhoneNumber } from 'libphonenumber-js';

const updatePersonalInfoSchema = Joi.object({
  firstName: Joi.string().min(2).optional().messages({
    'string.base': 'First Name must be a valid string',
    'string.min': 'First Name must be at least 2 characters long'
  }),

  lastName: Joi.string().min(2).optional().messages({
    'string.base': 'Last Name must be a valid string',
    'string.min': 'Last Name must be at least 2 characters long'
  }),

  CNICNumber: Joi.string()
    .length(13)
    .pattern(/^[0-9]+$/)
    .optional()
    .messages({
      'string.base': 'CNIC Number must be a valid string of 13 digits',
      'string.length': 'CNIC Number must be 13 digits long',
      'string.pattern.base': 'CNIC Number must contain only numbers'
    }),

  issueDate: Joi.date().optional().messages({
    'date.base': 'Issue Date must be a valid date'
  }),

  expireDate: Joi.date().greater(Joi.ref('issueDate')).optional().messages({
    'date.base': 'Expire Date must be a valid date',
    'date.greater': 'Expire Date must be after Issue Date'
  }),

  gender: Joi.string().valid('Male', 'Female', 'Other').optional().messages({
    'any.only': 'Gender must be one of Male, Female, or Other'
  }),

  maritalStatus: Joi.string()
    .valid('Single', 'Married', 'Divorced', 'Widowed')
    .optional()
    .messages({
      'any.only': 'Marital Status must be one of Single, Married, Divorced, or Widowed'
    }),

  dateOfBirth: Joi.date().less('now').optional().messages({
    'date.less': 'Date of Birth must be in the past'
  }),

  permanentAddress: Joi.string().min(5).max(250).optional().messages({
    'string.min': 'Permanent Address must be at least 5 characters long',
    'string.max': 'Permanent Address cannot exceed 250 characters'
  }),

  fathersOrHusbandsName: Joi.object({
    selection: Joi.string().valid('Father', 'Husband').optional().messages({
      'any.only': 'Selection must be either Father or Husband'
    }),
    name: Joi.string().min(2).optional().messages({
      'string.base': 'Father\'s/Husband\'s Name must be a valid string',
      'string.min': 'Name must be at least 2 characters long'
    })
  }).optional(),

  mothersName: Joi.string().min(2).optional().messages({
    'string.base': 'Mother\'s Name must be a valid string',
    'string.min': 'Mother\'s Name must be at least 2 characters long'
  }),

  placeOfBirth: Joi.string().min(2).max(100).optional().messages({
    'string.min': 'Place of Birth must be at least 2 characters long',
    'string.max': 'Place of Birth cannot exceed 100 characters'
  }),

  nationality: Joi.string().optional().messages({
    'string.base': 'Nationality must be a valid string'
  }),

  dualNationality: Joi.boolean().optional().messages({
    'boolean.base': 'Dual Nationality must be true or false'
  })
});

const updateContactInfoSchema = Joi.object({
  phoneNumber: Joi.string()
    .custom((value, helpers) => {
      if (value && !isValidPhoneNumber(value)) {
        return helpers.message('Phone Number must be a valid global number');
      }
      return value;
    })
    .optional()
    .messages({
      'string.base': 'Phone Number must be a valid string'
    }),

  permanentAddress: Joi.string().min(5).max(250).optional().messages({
    'string.min': 'Permanent Address must be at least 5 characters long',
    'string.max': 'Permanent Address cannot exceed 250 characters'
  })
});

const updateFinancialInfoSchema = Joi.object({
  occupation: Joi.string().optional(),
  occupationIndustry: Joi.string().optional(),
  incomeSource: Joi.string().optional(),
  employerAddress: Joi.string().optional(),
  employerCountry: Joi.string().optional(),
  yearsEmployed: Joi.number().min(0).optional(),
  salaryAmount: Joi.number().min(0).optional(),
  grossAnnualIncome: Joi.when('$accountType', {
    is: 'Normal',
    then: Joi.number().min(0).optional(),
    otherwise: Joi.forbidden()
  }),
  numberOfDependents: Joi.when('$accountType', {
    is: 'Normal',
    then: Joi.number().min(0).optional(),
    otherwise: Joi.forbidden()
  }),
  taxFilingStatus: Joi.boolean().optional(),
  NTN: Joi.string().allow('', null).optional(),
  deductZakat: Joi.boolean().optional(),
  existingInvestmentAccount: Joi.boolean().optional()
});

const updateBeneficiaryInfoSchema = Joi.object({
  name: Joi.string().optional(),
  CNICNumber: Joi.string()
    .length(13)
    .pattern(/^[0-9]+$/)
    .optional()
    .messages({
      'string.length': 'CNIC Number must be 13 digits long',
      'string.pattern.base': 'CNIC Number must contain only numbers'
    }),
  address: Joi.string().optional(),
  contactNumber: Joi.string().optional(),
  relationship: Joi.string().optional(),
  isForeigner: Joi.boolean().optional(),

  passportDetails: Joi.when('isForeigner', {
    is: true,
    then: Joi.object({
      passportNumber: Joi.string()
        .pattern(/^[A-Za-z0-9]{5,20}$/)
        .optional()
        .messages({
          'string.pattern.base': 'Passport Number must be 5–20 characters, letters or numbers only'
        }),
      placeOfIssue: Joi.string().optional(),
      dateOfIssue: Joi.date().optional(),
      dateOfExpiry: Joi.date().greater(Joi.ref('dateOfIssue')).optional().messages({
        'date.greater': 'Date of Expiry must be after Date of Issue'
      })
    }).optional(),
    otherwise: Joi.forbidden()
  }),

  fatcaCompliance: Joi.when('$accountType', {
    is: 'Normal',
    then: Joi.object({
      hasUSCitizenshipOrGreenCard: Joi.boolean().optional(),
      bornInUSA: Joi.boolean().optional(),
      hasUSAddress: Joi.boolean().optional(),
      USAddress: Joi.string().allow('').optional(),
      hasUSTelephone: Joi.boolean().optional(),
      USTelephone: Joi.string().allow('').optional(),
      POAWithUSTransferAgent: Joi.boolean().optional()
    }).optional(),
    otherwise: Joi.forbidden()
  }),

  standardDueDiligence: Joi.when('$accountType', {
    is: 'Normal',
    then: Joi.object({
      isPEP: Joi.boolean().optional(),
      pepDetails: Joi.string().allow('').optional(),
      hasRefusedAccount: Joi.boolean().optional(),
      refusalDetails: Joi.string().allow('').optional(),
      hasOffshoreLinks: Joi.boolean().optional(),
      offshoreLinksDetails: Joi.string().allow('').optional(),
      ownsHighValueItems: Joi.boolean().optional(),
      highValueDetails: Joi.string().allow('').optional()
    }).optional(),
    otherwise: Joi.forbidden()
  })
});

const updateInvestmentGoalsSchema = Joi.object({
  objective: Joi.string()
    .valid('Retirement', 'Higher Education', 'Buy property', 'Long term wealth')
    .optional(),

  timeHorizon: Joi.string()
    .valid(
      '1 to 2 years',
      '3 to 5 years',
      '6 to 10 years',
      '11 to 20 years',
      'Over 20 years'
    )
    .optional(),

  monthlyIncome: Joi.string()
    .valid(
      '25,000 to 50,000',
      '50,000 to 100,000',
      '100,000 to 200,000',
      '200,000 to 500,000',
      '500,000 to 1 million',
      'Rs. 1 million +'
    )
    .optional(),

  educationLevel: Joi.string()
    .valid(
      'Matric',
      'Intermediate',
      'A Levels',
      'Bachelors',
      'Masters or Higher'
    )
    .optional(),

  investmentExperience: Joi.string()
    .valid('Beginner', 'Intermediate', 'Advance')
    .optional(),

  totalNetWorth: Joi.string()
    .valid(
      'Under Rs. 1 million',
      'Between Rs. 1 and 3 million',
      'Between Rs. 5 and 10 million',
      'More than Rs. 10 million'
    )
    .optional(),

  dependentsOnIncome: Joi.string()
    .valid('0', '1', '2 or more', '4 or more')
    .optional(),

  marketVolatilityReaction: Joi.string()
    .valid('Buy more', 'Sell everything', 'Hold investments, do nothing')
    .optional()
});

export {
  updatePersonalInfoSchema,
  updateContactInfoSchema,
  updateFinancialInfoSchema,
  updateBeneficiaryInfoSchema,
  updateInvestmentGoalsSchema
};