import Joi from 'joi';

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
      'any.only':
        'Marital Status must be one of Single, Married, Divorced, or Widowed'
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
      'string.base': 'Father/Husband Name must be a valid string',
      'string.min': 'Name must be at least 2 characters long'
    })
  }).optional(),

  mothersName: Joi.string().min(2).optional().messages({
    'string.base': 'Mother Name must be a valid string',
    'string.min': 'Mother Name must be at least 2 characters long'
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

const ALLOWED_RISK_LEVELS = [
  'Very Conservative',
  'Conservative',
  'Moderate',
  'Growth',
  'Aggressive',
  'Very Aggressive',
];
const updateInvestmentRiskSchema = Joi.object({
  riskLevel: Joi.string()
    .valid(...ALLOWED_RISK_LEVELS)
    .required()
    .messages({
      'string.base': 'Risk level must be a valid string.',
      'any.only': `Risk level must be one of the following: ${ALLOWED_RISK_LEVELS.join(
        ', '
      )}.`,
      'any.required': 'Risk level is a required field.',
    }),
});

export { updatePersonalInfoSchema, updateInvestmentRiskSchema };
