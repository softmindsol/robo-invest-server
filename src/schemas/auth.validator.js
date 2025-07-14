import Joi from 'joi';

const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(30).required().messages({
    'string.empty': 'Full name is required',
    'string.min': 'Full name must be at least 2 characters long',
    'string.max': 'Full name must not exceed 30 characters'
  }),

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
    }),

  role: Joi.string()
    .valid(
      'Super Admin',
      'Admin',
      'Care Manager',
      'Frontline Staff',
      'Finance',
      'Recruitment',
      'Service User'
    )
    .required()
    .messages({
      'any.only': 'Role must be a valid predefined role',
      'string.empty': 'Role is required'
    }),

  // 💥 Additional fields for "Service User"
  address: Joi.when('role', {
    is: 'Service User',
    then: Joi.string()
      .required()
      .messages({ 'any.required': 'Address is required for Service User' }),
    otherwise: Joi.optional()
  }),

  phoneNumber: Joi.when('role', {
    is: 'Service User',
    then: Joi.string().required().messages({
      'any.required': 'Phone number is required for Service User'
    }),
    otherwise: Joi.optional()
  }),

  dateOfBirth: Joi.when('role', {
    is: 'Service User',
    then: Joi.date().required().messages({
      'any.required': 'Date of birth is required for Service User'
    }),
    otherwise: Joi.optional()
  }),

  careLevel: Joi.when('role', {
    is: 'Service User',
    then: Joi.string().optional(),
    otherwise: Joi.optional()
  }),

  status: Joi.when('role', {
    is: 'Service User',
    then: Joi.string().optional(),
    otherwise: Joi.optional()
  }),

  primaryCarer: Joi.when('role', {
    is: 'Service User',
    then: Joi.string().optional(),
    otherwise: Joi.optional()
  }),

  emergencyContact: Joi.when('role', {
    is: 'Service User',
    then: Joi.string().optional(),
    otherwise: Joi.optional()
  }),

  medicalConditions: Joi.when('role', {
    is: 'Service User',
    then: Joi.array().items(Joi.string()).optional(),
    otherwise: Joi.optional()
  }),

  additionalNotes: Joi.when('role', {
    is: 'Service User',
    then: Joi.string().optional(),
    otherwise: Joi.optional()
  }),

  // 💥 Admin role specific
  department: Joi.when('role', {
    is: 'Admin',
    then: Joi.string()
      .required()
      .messages({ 'any.required': 'Department is required for Admin' }),
    otherwise: Joi.optional()
  }),

  // 💥 Care Manager
  assignedRegions: Joi.when('role', {
    is: 'Care Manager',
    then: Joi.array().items(Joi.string()).optional(),
    otherwise: Joi.optional()
  }),

  // 💥 Frontline Staff
  shift: Joi.when('role', {
    is: 'Frontline Staff',
    then: Joi.string().optional(),
    otherwise: Joi.optional()
  }),

  // 💥 Finance
  financeDepartmentCode: Joi.when('role', {
    is: 'Finance',
    then: Joi.string().optional(),
    otherwise: Joi.optional()
  }),

  // 💥 Recruitment
  recruiterLevel: Joi.when('role', {
    is: 'Recruitment',
    then: Joi.string().optional(),
    otherwise: Joi.optional()
  })
});

const loginSchema = Joi.object({
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

export { registerSchema, loginSchema };
