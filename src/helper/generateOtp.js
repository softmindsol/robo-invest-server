const generateSixDigitOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const createOTPWithExpiry = () => {
  const otp = generateSixDigitOTP();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
  return { otp, expiry };
};

export { createOTPWithExpiry };
