import express from 'express';
import validateMiddleware from '../../app/middleware/validateRequest';
import { userValidations } from './user_auth.validation';
import { UserControllers } from './user_auth.controller';

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

  validateMiddleware(userValidations.tutorValidationSchema),
  UserControllers.createTutorProfile
);

router.get('/get-user-detail/:userId', UserControllers.getUserInfo);
router.get(
  '/tutor-profile-detail/:userId',
  UserControllers.getUserProfileDetail
);

export const UserRoutes = router;
