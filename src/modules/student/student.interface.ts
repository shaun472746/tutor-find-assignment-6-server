import { Types } from 'mongoose';

export interface TStudentProfile {
  id?: Types.ObjectId;
  address: string;
  phone: string;
  class: string;
}

export type TBookingPayment = {
  id: Types.ObjectId;
  hours: number;
  month: number;
  userInfo: TuserInfo;
  hourly_rate: number;
};

type TuserInfo = {
  customer_address: string;
  customer_city: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
};
