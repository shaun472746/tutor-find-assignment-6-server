import express from 'express';
import { TutorControllers } from './tutor.controller';
import validateMiddleware from '../../app/middleware/validateRequest';
import { bookingRequestValidations } from './tutor.validation';
import { USER_ROLE } from '../user-auth/user_auth.constant';
import auth from '../../app/middleware/auth';

const router = express.Router();

router.get('/get-all-tutors', TutorControllers.getTutorProfileDetail);
router.get(
  '/get-all-bookings/:tutorId',
  auth(USER_ROLE.tutor),
  TutorControllers.getAllBookingRequests
);
// router.get('/tutors');
router.post(
  '/create-booking-request',
  auth(USER_ROLE.student),
  validateMiddleware(
    bookingRequestValidations.createBookingRequestValidationSchema
  ),
  TutorControllers.createBookingRequestController
);
router.post(
  '/create-accept-booking-request',
  auth(USER_ROLE.tutor),
  validateMiddleware(
    bookingRequestValidations.createAcceptBookingRequestValidationSchema
  ),
  TutorControllers.createAcceptBookingRequestController
);

router.patch(
  '/reject-booking-request/:bookingId',
  auth(USER_ROLE.tutor),
  TutorControllers.rejectBookingRequestController
);

export const TutorRoutes = router;
