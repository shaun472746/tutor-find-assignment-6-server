import AppError from '../../app/utils/AppError';
import {
  TLoginUser,
  TUpdatePassword,
  TUser,
  TUserWithId,
  ITutorProfile,
} from './user_auth.interface';
import { User, TutorProfile } from './user_auth.model';
import mongoose from 'mongoose';
import { createToken } from './user_auth.utils';
import config from '../../app/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const createUserIntoDB = async (user: TUser) => {
  await User.create(user);
  const result = (await User.isUserExistsByEmail(user.email)) as TUserWithId;

  const jwtPayload = {
    userEmail: result.email,
    role: result.role,
    userId: result._id,
    name: result.name,
    updateProfile: result.updateProfile,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );
  return {
    accessToken,
    refreshToken,
  };
};

const loginUser = async (payload: TLoginUser) => {
  const user = (await User.isUserExistsByEmail(payload.email)) as TUserWithId;

  if (!user) {
    throw new AppError(401, 'Invalid credentials');
  }

  if (user.isBlocked) {
    throw new AppError(403, 'User is blocked!');
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(401, 'Invalid credentials');
  }

  const jwtPayload = {
    userEmail: user.email,
    role: user.role,
    userId: user._id,
    name: user.name,
    updateProfile: user.updateProfile,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;
  const { iat, userEmail } = decoded;

  // checking if the user is exist
  const user = (await User.isUserExistsByEmail(userEmail)) as TUserWithId;

  if (!user) {
    throw new AppError(404, 'This user is not found !');
  }
  // checking if the user is already deleted
  const userStatus = user?.isBlocked;

  if (userStatus) {
    throw new AppError(403, 'This user is Blocked !');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(401, 'You are not authorized !');
  }

  const jwtPayload = {
    userEmail: user.email,
    role: user.role,
    userId: user._id,
    name: user.name,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

const getUsersFromDB = async () => {
  const allUsers = await User.find({ role: 'user' }).select(
    '-password -createdAt -updatedAt -__v'
  );
  return allUsers;
};
const updateUserStatus = async (id: string) => {
  const user: Record<string, unknown> = (await User.findOne({ _id: id })) || {};

  await User.findByIdAndUpdate(id, {
    $set: { isBlocked: !user.isBlocked },
  });
  return;
};

const updatePasswordInDB = async (
  passwordInfo: TUpdatePassword,
  userInfo: JwtPayload
) => {
  const user = (await User.findOne({ _id: userInfo.userId })) as TUserWithId;
  const isMatched = await bcrypt.compare(
    passwordInfo.oldPassword,
    user.password
  );
  if (!isMatched) {
    throw new AppError(403, 'Old password does not match!');
  }
  const newPassword = await bcrypt.hash(
    passwordInfo.newPassword,
    Number(config.bcrypt_salt)
  );
  await User.findByIdAndUpdate(userInfo.userId, {
    $set: { password: newPassword },
  });
  return;
};

const getUserFromDB = async (userId: string) => {
  const user = (await User.findOne({ _id: userId })) as TUserWithId;
  const jwtPayload = {
    userEmail: user!.email,
    role: user!.role,
    userId: user!._id,
    name: user!.name,
    updateProfile: user!.updateProfile,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return accessToken;
};

/**
 * create tutor profile
 */
const createTutorProfileIntoDB = async (profile: ITutorProfile) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    await User.findByIdAndUpdate(
      profile.id,
      {
        $set: { updateProfile: false },
      },
      { session, new: true }
    );
    await TutorProfile.create([{ ...profile }], { session });
    await session.commitTransaction();
    await session.endSession();
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getUserProfileFromDB = async (id: string) => {
  const profile = (await TutorProfile.findOne({ id: id })) as ITutorProfile;
  return profile;
};

export const UserServices = {
  createUserIntoDB,
  loginUser,
  refreshToken,
  getUsersFromDB,
  updateUserStatus,
  updatePasswordInDB,
  createTutorProfileIntoDB,
  getUserFromDB,
  getUserProfileFromDB,
};
