import { asyncHandler } from '../../utils.js';

export const getUserProfile = asyncHandler(async (req, res) => {
  console.log('User Profile Controller: Fetching user profile');
  res.json({ message: 'User profile fetched successfully' });
});
