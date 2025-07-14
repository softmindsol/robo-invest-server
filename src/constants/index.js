export const AUTH_CONSTANTS = {
  OTP_EXPIRY: 2 * 60 * 1000,
  OTP_LENGTH: 6,
  OTP_MIN: 100000,
  OTP_MAX: 999999,
  RATE_LIMIT_MINUTES: 2,
  EMAIL_REGEX: /^\S+@\S+\.\S+$/
};

export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  SERVICE_UNAVAILABLE: 503
};

export const MESSAGES = {
  SUCCESS: 'Success',
  ERROR: 'An error occurred, please try again later',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  FORBIDDEN: 'Access to this resource is forbidden',
  VALIDATION_ERROR: 'There was a validation error with your request',
  UPLOAD_ERROR: 'There was a problem uploading the file',
  CREATION_ERROR: 'There was a problem creating the resource',
  UPDATE_ERROR: 'There was a problem updating the resource',
  DELETION_ERROR: 'There was a problem deleting the resource',
  INVALID_CREDENTIALS: 'Invalid email or password',
  ALREADY_EXISTS: 'Already exists'
};

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  CARE_MANAGER: 'Care Manager',
  FRONTLINE_STAFF: 'Frontline Staff',
  FINANCE: 'Finance',
  RECRUITMENT: 'Recruitment',
  SERVICE_USER: 'Service User'
};

export const ROLE_PERMISSIONS = {
  'Super Admin': [
    'dashboard:R/W/D',
    'service-users:R/W/D',
    'staff:R/W/D',
    'care-planning:R/W/D',
    'tasks:R/W/D',
    'rostering:R/W/D',
    'form-builder:R/W',
    'compliance:R/W/D',
    'medications:R/W',
    'policies:R/W/D',
    'reports-analytics:R/W',
    'billing:R/W',
    'recruitment:R/W/D',
    'settings:R/W/D',
    'holiday-planner:R/W'
  ],
  Admin: [
    'dashboard:R/W',
    'service-users:R/W',
    'staff:R/W',
    'care-planning:R/W',
    'tasks:R/W',
    'rostering:R/W',
    'form-builder:R/W',
    'compliance:R/W',
    'medications:R/W',
    'policies:R/W',
    'reports-analytics:R/W',
    'billing:R',
    'recruitment:R/W',
    'settings:R/W',
    'holiday-planner:R/W'
  ],
  'Care Manager': [
    'dashboard:R',
    'service-users:R/W',
    'staff:R',
    'care-planning:R/W',
    'tasks:R/W',
    'rostering:R',
    'form-builder:R',
    'compliance:R/W',
    'medications:R/W',
    'policies:R/W',
    'reports-analytics:R',
    'holiday-planner:R/W'
  ],
  'Frontline Staff': [
    'dashboard:R',
    'service-users:R/U',
    'care-planning:R/W',
    'tasks:R/U',
    'rostering:R',
    'compliance:R',
    'medications:R/U',
    'reports-analytics:R'
  ],
  Finance: [
    'dashboard:R',
    'service-users:R',
    'policies:R',
    'reports-analytics:R/W',
    'billing:R/W'
  ],
  Recruitment: [
    'dashboard:R',
    'staff:R/W',
    'recruitment:R/W/D',
    'reports-analytics:R'
  ],
  'Service User': [
    'dashboard:R',
    'service-users:R',
    'care-planning:R',
    'policies:R',
    'reports-analytics:R',
    'billing:R'
  ]
};
