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
    .min(8)
    .max(128)
    .pattern(
      new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])')
    )
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
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

  password: Joi.string()
    .trim()
    .min(8)
    .max(128)
    .pattern(
      new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])')
    )
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 128 characters',
      'string.pattern.base':
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
    })
});

export { registerSchema, loginSchema };
