import dotenv from 'dotenv';
dotenv.config({
  path: './.env'
});

const {
  PORT,
  CORS_ORIGIN,
  MONGODB_URI,
  DB_NAME,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY
} = process.env;

export {
  PORT,
  CORS_ORIGIN,
  MONGODB_URI,
  DB_NAME,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY
};
