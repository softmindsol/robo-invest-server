export const AUTH_CONSTANTS = {
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
  USER: 'User',
  ADMIN: 'Admin'
};

export const MAX_LOGIN_ATTEMPTS = 5; // Maximum allowed login attempts
export const LOCK_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

export const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export const ACCOUNT_TYPES = {
  NORMAL: 'Normal',
  SAHULAT: 'Sahulat'
};

export const SUBSCRIPTION_PLANS = {
  ROBO_PRO: 'Robo Pro',
  ROBO_ELITE: 'Robo Elite'
};

export const PLAN_PRICE_IDS = {
  ROBO_PRO_MONTHLY: 'price_1Hh7Y2Lz4k8Z2Lz4k8Z2Lz4k8', // Replace with actual price ID
  ROBO_PRO_YEARLY: 'price_2Hh7Y2Lz4k8Z2Lz4k8Z2Lz4k8', // Replace with actual price ID
  ROBO_ELITE_MONTHLY: 'price_3Hh7Y2Lz4k8Z2Lz4k8Z2Lz4k8', // Replace with actual price ID
  ROBO_ELITE_YEARLY: 'price_4Hh7Y2Lz4k8Z2Lz4k8Z2Lz4k8' // Replace with actual price ID
};
