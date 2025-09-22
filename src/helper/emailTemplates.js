export const generateOtpEmail = (otp, userName) => `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      
      <!-- Header -->
      <div style="background-color: #059669; padding: 30px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px;">📩 Verify Your Email</h1>
      </div>

      <!-- Body -->
      <div style="padding: 30px; color: #333333; line-height: 1.6;">
        <p style="font-size: 16px;">Hello ${userName},</p>
        <p style="font-size: 16px;">
          Thank you for creating an account with <strong>Tijori Robo Investing</strong>. 
          To complete your registration and activate your account, please verify your email using the OTP below:
        </p>
        
        <!-- OTP Code -->
        <div style="margin: 30px 0; text-align: center;">
          <span style="display: inline-block; background-color: #e6f4ef; color: #059669; font-size: 28px; font-weight: bold; padding: 15px 30px; border-radius: 8px; letter-spacing: 4px;">${otp}</span>
        </div>

        <p style="font-size: 14px; color: #555555;">
          This OTP is valid for <strong>10 minutes</strong>. Please enter it in the app to verify your email.
        </p>

        <p style="font-size: 14px; color: #555555;">
          If you did not create this account, you can safely ignore this email.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f4f6f8; padding: 20px; text-align: center; font-size: 12px; color: #888888;">
        Sent by Tijori Robo Investing • &copy; ${new Date().getFullYear()} All Rights Reserved
      </div>
    </div>
  </div>
`;

export const generateResetPasswordEmail = (otp, userName) => `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      
      <!-- Header -->
      <div style="background-color: #dc2626; padding: 30px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px;">🔑 Reset Your Password</h1>
      </div>

      <!-- Body -->
      <div style="padding: 30px; color: #333333; line-height: 1.6;">
        <p style="font-size: 16px;">Hello ${userName},</p>
        <p style="font-size: 16px;">
          We received a request to reset the password for your <strong>Tijori Robo Investing</strong> account. 
          Use the OTP code below to proceed with resetting your password:
        </p>
        
        <!-- OTP Code -->
        <div style="margin: 30px 0; text-align: center;">
          <span style="display: inline-block; background-color: #fef2f2; color: #dc2626; font-size: 28px; font-weight: bold; padding: 15px 30px; border-radius: 8px; letter-spacing: 4px;">${otp}</span>
        </div>

        <p style="font-size: 14px; color: #555555;">
          This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.
        </p>

        <p style="font-size: 14px; color: #555555;">
          If you did not request a password reset, you can safely ignore this email. Your account will remain secure.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f4f6f8; padding: 20px; text-align: center; font-size: 12px; color: #888888;">
        Sent by Tijori Robo Investing • &copy; ${new Date().getFullYear()} All Rights Reserved
      </div>
    </div>
  </div>
`;
