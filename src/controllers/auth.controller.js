import {
  asyncHandler,
  checkField,
  handleError,
  sendResponse
} from '../utils/index.js';
import { userDB } from '../instances/db.instance.js';
import { STATUS_CODES } from '../constants/index.js';
import User, { Admin, ServiceUser, SuperAdmin } from '../models/user.model.js';

const register = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  if (role === 'Super Admin') {
    const superAdminExists = await User.findOne({ role: 'Super Admin' });
    if (superAdminExists) {
      handleError(
        next,
        'Super Admin already exists.',
        STATUS_CODES.BAD_REQUEST
      );
    }
  }

  let createdUser;

  if (role === 'Service User') {
    createdUser = await ServiceUser.create(req.body);
  } else if (role === 'Super Admin') {
    createdUser = await SuperAdmin.create(req.body);
  } else if (role === 'Admin') {
    createdUser = await Admin.create(req.body);
  } else {
    createdUser = await User.create(req.body);
  }

  sendResponse(
    res,
    STATUS_CODES.CREATED,
    `${createdUser.role} created successfully`
  );
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await userDB.findOne({ username }, '+password');
  checkField(!user, 'Invalid username or password');

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  checkField(!isPasswordCorrect, 'Invalid username or password');

  const accessToken = user.generateAccessToken();
  user.accessToken.push(accessToken);

  await user.save();

  sendResponse(
    res,
    STATUS_CODES.SUCCESS,
    `${user.role} logged in successfully`,
    {
      accessToken
    }
  );
});

const logout = asyncHandler(async (req, res) => {
  const accessToken = req?.headers['authorization']?.split(' ')[1];
  const userId = req.user._id;

  checkField(!accessToken, 'You are already logged out');

  const user = await userDB.removeAccessToken(userId, accessToken);

  checkField(!user, 'User not found or session expired');

  sendResponse(
    res,
    STATUS_CODES.SUCCESS,
    `${user.role} Logged out Successfully`
  );
});

export { register, login, logout };
