/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export interface TBookingRequest {
  availability_slot: string;
  class: string;
  subjects: string;
  userId: Types.ObjectId;
  tutorId: Types.ObjectId;
  hourly_rate: number;
  available: boolean;
}

export type querySearchParams = {
  subject: string;
  grade: string;
  location: string;
  rating: number;
  rate: number;
};

export type TAcceptedRequest = {
  id: Types.ObjectId;
  hourly_rate: number;
  student: Types.ObjectId;
  tutor: Types.ObjectId;
  class: string;
  time_slot: string;
  subject: string;
};
