export const generateOtpEmail = (otp) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
      <h2 style="margin-top: 0; color: #1e1c23;">🔐 Email Verification OTP</h2>
      <p style="color: #333;">We noticed a login attempt to your Tijori Robo Investing account.</p>
      <p style="font-size: 16px; font-weight: bold; color: #333;">Your OTP: <span style="color: #1e90ff;">${otp}</span></p>
      <p style="color: #333;">This OTP is valid for 5 minutes. Please enter it to complete your login.</p>
      <p style="color: #333;">If this wasn’t you, we recommend changing your password immediately.</p>
      <hr />
      <p style="font-size: 13px; color: #888;">Sent by Tijori Robo Investing</p>
    </div>
  </div>
`;
