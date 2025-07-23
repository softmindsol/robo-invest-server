import postmark from 'postmark';
import {
  POSTMARK_API_KEY,
  POSTMARK_FROM_EMAIL
} from '../configs/env.config.js';
import logger from './logger.js';

const client = new postmark.ServerClient(POSTMARK_API_KEY);

export const sendEmail = async ({ to, subject, htmlContent }) => {
  const payload = {
    From: POSTMARK_FROM_EMAIL,
    To: to,
    Subject: subject,
    HtmlBody: htmlContent,
    TextBody: 'This is a fallback plain text version.',
    MessageStream: 'outbound'
  };

  try {
    const response = await client.sendEmail(payload);
    return response;
  } catch (e) {
    logger.error('Email send error:', e.message || e);
    throw new Error(e.message || 'Failed to send email');
  }
};
