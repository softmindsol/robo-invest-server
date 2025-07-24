import cron from 'node-cron';
import { TokenService } from '../services/auth/token.service.js';
import logger from './logger.js';

// Run cleanup every day at 2 AM
export const startTokenCleanup = () => {
  cron.schedule('0 2 * * *', async () => {
    try {
      logger.info('Starting token cleanup...');
      const result = await TokenService.cleanupExpiredTokens();
      logger.info(`Token cleanup completed. Removed ${result.deletedCount} expired tokens.`);
    } catch (error) {
      logger.error('Token cleanup failed:', error);
    }
  });
  
  logger.info('Token cleanup scheduler started');
};