import sendResponse from '../../app/middleware/sendResponse';
import catchAsync from '../../app/utils/catchAsync';
import { StudentServices } from './student.service';

const createStudentProfile = catchAsync(async (req, res) => {
  if (req.body._id) {
    await StudentServices.updateStudentProfileData(req.body);
  } else {
    await StudentServices.createStudentProfileIntoDB(req.body);
  }

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Profile updated successfully',
  });
});

/**
 * get profile detail
 */
const getStudentProfileDetail = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await StudentServices.getStudentProfileFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile detail retrieved successfully!',
    data: result,
  });
});

// get booking data
const getAcceptedBookingRequest = catchAsync(async (req, res) => {
  const result = await StudentServices.getAcceptedBookingFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Accepted bookings retrieved successfully!',
    data: result,
  });
});

// make payment
const createPaymentController = catchAsync(async (req, res) => {
  const result = await StudentServices.createPaymentIntoDB(req.body, req.ip!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'payment created successfully!',
    data: result,
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const result = await StudentServices.verifyPayment(
    req.query.order_id as string
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Booking request verified successfully',
    data: result,
  });
});

const getPastBookings = catchAsync(async (req, res) => {
  const result = await StudentServices.getPastBookingsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Past bookings retrieved successfully',
    data: result,
  });
});

const getPaymentHistory = catchAsync(async (req, res) => {
  const result = await StudentServices.getPaymentHistoryFromDB(req.user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment history retrieved successfully',
    data: result,
  });
});

export const StudentControllers = {
  createStudentProfile,
  getStudentProfileDetail,
  getAcceptedBookingRequest,
  createPaymentController,
  verifyPayment,
  getPastBookings,
  getPaymentHistory,
};
