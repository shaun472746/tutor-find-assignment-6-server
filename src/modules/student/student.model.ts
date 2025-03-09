import { model, Schema } from 'mongoose';
import { TBookingPayment, TStudentProfile } from './student.interface';

const StudentProfileSchema = new Schema<TStudentProfile>(
  {
    id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    class: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const StudentProfile = model<TStudentProfile>(
  'StudentProfile',
  StudentProfileSchema
);

const UserInfoSchema = new Schema({
  customer_address: { type: String, required: true },
  customer_city: { type: String, required: true },
  customer_email: { type: String, required: true },
  customer_name: { type: String, required: true },
  customer_phone: { type: String, required: true },
});

// Define the TBookingPayment schema
const BookingPaymentSchema = new Schema(
  {
    bookingRequestId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AcceptRequestModel',
      auto: true,
    },
    hours: { type: Number, required: true },
    month: { type: Number, required: true },
    hourly_rate: { type: Number, required: true },
    userInfo: { type: UserInfoSchema, required: true }, // Embed the UserInfo schema
    transaction: {
      id: { type: String, required: false },
      transactionStatus: { type: String, required: false },
      bank_status: { type: String, required: false },
      sp_code: { type: String, required: false },
      sp_message: { type: String, required: false },
      method: { type: String, required: false },
      date_time: { type: String, required: false },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const BookingPaymentModel = model<TBookingPayment>(
  'BookingPaymentModel',
  BookingPaymentSchema
);
