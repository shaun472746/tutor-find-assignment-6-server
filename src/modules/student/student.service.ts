import mongoose from 'mongoose';
import { TStudentProfile } from './student.interface';
import { StudentProfile } from './student.model';
import { User } from '../user-auth/user_auth.model';
import { AcceptRequestModel } from '../tutor/tutor.model';
// import { TUser } from '../user-auth/user_auth.interface';

// const createPaymentIntoDB = async (
//   bookingPayment: TBookingPayment,
//   client_ip: string,
//   user:TUser
// ) => {
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     const result = await BookingPaymentModel.create(bookingPayment,{ session });

//     const totalAmount =
//       Number(bookingPayment.hours) * Number(bookingPayment.hourly_rate);

//       await TutorProfile.findByIdAndUpdate()
//     const shurjopayPayload = {
//       amount: totalAmount,
//       order_id: result._id,
//       currency: 'BDT',
//       customer_name: bookingPayment.userInfo.customer_name,
//       customer_address: bookingPayment.userInfo.customer_address,
//       customer_email: bookingPayment.userInfo.customer_email,
//       customer_phone: bookingPayment.userInfo.customer_phone,
//       customer_city: bookingPayment.userInfo.customer_city,
//       client_ip,
//     };
//   } catch (err: any) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new Error(err);
//   }

// };
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
    const acceptedRequests = await AcceptRequestModel.find().populate({
      path: 'tutor',
      select: '-password -createdAt -updatedAt -__v -isBlocked -updateProfile',
    });
    return acceptedRequests;
  } catch (err) {
    console.log(err);
  }
};

export const StudentServices = {
  createStudentProfileIntoDB,
  updateStudentProfileData,
  getStudentProfileFromDB,
  getAcceptedBookingFromDB,
  // createPaymentIntoDB,
};
