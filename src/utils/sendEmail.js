import axios from 'axios';
import { BREVO_API_KEY, BREVO_SENDER_EMAIL } from '../configs/env.config.js';
import { BREVO_API_URL } from '../constants/index.js';
import logger from './logger.js';

export const sendEmail = async ({ to, subject, htmlContent }) => {
  const payload = {
    sender: {
      name: 'Tijori Robo Investing',
      email: BREVO_SENDER_EMAIL
    },
    to: [{ email: to }],
    subject,
    htmlContent
  };

  const headers = {
    'api-key': BREVO_API_KEY,
    'Content-Type': 'application/json'
  };

  try {
    const { data } = await axios.post(BREVO_API_URL, payload, { headers });
    return data;
  } catch (e) {
    logger.error('Email send error:', e.response?.data || e.message);
    throw new Error(e.response?.data?.message || 'Failed to send email');
  }
};
