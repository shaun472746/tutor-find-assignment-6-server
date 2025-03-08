import { model, Schema } from 'mongoose';
import { TBookingPayment, TStudentProfile } from './student.interface';

const StudentProfileSchema = new Schema<TStudentProfile>({
  id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  class: { type: String, required: true },
});

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
const BookingPaymentSchema = new Schema({
  id: { type: Schema.Types.ObjectId, required: true, auto: true },
  hours: { type: Number, required: true },
  month: { type: Number, required: true },
  hourly_rate: { type: Number, required: true },
  userInfo: { type: UserInfoSchema, required: true }, // Embed the UserInfo schema
});

export const BookingPaymentModel = model<TBookingPayment>(
  'BookingPaymentModel',
  BookingPaymentSchema
);
