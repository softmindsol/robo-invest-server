export const generateOtpEmail = (otp, userName) => `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      
      <!-- Header -->
      <div style="background-color: #059669; padding: 30px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px;">🔐 Email Verification</h1>
      </div>

      <!-- Body -->
      <div style="padding: 30px; color: #333333; line-height: 1.6;">
        <p style="font-size: 16px;">Hello ${userName},</p>
        <p style="font-size: 16px;">We noticed a login attempt to your <strong>Tijori Robo Investing</strong> account. Please use the OTP below to verify your email and complete your login:</p>
        
        <!-- OTP Code -->
        <div style="margin: 30px 0; text-align: center;">
          <span style="display: inline-block; background-color: #e6f4ef; color: #059669; font-size: 28px; font-weight: bold; padding: 15px 30px; border-radius: 8px; letter-spacing: 4px;">${otp}</span>
        </div>

        <p style="font-size: 14px; color: #555555;">
          This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.
        </p>

        <p style="font-size: 14px; color: #555555;">
          If you did not attempt to login, we recommend changing your password immediately.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f4f6f8; padding: 20px; text-align: center; font-size: 12px; color: #888888;">
        Sent by Tijori Robo Investing • &copy; ${new Date().getFullYear()} All Rights Reserved
      </div>
    </div>
  </div>
`;
