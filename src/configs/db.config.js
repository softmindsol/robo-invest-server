import mongoose from 'mongoose';
import { DB_NAME, MONGODB_URI } from './env.config.js';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGODB_URI}/${DB_NAME}`
    );
    logger.info(
      `\n MongoDB connected ✅ !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    logger.error('MONGODB connection FAILED', error);
    process.exit(1);
  }
};

export default connectDB;
