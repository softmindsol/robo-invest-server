import {
  asyncHandler,
  checkField,
  sendResponse,
  handleError
} from '../../utils/index.js';
import { STATUS_CODES } from '../../constants/index.js';
import { TokenService } from '../../services/auth/token.service.js';

export const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  
  checkField(!refreshToken, 'Refresh token is required', STATUS_CODES.BAD_REQUEST);
  
  try {
    const deviceInfo = TokenService.extractDeviceInfo(req);
    const tokenPair = await TokenService.refreshAccessToken(refreshToken, deviceInfo);
    
    sendResponse(res, STATUS_CODES.SUCCESS, 'Tokens refreshed successfully', tokenPair);
  } catch (error) {
    if (error.message.includes('expired')) {
      handleError(next, STATUS_CODES.UNAUTHORIZED, 'Refresh token expired. Please login again.');
    } else if (error.message.includes('Invalid') || error.message.includes('not found')) {
      handleError(next, STATUS_CODES.UNAUTHORIZED, 'Invalid refresh token. Please login again.');
    } else {
      handleError(next, STATUS_CODES.INTERNAL_SERVER_ERROR, 'Token refresh failed');
    }
  }
});

export const revokeToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  checkField(!refreshToken, 'Refresh token is required', STATUS_CODES.BAD_REQUEST);
  
  await TokenService.revokeRefreshToken(refreshToken, 'user', 'Manual token revocation');
  
  sendResponse(res, STATUS_CODES.SUCCESS, 'Token revoked successfully');
});

export const revokeAllTokens = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  await TokenService.revokeAllUserTokens(userId, 'user', 'Revoke all sessions');
  
  sendResponse(res, STATUS_CODES.SUCCESS, 'All tokens revoked successfully');
});

export const getUserSessions = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const sessions = await TokenService.getUserSessions(userId);
  
  sendResponse(res, STATUS_CODES.SUCCESS, 'User sessions retrieved successfully', {
    sessions,
    totalSessions: sessions.length
  });
});

export const revokeSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const userId = req.user._id;
  
  const session = await RefreshToken.findOne({
    _id: sessionId,
    user: userId,
    isActive: true
  });
  
  checkField(!session, 'Session not found', STATUS_CODES.NOT_FOUND);
  
  await session.revoke('user', 'Manual session termination');
  
  sendResponse(res, STATUS_CODES.SUCCESS, 'Session revoked successfully');
});