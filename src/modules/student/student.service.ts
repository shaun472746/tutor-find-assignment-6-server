import mongoose from 'mongoose';
import { TBookingPayment, TStudentProfile } from './student.interface';
import { BookingPaymentModel, StudentProfile } from './student.model';
import { TutorProfile, User } from '../user-auth/user_auth.model';
// import { User } from '../user-auth/user_auth.model';
import { AcceptRequestModel } from '../tutor/tutor.model';
import { studentUtils } from './student.utils';
import { JwtPayload } from 'jsonwebtoken';

const createPaymentIntoDB = async (
  bookingPayment: TBookingPayment,
  client_ip: string
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = (await BookingPaymentModel.create([{ ...bookingPayment }], {
      session,
    })) as unknown as Record<string, unknown>[];

    const totalAmount =
      Number(bookingPayment.hours) * Number(bookingPayment.hourly_rate);

    await TutorProfile.findOneAndUpdate(
      { id: bookingPayment.tutorId },
      { $set: { totalEarning: totalAmount } },
      { session }
    );

    await AcceptRequestModel.findByIdAndUpdate(
      bookingPayment.bookingRequestId,
      { $set: { available: false } },
      { session }
    );

    const shurjopayPayload = {
      amount: totalAmount,
      order_id: result?.[0]._id,
      currency: 'BDT',
      customer_name: bookingPayment.userInfo.customer_name,
      customer_address: bookingPayment.userInfo.customer_address,
      customer_email: bookingPayment.userInfo.customer_email,
      customer_phone: bookingPayment.userInfo.customer_phone,
      customer_city: bookingPayment.userInfo.customer_city,
      client_ip,
    };
    const payment = await studentUtils.makePaymentAsync(shurjopayPayload);
    if (payment?.transactionStatus) {
      await BookingPaymentModel.findByIdAndUpdate(
        result[0]._id,
        {
          transaction: {
            id: payment.sp_order_id,
            transactionStatus: payment.transactionStatus,
          },
        },
        { session }
      );
    }
    await session.commitTransaction();
    await session.endSession();

    return payment.checkout_url;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await studentUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await BookingPaymentModel.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : '',
      }
    );
  }

  return verifiedPayment;
};

/**
 * create tutor profile
 */
const createStudentProfileIntoDB = async (profile: TStudentProfile) => {
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
    await StudentProfile.create([{ ...profile }], { session });
    await session.commitTransaction();
    await session.endSession();
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const updateStudentProfileData = async (profile: TStudentProfile) => {
  try {
    await StudentProfile.findOneAndUpdate({ id: profile.id }, profile);
  } catch (err: any) {
    throw new Error(err);
  }
};

const getStudentProfileFromDB = async (id: string) => {
  const profile = (await StudentProfile.findOne({ id: id })) as TStudentProfile;
  return profile;
};

const getAcceptedBookingFromDB = async () => {
  try {
    const acceptedRequests = await AcceptRequestModel.find({
      available: true,
    }).populate({
      path: 'tutor',
      select: '-password -createdAt -updatedAt -__v -isBlocked -updateProfile',
    });
    return acceptedRequests;
  } catch (err) {
    console.log(err);
  }
};

const getPastBookingsFromDB = async () => {
  try {
    const result = await AcceptRequestModel.find({ available: false }).populate(
      {
        path: 'tutor',
        select:
          '-password -createdAt -updatedAt -__v -isBlocked -updateProfile',
      }
    );

    return result;
  } catch (err: any) {
    throw new Error(err);
  }
};

const getPaymentHistoryFromDB = async (user: JwtPayload) => {
  try {
    const bookingIds = await AcceptRequestModel.find({
      student: user.userId,
    }).select('_id');
    const result = await BookingPaymentModel.find({
      bookingRequestId: { $in: bookingIds },
    }).populate({
      path: 'bookingRequestId',
      populate: {
        path: 'tutor',
        select: 'name',
      },
    });
    // userId

    return result;
  } catch (err: any) {
    throw new Error(err);
  }
};

const updateTutorRatingIntoDB = async (rating: {
  rate: number;
  tutorId: string;
}) => {
  try {
    await TutorProfile.findOneAndUpdate(
      { id: rating.tutorId },
      {
        $set: { rating: rating.rate },
      }
    );
  } catch (err: any) {
    throw new Error(err);
  }
};

export const StudentServices = {
  createStudentProfileIntoDB,
  updateStudentProfileData,
  getStudentProfileFromDB,
  getAcceptedBookingFromDB,
  createPaymentIntoDB,
  verifyPayment,
  getPastBookingsFromDB,
  getPaymentHistoryFromDB,
  updateTutorRatingIntoDB,
};
