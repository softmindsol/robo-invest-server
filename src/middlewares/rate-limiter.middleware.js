import rateLimit from 'express-rate-limit';

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute = 60,000 milliseconds
  max: 3, // Limit each IP to 3 requests per windowMs
  message: 'Too many requests, try again later.'
});

export default rateLimiter;
