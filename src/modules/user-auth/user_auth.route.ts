import express from 'express';
import validateMiddleware from '../../app/middleware/validateRequest';
import { userValidations } from './user_auth.validation';
import { UserControllers } from './user_auth.controller';
import auth from '../../app/middleware/auth';
import { USER_ROLE } from './user_auth.constant';

const router = express.Router();

router.post(
  '/login',
  validateMiddleware(userValidations.loginValidationSchema),
  UserControllers.userLogin
);

router.post(
  '/register',

  validateMiddleware(userValidations.createUserValidationSchema),
  UserControllers.createUser
);

router.post(
  '/update-tutor-profile',
  auth(USER_ROLE.tutor),
  validateMiddleware(userValidations.tutorValidationSchema),
  UserControllers.createTutorProfile
);

router.post(
  '/upload-profile-image',
  auth(USER_ROLE.student, USER_ROLE.tutor),
  validateMiddleware(userValidations.uploadProfileImageValidationSchema),
  UserControllers.uploadProfileImgController
);

router.get('/get-user-detail/:userId', UserControllers.getUserInfo);
router.get(
  '/tutor-profile-detail/:userId',
  UserControllers.getUserProfileDetail
);

router.post(
  '/refresh-token',
  // validateMiddleware(userValidations.refreshTokenValidationSchema),
  UserControllers.refreshToken
);

export const UserRoutes = router;
