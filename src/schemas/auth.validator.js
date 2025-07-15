import Joi from 'joi';

const registerSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address'
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
  accountType: Joi.string().valid('Normal', 'Sahulat').required().messages({
    'any.required': 'Account type is required',
    'string.valid': 'Account type must be either "Normal" or "Sahulat"'
  })
});

export {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendOTPSchema,
  accountTypeSchema
};
