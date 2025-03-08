import { model, Schema } from 'mongoose';
import { TAcceptedRequest, TBookingRequest } from './tutor.interface';

const BookingRequestSchema = new Schema<TBookingRequest>(
  {
    availability_slot: { type: String, required: true },
    class: { type: String, required: true },
    subjects: { type: String, required: true },
    hourly_rate: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tutorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
const AcceptRequestSchema = new Schema<TAcceptedRequest>(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'BookingRequestModel',
      required: true,
    },
    class: { type: String, required: true },
    subject: { type: String, required: true },
    hourly_rate: { type: Number, required: true },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tutor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    time_slot: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const AcceptRequestModel = model<TAcceptedRequest>(
  'AcceptRequestModel',
  AcceptRequestSchema
);
export const BookingRequestModel = model<TBookingRequest>(
  'BookingRequestModel',
  BookingRequestSchema
);
