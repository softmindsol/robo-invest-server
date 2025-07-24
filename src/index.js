import dotenv from 'dotenv';
import http from 'http';

import { app } from './app.js';
import connectDB from './configs/db.config.js';
import logger from './utils/logger.js';

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 8000;

// Connect to database
connectDB();

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
