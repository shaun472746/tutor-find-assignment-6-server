import config from '../../app/config';
import sendResponse from '../../app/middleware/sendResponse';
import catchAsync from '../../app/utils/catchAsync';
import { UserServices } from './user_auth.service';

const createUser = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const updatePassword = catchAsync(async (req, res) => {
  await UserServices.updatePasswordInDB(req.body, req.user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password updated successfully',
  });
});

const userLogin = catchAsync(async (req, res) => {
  const result = await UserServices.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Login succesful',
    data: {
      token: accessToken,
      refreshToken: refreshToken,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { authorization } = req.headers;
  const result = await UserServices.refreshToken(
    authorization?.split(' ')[1] as string
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Access token is retrieved succesfully!',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getUsersFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All users are retrieved succesfully!',
    data: result,
  });
});

const deactivateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  await UserServices.updateUserStatus(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Status changed succesfully!',
  });
});

const getUserInfo = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.getUserFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully!',
    data: result,
  });
});

/**
 * update tutor profile
 */

const createTutorProfile = catchAsync(async (req, res) => {
  if (req.body._id) {
    await UserServices.updateTutorProfileData(req.body);
  } else {
    await UserServices.createTutorProfileIntoDB(req.body);
  }
  // await UserServices.createTutorProfileIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Profile updated successfully',
  });
});

/**
 * get profile detail
 */
const getUserProfileDetail = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.getUserProfileFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile detail retrieved successfully!',
    data: result,
  });
});

const uploadProfileImgController = catchAsync(async (req, res) => {
  await UserServices.profileImageUploadIntoDB(req.body, req.user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile image uploaded succesfully!',
  });
});

export const UserControllers = {
  createUser,
  userLogin,
  refreshToken,
  getAllUsers,
  deactivateUser,
  updatePassword,
  createTutorProfile,
  getUserInfo,
  getUserProfileDetail,
  uploadProfileImgController,
};
