import express from 'express';
import validateMiddleware from '../../app/middleware/validateRequest';
import { studentValidations } from './student.validation';
import { StudentControllers } from './student.controller';
import { USER_ROLE } from '../user-auth/user_auth.constant';
import auth from '../../app/middleware/auth';

const router = express.Router();

router.post(
  '/update-student-profile',
  auth(USER_ROLE.student),
  validateMiddleware(studentValidations.studentValidationSchema),
  StudentControllers.createStudentProfile
);
router.get(
  '/student-profile-detail/:userId',
  auth(USER_ROLE.student),
  StudentControllers.getStudentProfileDetail
);
router.get(
  '/accepted-booking-requests',
  auth(USER_ROLE.student),
  StudentControllers.getAcceptedBookingRequest
);

// router.post('/make-payment', auth(USER_ROLE.student));
export const StudentRoutes = router;
