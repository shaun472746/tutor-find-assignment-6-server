import sendResponse from '../../app/middleware/sendResponse';
import catchAsync from '../../app/utils/catchAsync';
import { TutorDetailServices } from './tutor.service';

const getTutorProfileDetail = catchAsync(async (req, res) => {
  const result = await TutorDetailServices.getTutorProfileFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tutor detail retrieved successfully!',
    data: result,
  });
});

const createBookingRequestController = catchAsync(async (req, res) => {
  const result = await TutorDetailServices.createBookingRequestIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking request created successfully!',
    data: result,
  });
});
const createAcceptBookingRequestController = catchAsync(async (req, res) => {
  const result = await TutorDetailServices.createAcceptBookingRequestIntoDB(
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking request accepted successfully!',
    data: result,
  });
});

const getAllBookingRequests = catchAsync(async (req, res) => {
  const { tutorId } = req.params;

  const result = await TutorDetailServices.getAllBookingsFromDB(tutorId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking request created successfully!',
    data: result,
  });
});

const rejectBookingRequestController = catchAsync(async (req, res) => {
  const { bookingId } = req.params;

  await TutorDetailServices.rejectBookingRequestIntoDB(bookingId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking request rejected successfully!',
  });
});

export const TutorControllers = {
  getTutorProfileDetail,
  createBookingRequestController,
  getAllBookingRequests,
  createAcceptBookingRequestController,
  rejectBookingRequestController,
};
