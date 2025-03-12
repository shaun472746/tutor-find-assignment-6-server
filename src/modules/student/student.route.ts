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

router.post(
  '/make-payment',
  auth(USER_ROLE.student),
  validateMiddleware(studentValidations.bookingPaymentValidationSchema),
  StudentControllers.createPaymentController
);

router.get(
  '/payment-verify',
  auth(USER_ROLE.student),
  StudentControllers.verifyPayment
);
router.get(
  '/past-bookings',
  auth(USER_ROLE.student),
  StudentControllers.getPastBookings
);

router.get(
  '/payment-history',
  auth(USER_ROLE.student),
  StudentControllers.getPaymentHistory
);

router.post(
  '/update-tutor-rating',
  auth(USER_ROLE.student),
  validateMiddleware(studentValidations.tutorRatingValidationSchema),
  StudentControllers.updateTutorRating
);

router.get(
  '/get-tutor-profile-detail/:tutorId',
  auth(USER_ROLE.student),
  StudentControllers.getProfileDetail
);

router.get(
  '/get-tutor-profile-detail-testimonial',

  StudentControllers.getProfileDetailTestimonial
);

router.get('/get-all-newslist/:value', StudentControllers.getBlogNews);

export const StudentRoutes = router;
